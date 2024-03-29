// const defaultGenericOptions = { yAdjust: 30, color: "green" };
export const genericEvents = [
    // { label: "Offline Cards", date: new Date("2018-10-08"), ...defaultGenericOptions }
];

const defaultBunqOptions = {};
export const bunqUpdates = [
    { label: "20", date: new Date("2022-05-03"), ...defaultBunqOptions },
    { label: "19", date: new Date("2022-02-03"), ...defaultBunqOptions },
    { label: "18", date: new Date("2021-08-31"), ...defaultBunqOptions },
    { label: "17", date: new Date("2021-05-31"), ...defaultBunqOptions },
    { label: "16", date: new Date("2021-01-13"), ...defaultBunqOptions },
    { label: "15 Redesign", date: new Date("2020-10-16"), ...defaultBunqOptions },
    { label: "14", date: new Date("2020-05-29"), ...defaultBunqOptions },
    { label: "13", date: new Date("2020-01-28"), ...defaultBunqOptions },
    { label: "12", date: new Date("2019-09-04"), ...defaultBunqOptions },
    { label: "11 Web", date: new Date("2019-07-10"), ...defaultBunqOptions },
    { label: "10 Interest", date: new Date("2019-02-26"), ...defaultBunqOptions },
    { label: "9 ZeroFX", date: new Date("2018-11-06"), ...defaultBunqOptions },
    { label: "8", date: new Date("2018-07-15"), ...defaultBunqOptions },
    { label: "7 Apple Pay", date: new Date("2018-03-20"), ...defaultBunqOptions },
    { label: "6 Pack", date: new Date("2017-11-27"), ...defaultBunqOptions },
    { label: "5 Premium", date: new Date("2017-08-02"), ...defaultBunqOptions }
    // { label: "#4 Slice", date: new Date("2016-11-15"), ...defaultBunqOptions },
    // { label: "#3 Business", date: new Date("2016-05-15"), ...defaultBunqOptions }
    // { label: "#2 Public", date: new Date("2015-11-15"), ...defaultBunqOptions },
    // { label: "#1 Beta", date: new Date("2015-09-15"), ...defaultBunqOptions },
];
export const combinedEventList = [...bunqUpdates, ...genericEvents];

export const eventsToAnnotations = eventList => {
    return eventList.map(event => {
        return {
            type: "line",
            mode: "vertical",
            scaleID: "x-axis-0",
            value: event.date,
            borderColor: "rgba(255, 255, 255, 0.7)",
            borderWidth: 2,
            label: {
                content: event.label,
                backgroundColor: event.color || "#1F60FF",
                fontSize: 12,
                fontStyle: "bold",
                fontColor: "#fff",

                xPadding: 5,
                yPadding: 5,
                cornerRadius: 4,

                // top, bottom, left, right, center. Default below.
                position: "top",
                yAdjust: event.yAdjust || 4,

                enabled: true
            }
        };
    });
};
