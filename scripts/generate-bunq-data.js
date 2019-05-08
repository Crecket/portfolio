import * as fs from "fs";
import * as path from "path";
import BunqJSClient from "@bunq-community/bunq-js-client";
import JSONFileStore from "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore";

import bunqDataSets from "./DataSets/bunqDataSets";

require("dotenv").config();

const invoiceIdOverwrites = [{ id: 1072130, newId: 1045465, date: "2019-02-08 22:18:10.491460" }];

Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil(((this - onejan) / millisecsInDay + onejan.getDay() + 1) / 7);
};
Date.prototype.getMonthString = function() {
    const month = this.getMonth();
    return `${month}`.length === 1 ? `0${month}` : `${month}`;
};
Date.prototype.addDays = function(days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;
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

const getGenericTypeRecursive = async (BunqClient, eventType, handlerKey, userId, accountId, olderId) => {
    const options = {
        count: 200
    };
    if (olderId) options.older_id = olderId;

    const events = await BunqClient.api[handlerKey].list(userId, accountId, options);
    if (events.length < 200) return events;

    const oldestId = events[events.length - 1][eventType].id;
    const nestedEvents = await getGenericTypeRecursive(BunqClient, eventType, handlerKey, userId, accountId, oldestId);

    return [...events, ...nestedEvents];
};

const getGenericType = (BunqClient, userId, accountId) => async (eventType, handlerKey) => {
    const events = await getGenericTypeRecursive(BunqClient, eventType, handlerKey, userId, accountId);

    const eventTracker = {};
    events.map(event => {
        const eventInfo = event[eventType];

        const date = new Date(eventInfo.created);
        const dateString = `${date.getFullYear()}:${date.getWeek()}`;

        if (!eventTracker[dateString]) {
            eventTracker[dateString] = {
                date: eventInfo.created,
                id: eventInfo.id
            };
        } else {
            const compareDate = new Date(eventTracker[dateString].date);
            // get a event as early as possible for this week
            if (compareDate > date) {
                eventTracker[dateString].id = eventInfo.id;
            }
        }
    });

    return Object.keys(eventTracker)
        .map(dateString => eventTracker[dateString])
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();
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
    const invoices = await BunqClient.api.invoice.list(user.id, { count: 200 });
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
    console.log("updated invoice data", invoiceData.length);

    const getGenericTypeHandler = getGenericType(BunqClient, user.id, account.id);

    const paymentData = await getGenericTypeHandler("Payment", "payment");
    console.log("updated payment data", paymentData.length);

    const requestInquiryData = await getGenericTypeHandler("RequestInquiry", "requestInquiry");
    console.log("updated requestInquiry data", requestInquiryData.length);

    const masterCardActionData = await getGenericTypeHandler("MasterCardAction", "masterCardAction");
    console.log("updated masterCardAction data", masterCardActionData.length);

    // write this dataset to the given dataset name
    const dataSetName = process.env.STORAGE_NAME ? process.env.STORAGE_NAME : "updated-bunq-data";
    fs.writeFileSync(
        `${__dirname}${path.sep}DataSets${path.sep}${dataSetName}.json`,
        JSON.stringify(
            {
                payments: paymentData,
                invoices: invoiceData,
                requestInquiries: requestInquiryData,
                masterCardActions: masterCardActionData
            },
            null,
            2
        )
    );
};

/**
 * Calculates the invoice ID change number for each dataset separately and then
 * calculates an average value
 * @param dataSet
 */
const calculateInvoiceChangeValues = dataSet => {
    const invoices = dataSet.invoices;
    const dataSetAdjustedChangeValues = {};
    if (invoices.length === 0) return {};

    let previousId = invoices[0].id;
    let previousDate = new Date(invoices[0].date);
    invoices.forEach((invoice, index) => {
        const date = new Date(invoice.date);
        const dateDay = date.getDate();
        const dateString = `${date.getFullYear()}:${date.getMonthString()}`;
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
        dataSetAdjustedChangeValues[dateString].push(adjustedChangeValue);
    });

    const combinedAdjustedChangeValues = {};
    Object.keys(dataSetAdjustedChangeValues).map(dateString => {
        const changeValues = dataSetAdjustedChangeValues[dateString];

        const reducedValues = changeValues.reduce((total, changeValue) => total + changeValue, 0);
        combinedAdjustedChangeValues[dateString] = reducedValues;
    });

    return combinedAdjustedChangeValues;
};

const calculatePaymentChangeValues = payments => {
    const dataSetChangeValues = {};
    if (payments.length === 0) return {};

    const firstPaymentDate = new Date(payments[0].date);
    const lastPaymentDate = new Date(payments[payments.length - 1].date);

    // round the dates and get the first day of those weeks
    const firstWeekDate = new Date(
        firstPaymentDate.getFullYear(),
        firstPaymentDate.getMonth(),
        firstPaymentDate.getDate()
    );
    firstWeekDate.setDate(firstWeekDate.getDate() - firstWeekDate.getDay());
    const lastWeekDate = new Date(lastPaymentDate.getFullYear(), lastPaymentDate.getMonth(), lastPaymentDate.getDate());
    lastWeekDate.setDate(lastWeekDate.getDate() - lastWeekDate.getDay());

    // get the total days between the outer weeks
    const daysBetweenDates = getTimeBetween(firstWeekDate, lastWeekDate, ONE_DAY);

    // fill a list with all the weeks between the first and last date
    const weeklyDates = [];
    for (let i = 0; i < daysBetweenDates; i += 7) {
        const weeklyDate = firstWeekDate.addDays(i);
        weeklyDates.push(weeklyDate);
    }

    const weeklyValues = [];
    weeklyDates.forEach(weeklyDate => {
        const beforeWeekPayment = payments.reverse().find(payment => {
            const paymentDate = new Date(payment.date);
            if (paymentDate < weeklyDate) return true;

            return false;
        });
        // reverse back
        payments.reverse();

        const afterWeekPayment = payments.find(payment => {
            const paymentDate = new Date(payment.date);
            if (paymentDate > weeklyDate) return true;

            return false;
        });

        if (!beforeWeekPayment) return;
        if (!afterWeekPayment) return;

        const paymentBeforeDate = new Date(beforeWeekPayment.date);
        const paymentAfterDate = new Date(afterWeekPayment.date);
        // total change between the two surrounding payments
        const paymentIdChange = afterWeekPayment.id - beforeWeekPayment.id;
        // calculate hours between the two surrounding payments
        const hoursBetween = getTimeBetween(paymentBeforeDate, paymentAfterDate, ONE_HOUR);
        // calculate the amount of hours from the before payment to the weekly date
        const startToWeeklyDateBetween = getTimeBetween(paymentBeforeDate, weeklyDate, ONE_HOUR);
        // how much payments/hour for the surrounding payments
        const hourlyChange = paymentIdChange / hoursBetween;
        // calculate weekly id estimate
        const weeklyDateIdEstimate = Math.round(beforeWeekPayment.id + hourlyChange * startToWeeklyDateBetween);

        weeklyValues.push({
            date: weeklyDate,
            id: weeklyDateIdEstimate
        });
    });

    let previousId = payments[0].id;
    let previousDate = new Date(payments[0].date);
    weeklyValues.forEach((weeklyEstimate, index) => {
        // change in payment ID versus previous payment
        const paymentIdChange = weeklyEstimate.id - previousId;
        const daysBetweenDates = getTimeBetween(previousDate, weeklyEstimate.date, ONE_DAY, true);

        // store the values for next loop
        previousDate = weeklyEstimate.date;
        previousId = weeklyEstimate.id;

        // push to the dataset stack
        weeklyValues[index].change = paymentIdChange / daysBetweenDates;
    });

    return weeklyValues;
};

const start = async () => {
    // get a updated set for the current API user
    await getUpdatedDataset();

    // group by week or month for each use case to get averages
    const paymentTracker = {};
    const invoiceTracker = {};

    const dataSets = bunqDataSets(`${__dirname}/DataSets`);

    dataSets.forEach((dataSet, dataSetIndex) => {
        dataSet.invoices.forEach((item, index) => {
            // check each override for each dataset item
            invoiceIdOverwrites.forEach(override => {
                if (item.id !== override.id) return;

                dataSets[dataSetIndex].invoices[index] = {
                    id: override.newId,
                    date: override.date
                };
            });
        });
    });

    // go through data sets and combine them
    dataSets.forEach(dataSet => {
        // get the first payment for each week
        dataSet.payments.forEach(payment => {
            const date = new Date(payment.date);
            const dateString = `${date.getFullYear()}:${date.getMonth()}:${date.getDate()}`;

            if (!paymentTracker[dateString]) {
                paymentTracker[dateString] = {
                    date: payment.date,
                    id: payment.id
                };
            } else {
                const compareDate = new Date(paymentTracker[dateString].date);
                // get a payment as early as possible for the date
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
                    amount: 0
                };
            }

            invoiceTracker[dateString].count += 1;
            invoiceTracker[dateString].amount += invoice.id;
            invoiceTracker[dateString].change += normalizedInvoices[dateString];
        });
    });

    // calculate averages and push to data list
    const invoiceData = Object.keys(invoiceTracker)
        .map(dateString => {
            const object = invoiceTracker[dateString];

            return {
                id: Math.round(object.amount / object.count),
                change: Math.round(object.change / object.count),
                date: object.date
            };
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();
    console.log("combined invoiceData", invoiceData.length);

    // map payments to a sorted list
    const paymentsCombined = Object.keys(paymentTracker)
        .map(dateString => {
            return paymentTracker[dateString];
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();

    // calculate change values and adjusted changes values
    const paymentChangeData = calculatePaymentChangeValues(paymentsCombined);
    console.log("combined paymentData", paymentChangeData.length);

    // write to a file in public dir
    fs.writeFileSync(
        `${__dirname}${path.sep}..${path.sep}public${path.sep}bunq-data.json`,
        JSON.stringify({
            invoices: invoiceData,
            payments: paymentChangeData,
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
