export const genericEvents = [
    { label: "Premium", date: new Date("2017-08-02") },
    { label: "Pack", date: new Date("2017-11-27") },
    { label: "Apple Pay", date: new Date("2018-03-20") },
    { label: "ZeroFX", date: new Date("2018-11-06") },
    { label: "Cards", date: new Date("2018-10-08"), yAdjust: 60 },
    { label: "MassInterest", date: new Date("2019-02-26") }
];

const defaultBunqOptions = { yAdjust: 30, color: "green" };
export const bunqUpdates = [
    { label: "#9", date: new Date("2018-11-15"), ...defaultBunqOptions },
    { label: "#8", date: new Date("2018-07-15"), ...defaultBunqOptions },
    { label: "#7", date: new Date("2018-03-15"), ...defaultBunqOptions },
    { label: "#6", date: new Date("2017-11-15"), ...defaultBunqOptions },
    { label: "#5", date: new Date("2017-08-15"), ...defaultBunqOptions },
    { label: "#4", date: new Date("2016-11-15"), ...defaultBunqOptions },
    { label: "#3", date: new Date("2016-05-15"), ...defaultBunqOptions }
];
export const combinedEventList = [...genericEvents, ...bunqUpdates];

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
                backgroundColor: event.color || "rgba(31,96,255)",
                fontSize: 12,
                fontStyle: "bold",
                fontColor: "#fff",

                xPadding: 6,
                yPadding: 6,
                cornerRadius: 6,

                // top, bottom, left, right, center. Default below.
                position: "top",
                yAdjust: event.yAdjust || 4,

                enabled: true
            }
        };
    });
};
