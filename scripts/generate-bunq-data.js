import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import BunqJSClient from "@bunq-community/bunq-js-client";
import JSONFileStore from "@bunq-community/bunq-js-client/dist/Stores/JSONFileStore";

import bunqDataSets from "../src/DataSets/bunqDataSets";

require("dotenv").config();
const awaiting = require("awaiting");

const invoiceIdOverwrites = [
    { id: 1072130, newId: 1045465, date: "2019-02-08 22:18:10.491460" },
    { id: 191665, newId: 179101, date: "2017-08-01 17:23:23.776410" }
];

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

/**
 * Get generic API data recursively
 */
const getGenericTypeRecursive = async (BunqClient, eventType, handlerKey, userId, accountId = false, olderId) => {
    const options = {
        count: 200
    };
    if (olderId) options.older_id = olderId;

    // construct parameter list to make accountId optional
    const parameters = [userId];
    if (accountId) parameters.push(accountId);
    parameters.push(options);

    // call the actual endpoint
    console.log(` -> Fetching ${eventType} data: ${JSON.stringify(parameters)}`);
    const events = await BunqClient.api[handlerKey].list(...parameters);
    if (events.length < 200) return events;

    const oldestId = events[events.length - 1][eventType].id;
    const nestedEvents = await getGenericTypeRecursive(BunqClient, eventType, handlerKey, userId, accountId, oldestId);

    return [...events, ...nestedEvents];
};
const getGenericType = (BunqClient, userId, accountId) => async (eventType, handlerKey) => {
    console.log(`\n> Updating ${eventType}`);
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

    const result = Object.keys(eventTracker)
        .map(dateString => eventTracker[dateString])
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();

    console.log(`= Updated ${eventType} data ${result.length}`);
    return result;
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
                date: 0,
                count: 0,
                amount: 0
            };
        }

        invoiceTracker[dateString].date += date.getTime();
        invoiceTracker[dateString].count += 1;
        invoiceTracker[dateString].amount += info.invoice_number;
    });

    const invoiceData = Object.keys(invoiceTracker)
        .map(dateString => {
            const object = invoiceTracker[dateString];

            return {
                id: Math.round(object.amount / object.count),
                // get average data unix value
                date: new Date(Math.round(object.date / object.count))
            };
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();
    console.log("updated invoice data", invoiceData.length);

    const getGenericTypeHandler = getGenericType(BunqClient, user.id, account.id);
    const getNoAccountTypeHandler = getGenericType(BunqClient, user.id);

    const paymentData = await getGenericTypeHandler("Payment", "payment");
    const cardData = await getNoAccountTypeHandler("CardDebit", "card");
    const requestInquiryData = await getGenericTypeHandler("RequestInquiry", "requestInquiry");
    const masterCardActionData = await getGenericTypeHandler("MasterCardAction", "masterCardAction");

    // write this dataset to the given dataset name
    const dataSetName = process.env.STORAGE_NAME ? process.env.STORAGE_NAME : "updated-bunq-data";
    fs.writeFileSync(
        `${__dirname}${path.sep}..${path.sep}src${path.sep}DataSets${path.sep}${dataSetName}.json`,
        JSON.stringify(
            {
                cards: cardData,
                payments: paymentData,
                invoices: invoiceData,
                requestInquiries: requestInquiryData,
                masterCardActions: masterCardActionData
            },
            null,
            4
        )
    );
};

/**
 * Recursively updates together IDs at the given increment and dleay
 * @param currentData
 * @param id
 * @param incrementAmount
 * @param delay
 * @returns {Promise<Array>}
 */
const updateTogetherRecursive = async (currentData, id, incrementAmount = 10000, delay = 500) => {
    console.log(`> Updating together data { startId: ${id}, incrementAmount: ${incrementAmount}, delay: ${delay} }`);

    const oldestItem = currentData[currentData.length - 1];

    let active = true;
    const togetherData = [];
    while (active) {
        const dataExists = currentData.find(item => item.id === id);
        if (!dataExists) {
            try {
                console.log(` -> Fetch together API data { id: ${id} }`);
                const data = await axios
                    .get(`https://together.bunq.com/api/users/${id}`)
                    .then(response => response.data);

                togetherData.push(data);
                active = true;

                await awaiting.delay(delay);
            } catch (error) {
                // keep going if we have an older item, some IDs don't exist and may have been deleted
                if (oldestItem && oldestItem.id > id) {
                    if (error.response && error.response.status !== 404) {
                        active = false;
                    } else {
                        console.log(`Not found: ${id}`);

                        // do nothing except delay the next request
                        await awaiting.delay(delay);
                    }
                } else {
                    active = false;
                }
            }
        }

        id = id + incrementAmount;
    }

    return togetherData;
};

/**
 * Gets together IDs
 */
const getUpdatedTogetherDataset = async () => {
    const togetherDataLocation = `${__dirname}${path.sep}..${path.sep}src${path.sep}DataSets${path.sep}together.json`;
    // get current data
    const currentTogetherData = require(togetherDataLocation);

    if (process.env.UPDATE_TOGETHER_DATA === "true") {
        // user current data to fetch new data while preventing duplicate calls
        // minimum value, all IDs before that won't be accurate
        const togetherData = await updateTogetherRecursive(currentTogetherData, 180000, 1000, 1000);

        // combine and sort the data
        const mappedTogetherData = {};
        currentTogetherData.forEach(togetherUser => {
            mappedTogetherData[togetherUser.id] = togetherUser;
        });
        togetherData.forEach(togetherUser => {
            const userId = parseFloat(togetherUser.data.id);
            mappedTogetherData[userId] = {
                id: userId,
                date: new Date(togetherUser.data.attributes.joinTime)
            };
        });
        const combinedData = Object.keys(mappedTogetherData)
            .sort((a, b) => (parseFloat(a) < parseFloat(b) ? -1 : 1))
            .map(userId => mappedTogetherData[userId]);

        // store the list to a file
        fs.writeFileSync(togetherDataLocation, JSON.stringify(combinedData, null, 4));

        console.log(`= Finished updating together IDs length: ${combinedData.length}`);
        return combinedData;
    }

    return currentTogetherData;
};

/**
 * Calculates the invoice ID change number for each dataset separately and then
 * calculates an average value
 * @param dataSet
 */
const calculateInvoiceChangeValues = events => {
    const dataSetAdjustedChangeValues = {};
    if (events.length === 0) return {};

    let previousId = events[0].id;
    let previousDate = new Date(events[0].date);
    events.forEach((event, index) => {
        const date = new Date(event.date);
        const dateDay = date.getDate();
        const dateString = `${date.getFullYear()}:${date.getMonthString()}`;
        if (!dataSetAdjustedChangeValues[dateString]) {
            dataSetAdjustedChangeValues[dateString] = [];
        }
        const eventId = event.id;

        // change in event ID versus previous event
        const eventIdChange = eventId - previousId;
        // default adjusted value to actual value
        let adjustedChangeValue = eventIdChange;

        // attempt to get a decent estimate for what the value was at the 15th of the month
        const daysBetweenValue = getTimeBetween(date, previousDate, ONE_DAY, false);
        if (daysBetweenValue !== 0) {
            const eventIdSecondChange = eventId - previousId;
            const estimatedDailyChange = eventIdSecondChange / daysBetweenValue;
            const daysUntil15th = 15 - dateDay;
            const adjustmentValue = daysUntil15th * estimatedDailyChange;
            const adjustedEventId = eventId + adjustmentValue;
            adjustedChangeValue = adjustedEventId - previousId;
        }

        // store the values for next loop
        previousDate = date;
        previousId = eventId;

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

/**
 *
 * @param events
 * @returns {{}|Array}
 */
const calculateEventChangeValues = events => {
    if (events.length === 0) return {};

    const firstEventDate = new Date(events[0].date);
    const lastEventDate = new Date(events[events.length - 1].date);

    // round the dates and get the first day of those weeks
    const firstWeekDate = new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), firstEventDate.getDate());
    firstWeekDate.setDate(firstWeekDate.getDate() - firstWeekDate.getDay());
    const lastWeekDate = new Date(lastEventDate.getFullYear(), lastEventDate.getMonth(), lastEventDate.getDate());
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
        const beforeWeekEvent = events.reverse().find(event => {
            const eventDate = new Date(event.date);
            if (eventDate < weeklyDate) return true;

            return false;
        });
        // reverse back
        events.reverse();

        const afterWeekEvent = events.find(event => {
            const eventDate = new Date(event.date);
            if (eventDate > weeklyDate) return true;

            return false;
        });

        if (!beforeWeekEvent) return;
        if (!afterWeekEvent) return;

        const eventBeforeDate = new Date(beforeWeekEvent.date);
        const eventAfterDate = new Date(afterWeekEvent.date);
        // total change between the two surrounding events
        const eventIdChange = afterWeekEvent.id - beforeWeekEvent.id;
        // calculate hours between the two surrounding events
        const hoursBetween = getTimeBetween(eventBeforeDate, eventAfterDate, ONE_HOUR);
        // calculate the amount of hours from the before event to the weekly date
        const startToWeeklyDateBetween = getTimeBetween(eventBeforeDate, weeklyDate, ONE_HOUR);
        // how much events/hour for the surrounding events
        const hourlyChange = eventIdChange / hoursBetween;
        // calculate weekly id estimate
        const weeklyDateIdEstimate = Math.round(beforeWeekEvent.id + hourlyChange * startToWeeklyDateBetween);

        weeklyValues.push({
            date: weeklyDate,
            id: weeklyDateIdEstimate
        });
    });

    let previousId = events[0].id;
    let previousDate = new Date(events[0].date);
    weeklyValues.forEach((weeklyEstimate, index) => {
        // change in event ID versus previous event
        const eventIdChange = weeklyEstimate.id - previousId;
        const daysBetweenDates = getTimeBetween(previousDate, weeklyEstimate.date, ONE_DAY, true);

        // store the values for next loop
        previousDate = weeklyEstimate.date;
        previousId = weeklyEstimate.id;

        // push to the dataset stack
        weeklyValues[index].change = eventIdChange / daysBetweenDates;
    });

    return weeklyValues;
};

