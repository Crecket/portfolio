require("dotenv").config();
import * as fs from "fs";
import * as path from "path";
import BunqJSClient from "@bunq-community/bunq-js-client";
import JSONFileStore from "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore";

import dataSets from "./DataSets/bunqDataSets";

Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil(((this - onejan) / millisecsInDay + onejan.getDay() + 1) / 7);
};

const oneDay = 24 * 60 * 60 * 1000;
const getDaysBetween = (date1, date2, rounded = true) => {
    const daysBetweenUnrounded = Math.abs((date1.getTime() - date2.getTime()) / oneDay);
    if (rounded) return Math.round(daysBetweenUnrounded);

    return daysBetweenUnrounded;
};

/**
 * Setup the bunqJSClient
 * @returns {Promise<BunqJSClient>}
 */
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

    const customStoreInstance = JSONFileStore(`${__dirname}${path.sep}..${path.sep}storage.json`);

    const BunqClient = new BunqJSClient(customStoreInstance);
    await BunqClient.run(process.env.BUNQ_API_KEY, [], process.env.BUNQ_ENVIRONMENT, process.env.BUNQ_ENCRYPTION_KEY);

    BunqClient.setKeepAlive(false);
    await BunqClient.install();
    await BunqClient.registerDevice(process.env.BUNQ_DEVICE_NAME);
    await BunqClient.registerSession();

    return BunqClient;
};

/**
 * Loop through a account to get all it's payments
 * @param BunqClient
 * @param userId
 * @param accountId
 * @param older_id
 * @returns {Promise<*>}
 */
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

/**
 * Calculates the dataSet for the current API user
 */
