require("dotenv").config();
import * as fs from "fs";
import * as path from "path";
import BunqJSClient from "@bunq-community/bunq-js-client";
import JSONFileStore from "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore";

import bunqDataSets from "./DataSets/bunqDataSets";

Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil(((this - onejan) / millisecsInDay + onejan.getDay() + 1) / 7);
};
Date.prototype.getMonthString = function() {
    const month = this.getMonth();
    return `${month}`.length === 1 ? `0${month}` : `${month}`;
};

const ONE_DAY = 24 * 60 * 60 * 1000;
const getTimeBetween = (date1, date2, interval, rounded = true) => {
    const daysBetweenUnrounded = Math.abs((date1.getTime() - date2.getTime()) / interval);
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
        console.error("Missing environment variables to generate new bunq data");
        return false;
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
    if (!BunqClient) {
        return {
            payments: [],
            invoices: []
        };
    }

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
        const dateString = `${date.getFullYear()}:${date.getMonthString()}`;

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
            paymentTracker[dateString] = {
                date: paymentInfo.created,
                id: paymentInfo.id
            };
        } else {
            const compareDate = new Date(paymentTracker[dateString].date);
            // get a payment as early as possible for this week
            if (compareDate > date) {
                paymentTracker[dateString].id = paymentInfo.id;
            }
        }
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
        .map(dateString => paymentTracker[dateString])
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();
    console.log("updated paymentData", paymentData.length);

    // write this dataset to the given dataset name
    const dataSetName = process.env.STORAGE_NAME ? process.env.STORAGE_NAME : "updated-bunq-data";
    fs.writeFileSync(
        `${__dirname}${path.sep}DataSets${path.sep}${dataSetName}.json`,
        JSON.stringify({
            payments: paymentData,
            invoices: invoiceData
        })
    );
};

/**
 * Calculates the invoice ID change number for each dataset separately and then
 * calculates an average value
 * @param dataSet
 */
const calculateInvoiceChangeValues = dataSet => {
    const invoices = dataSet.invoices;
    const dataSetChangeValues = {};
    const dataSetAdjustedChangeValues = {};
    if (invoices.length === 0) return {};

    let previousId = invoices[0].id;
    let previousDate = new Date(invoices[0].date);
    invoices.forEach((invoice, index) => {
        const date = new Date(invoice.date);
        const dateDay = date.getDate();
        const dateString = `${date.getFullYear()}:${date.getMonthString()}`;
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
        const daysBetweenValue = getTimeBetween(date, previousDate, ONE_DAY, false);
        if (daysBetweenValue !== 0) {
            const invoiceIdSecondChange = invoiceId - previousId;
            const estimatedDailyChange = invoiceIdSecondChange / daysBetweenValue;
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

const calculatePaymentChangeValues = payments => {
    const dataSetChangeValues = {};
    if (payments.length === 0) return {};

    let previousId = payments[0].id;
    let previousDate = new Date(payments[0].date);
    payments.forEach((payment, index) => {
        const date = new Date(payment.date);
        const dateString = `${date.getFullYear()}:${date.getWeek()}`;
        if (!dataSetChangeValues[dateString]) {
            dataSetChangeValues[dateString] = [];
        }
        const paymentId = payment.id;

        // change in payment ID versus previous payment
        const paymentIdChange = paymentId - previousId;

        // attempt to get a decent estimate for what the value was at the 1st day of the week
        const daysBetweenDates = getTimeBetween(date, previousDate, ONE_DAY, false);

        // store the values for next loop
        previousDate = date;
        previousId = paymentId;

        // push to the dataset stack
        dataSetChangeValues[dateString].push(paymentIdChange / daysBetweenDates);
    });

    const combinedChangeValues = {};
    Object.keys(dataSetChangeValues).map(dateString => {
        const changeValues = dataSetChangeValues[dateString];

        const reducedValues = changeValues.reduce((total, changeValue) => total + changeValue, 0);
        combinedChangeValues[dateString] = reducedValues;
    });

    return combinedChangeValues;
};

const start = async () => {
    // get a updated set for the current API user
    // await getUpdatedDataset();

    // group by week or month for each use case to get averages
    const paymentTracker = {};
    const invoiceTracker = {};

    const dataSets = bunqDataSets(`${__dirname}/DataSets`);

    // now go through the static datasets
    dataSets.forEach(dataSet => {
        // get the first payment for each week
        dataSet.payments.forEach(payment => {
            const date = new Date(payment.date);
            const dateString = `${date.getFullYear()}:${date.getWeek()}`;

            if (!paymentTracker[dateString]) {
                paymentTracker[dateString] = {
                    date: payment.date,
                    id: payment.id
                };
            } else {
                const compareDate = new Date(paymentTracker[dateString].date);
                // get a payment as early as possible for this week
                if (compareDate > date) {
                    paymentTracker[dateString].id = payment.id;
                }
            }
        });

        // combine the ids with the normalized change values
        const normalizedInvoices = calculateInvoiceChangeValues(dataSet);
        dataSet.invoices.forEach(invoice => {
            const date = new Date(invoice.date);
            const dateString = `${date.getFullYear()}:${date.getMonthString()}`;
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

    // calculate averages and push to data list
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
    const paymentsCombined = Object.keys(paymentTracker)
        .map(dateString => {
            return paymentTracker[dateString];
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();

    // calculate change values and adjusted changes values
    const paymentChangeData = calculatePaymentChangeValues(paymentsCombined);

    // combine data back to a regular dataset
    const paymentData = paymentsCombined.map(payment => {
        const date = new Date(payment.date);
        const dateString = `${date.getFullYear()}:${date.getWeek()}`;

        return {
            id: payment.id,
            date: payment.date,
            change: Math.round(paymentChangeData[dateString])
        };
    });
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