/**
 * turn a key value collection into a long array with corrected values
 */
const normalizeEventCollections = (eventTracker, events, dateSeparatorType = "day") => {
    if (!events || !Array.isArray(events)) return;

    // get the first event for each day
    events.forEach(event => {
        const date = new Date(event.date);
        let dateString;
        switch (dateSeparatorType) {
            case "day":
                dateString = `${date.getFullYear()}:${date.getMonth()}:${date.getDate()}`;
                break;
            case "week":
                dateString = `${date.getFullYear()}:${date.getWeek()}`;
                break;
            case "month":
                dateString = `${date.getFullYear()}:${date.getMonth()}`;
                break;
        }

        if (!eventTracker[dateString]) {
            eventTracker[dateString] = {
                date: event.date,
                id: event.id
            };
        } else {
            const compareDate = new Date(eventTracker[dateString].date);
            // get a event as early as possible for the date
            if (compareDate > date) {
                eventTracker[dateString].id = event.id;
            }
        }
    });
};

const trackerToArray = eventTracker => {
    return Object.keys(eventTracker)
        .map(dateString => eventTracker[dateString])
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();
};

const start = async () => {
    // get a updated set for the current API user
    await getUpdatedDataset();

    // get together IDs
    const togetherDataSet = await getUpdatedTogetherDataset();

    // group by week or month for each use case to get averages
    const paymentTracker = {};
    const cardsTracker = {};
    const masterCardActionTracker = {};
    const requestInquiryTracker = {};
    const invoiceTracker = {};
    const togetherUserTracker = {};

    const dataSets = bunqDataSets(`${__dirname}${path.sep}..${path.sep}src${path.sep}DataSets`);

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

    // combine the ids with the normalized change values
    const normalizedTogetherUsers = calculateInvoiceChangeValues(togetherDataSet);
    togetherDataSet.forEach(togetherUser => {
        const date = new Date(togetherUser.date);
        const dateString = `${date.getFullYear()}:${date.getMonthString()}`;
        if (!togetherUserTracker[dateString]) {
            togetherUserTracker[dateString] = {
                date: togetherUser.date,
                count: 0,
                change: 0,
                amount: 0
            };
        }

        togetherUserTracker[dateString].count += 1;
        togetherUserTracker[dateString].amount += togetherUser.id;
        togetherUserTracker[dateString].change += normalizedTogetherUsers[dateString];
    });
    // calculate averages and push to data list
    const togetherUserData = Object.keys(togetherUserTracker)
        .map(dateString => {
            const object = togetherUserTracker[dateString];

            return {
                id: Math.round(object.amount / object.count),
                change: Math.round(object.change / object.count),
                date: object.date
            };
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .reverse();
    console.log("combined togetherUserChange data", togetherUserData.length);

    // go through data sets and combine them
    dataSets.forEach(dataSet => {
        normalizeEventCollections(paymentTracker, dataSet.payments);
        normalizeEventCollections(cardsTracker, dataSet.cards);
        normalizeEventCollections(masterCardActionTracker, dataSet.masterCardActions);
        normalizeEventCollections(requestInquiryTracker, dataSet.requestInquiries);

        // combine the ids with the normalized change values
        const normalizedInvoices = calculateInvoiceChangeValues(dataSet.invoices);
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

    // calculate change values and adjusted changes values
    const paymentChangeData = calculateEventChangeValues(trackerToArray(paymentTracker));
    console.log("combined payment data", paymentChangeData.length);
    const masterCardActionChangeData = calculateEventChangeValues(trackerToArray(masterCardActionTracker));
    console.log("combined masterCardAction data", masterCardActionChangeData.length);
    const requestInquiryChangeData = calculateEventChangeValues(trackerToArray(requestInquiryTracker));
    console.log("combined requestInquiry data", requestInquiryChangeData.length);

    const cardChangeData = trackerToArray(cardsTracker);
    console.log("combined card data", cardChangeData.length);

    // write to a file in public dir
    fs.writeFileSync(
        `${__dirname}${path.sep}..${path.sep}public${path.sep}bunq-data.json`,
        JSON.stringify({
            cards: cardChangeData,
            invoices: invoiceData,
            payments: paymentChangeData,
            masterCardActions: masterCardActionChangeData,
            requestInquiries: requestInquiryChangeData,
            togetherData: togetherUserData,
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