const getUpdatedDataset = async () => {
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

    // invoice list
    const invoices = await BunqClient.api.invoice.list(user.id);
    const invoiceTracker = {};
    invoices.forEach(invoice => {
        const info = invoice.Invoice;
        const date = new Date(info.created);
        const dateString = `${date.getFullYear()}:${date.getMonth()}`;

        if (!invoiceTracker[dateString]) {
            // store this month as already existing
            invoiceTracker[dateString] = {
                date: info.created,
                count: 0,
                amount: 0
            };
        }

        invoiceTracker[dateString].count += 1;
        invoiceTracker[dateString].amount += info.invoice_number;
    });

    // payment list
    const payments = await getPaymentsRecursive(BunqClient, user.id, account.id);
    const paymentTracker = {};
    payments.map(payment => {
        const paymentInfo = payment.Payment;

        const date = new Date(paymentInfo.created);
        const dateString = `${date.getFullYear()}:${date.getWeek()}`;

        if (!paymentTracker[dateString]) {
            // store this month as already existing
            paymentTracker[dateString] = {
                date: paymentInfo.created,
                count: 0,
                amount: 0
            };
        }

        paymentTracker[dateString].count += 1;
        paymentTracker[dateString].amount += paymentInfo.id;
    });

    const invoiceData = Object.keys(invoiceTracker)
        .map(dateString => {
            const object = invoiceTracker[dateString];

            return {
                id: Math.round(object.amount / object.count),
                date: object.date
            };
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();
    console.log("updated invoiceData", invoiceData.length);

    const paymentData = Object.keys(paymentTracker)
        .map(dateString => {
            const object = paymentTracker[dateString];

            return {
                id: Math.round(object.amount / object.count),
                date: object.date
            };
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();
    console.log("updated paymentData", paymentData.length);

    // write to a file in public dir
    fs.writeFileSync(
        `${__dirname}${path.sep}DataSets${path.sep}updated-bunq-data.json`,
        JSON.stringify({
            payments: paymentData,
            invoices: invoiceData
        })
    );

    return {
        payments: paymentData,
        invoices: invoiceData
    };
};

/**
 * Calculates the invoice ID change number for each dataset separately and then
 * calculates an average value
 * @param dataSet
 */
const normalizeInvoices = dataSet => {
    const invoices = dataSet.invoices;
    const dataSetChangeValues = {};
    const dataSetAdjustedChangeValues = {};
    if (invoices.length === 0) return {};

    let previousId = invoices[0].id;
    let previousDate = new Date(invoices[0].date);
    invoices.forEach((invoice, index) => {
        const date = new Date(invoice.date);
        const dateDay = date.getDate();
        const dateString = `${date.getFullYear()}:${date.getMonth()}`;
        if (!dataSetChangeValues[dateString]) {
            dataSetChangeValues[dateString] = [];
        }
        if (!dataSetAdjustedChangeValues[dateString]) {
            dataSetAdjustedChangeValues[dateString] = [];
        }
        const invoiceId = invoice.id;

        // change in invoice ID versus previous invoice
        const invoiceIdChange = invoiceId - previousId;
        // default adjusted value to actual value
        let adjustedChangeValue = invoiceIdChange;

        // attempt to get a decent estimate for what the value was at the 15th of the month
        const daysBetweenValue2 = getDaysBetween(date, previousDate, false);
        if (daysBetweenValue2 !== 0) {
            const invoiceIdSecondChange = invoiceId - previousId;
            const estimatedDailyChange = invoiceIdSecondChange / daysBetweenValue2;
            const daysUntil15th = 15 - dateDay;
            const adjustmentValue = daysUntil15th * estimatedDailyChange;
            const adjustedInvoiceId = invoiceId + adjustmentValue;
            adjustedChangeValue = adjustedInvoiceId - previousId;
        }

        // store the values for next loop
        previousDate = date;
        previousId = invoiceId;

        // push to the dataset stack
        dataSetChangeValues[dateString].push(invoiceIdChange);
        dataSetAdjustedChangeValues[dateString].push(adjustedChangeValue);
    });

    const combinedChangeValues = {};
    Object.keys(dataSetChangeValues).map(dateString => {
        const changeValues = dataSetChangeValues[dateString];

        const reducedValues = changeValues.reduce((total, changeValue) => total + changeValue, 0);
        combinedChangeValues[dateString] = reducedValues;
    });
    const combinedAdjustedChangeValues = {};
    Object.keys(dataSetAdjustedChangeValues).map(dateString => {
        const changeValues = dataSetAdjustedChangeValues[dateString];

        const reducedValues = changeValues.reduce((total, changeValue) => total + changeValue, 0);
        combinedAdjustedChangeValues[dateString] = reducedValues;
    });

    return {
        regular: combinedChangeValues,
        adjusted: combinedAdjustedChangeValues
    };
};

const start = async () => {
    // get a updated set for the current API user
    const updatedDataset = await getUpdatedDataset();
    dataSets.push(updatedDataset);

    // group by week or month for each use case to get averages
    const paymentTracker = {};
    const invoiceTracker = {};

    // now go through the static datasets
    dataSets.forEach(dataSet => {
        const normalizedInvoices = normalizeInvoices(dataSet);

        console.log(normalizedInvoices);

        dataSet.payments.forEach(payment => {
            const date = new Date(payment.date);
            const dateString = `${date.getFullYear()}:${date.getWeek()}`;
            if (!paymentTracker[dateString]) {
                paymentTracker[dateString] = {
                    date: payment.date,
                    count: 0,
                    amount: 0
                };
            }

            paymentTracker[dateString].count += 1;
            paymentTracker[dateString].amount += payment.id;
        });
        dataSet.invoices.forEach(invoice => {
            const date = new Date(invoice.date);
            const dateString = `${date.getFullYear()}:${date.getMonth()}`;
            if (!invoiceTracker[dateString]) {
                invoiceTracker[dateString] = {
                    date: invoice.date,
                    count: 0,
                    change: 0,
                    changeAdjusted: 0,
                    amount: 0
                };
            }

            invoiceTracker[dateString].count += 1;
            invoiceTracker[dateString].amount += invoice.id;
            invoiceTracker[dateString].change += normalizedInvoices.regular[dateString];
            invoiceTracker[dateString].changeAdjusted += normalizedInvoices.adjusted[dateString];
        });
    });

    // calculate average and push to data list
    const invoiceData = Object.keys(invoiceTracker)
        .map(dateString => {
            const object = invoiceTracker[dateString];

            return {
                id: Math.round(object.amount / object.count),
                change: Math.round(object.change / object.count),
                changeAdjusted: Math.round(object.changeAdjusted / object.count),
                date: object.date
            };
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();
    console.log("combined invoiceData", invoiceData.length);

    // calculate average and push to data list
    const paymentData = Object.keys(paymentTracker)
        .map(dateString => {
            const object = paymentTracker[dateString];

            return {
                id: Math.round(object.amount / object.count),
                date: object.date
            };
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();
    console.log("combined paymentData", paymentData.length);

    // write to a file in public dir
    fs.writeFileSync(
        `${__dirname}${path.sep}..${path.sep}public${path.sep}bunq-data.json`,
        JSON.stringify({
            invoices: invoiceData,
            payments: paymentData,
            dataSets: dataSets
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
