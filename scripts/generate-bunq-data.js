require("dotenv").config();
import * as fs from "fs";
import * as path from "path";
import BunqJSClient from "@bunq-community/bunq-js-client";
import JSONFileStore from "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore";

Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil(((this - onejan) / millisecsInDay + onejan.getDay() + 1) / 7);
};

const setup = async () => {
    if (
        !process.env.BUNQ_API_KEY ||
        !process.env.BUNQ_ENVIRONMENT ||
        !process.env.BUNQ_ENCRYPTION_KEY ||
        !process.env.BUNQ_DEVICE_NAME
    ) {
        console.error("Missing environment variables to generate bunq charts");
        process.exit();
    }

    const customStoreInstance = JSONFileStore(`${__dirname}${path.sep}..${path.sep}.cache${path.sep}storage.json`);

    const BunqClient = new BunqJSClient(customStoreInstance);
    await BunqClient.run(process.env.BUNQ_API_KEY, [], process.env.BUNQ_ENVIRONMENT, process.env.BUNQ_ENCRYPTION_KEY);

    BunqClient.setKeepAlive(false);
    await BunqClient.install();
    await BunqClient.registerDevice(process.env.BUNQ_DEVICE_NAME);
    await BunqClient.registerSession();

    return BunqClient;
};

const getPaymentsRecursive = async (BunqClient, userId, accountId, older_id = false) => {
    const options = {
        count: 200
    };
    if (older_id) options.older_id = older_id;

    const payments = await BunqClient.api.payment.list(userId, accountId, options);
    if (payments.length < 200) return payments;

    const oldestId = payments[payments.length - 1].Payment.id;
    const nestedPayments = await getPaymentsRecursive(BunqClient, userId, accountId, oldestId);

    return [...payments, ...nestedPayments];
};

const start = async () => {
    const BunqClient = await setup();

    // user info
    const userInfo = await BunqClient.getUsers();
    const userType = Object.keys(userInfo)[0];
    const user = userInfo[userType];

    // account info
    const monetaryAccounts = await BunqClient.api.monetaryAccount.list(user.id);
    const filteredAccounts = monetaryAccounts.filter(monetaryAccount => {
        const type = Object.keys(monetaryAccount)[0];
        return monetaryAccount[type].status === "ACTIVE";
    });
    // get first active account
    const accountType = Object.keys(filteredAccounts[0])[0];
    const account = filteredAccounts[0][accountType];

    const invoiceData = [];

    // go through all invoices
    // TODO group by month
    const invoices = await BunqClient.api.invoice.list(user.id);
    const invoicetracker = {};
    invoices
        .reverse()
        .filter(invoice => {
            const date = new Date(invoice.Invoice.created);
            const dateString = `${date.getFullYear()}:${date.getMonth()}`;

            if (!invoicetracker[dateString]) {
                // store this month as already existing
                invoicetracker[dateString] = true;
                return true;
            }
            return false;
        })
        .forEach(i => {
            const info = i.Invoice;
            invoiceData.push({
                id: info.id,
                date: info.created
            });
        });
    console.log("invoiceData", invoiceData.length);

    // payment list
    const payments = await getPaymentsRecursive(BunqClient, user.id, account.id);
    const paymentTracker = {};
    const paymentData = payments
        .filter(payment => {
            const date = new Date(payment.Payment.created);
            const dateString = `${date.getFullYear()}:${date.getWeek()}`;

            if (!paymentTracker[dateString]) {
                // store this month as already existing
                paymentTracker[dateString] = true;
                return true;
            }

            return false;
        })
        .map(payment => {
            const paymentInfo = payment.Payment;
            return {
                id: paymentInfo.id,
                date: paymentInfo.created
            };
        })
        .reverse();
    console.log("paymentData", paymentData.length);

    // write to a file in public dir
    fs.writeFileSync(
        `${__dirname}${path.sep}..${path.sep}public${path.sep}bunq-data.json`,
        JSON.stringify({
            payments: paymentData,
            invoices: invoiceData
        })
    );
};

start()
    .then(() => {})
    .catch(error => {
        if (error.response) {
            throw error.response.data;
        }
        throw error;
    })
    .catch(console.error)
    .finally(() => process.exit());
