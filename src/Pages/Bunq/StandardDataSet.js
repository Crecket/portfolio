export default ({ color = false, datalabels, forceShowDataLabel = false, ...options }) => {
    if (color) {
        options.pointBackgroundColor = color;
        options.backgroundColor = color;
        options.borderColor = color;
    }

    const dataSet = {
        borderWidth: 1,
        datalabels: {
            display: forceShowDataLabel ? true : "auto",
            color: "white",
            align: "end",
            anchor: "end",
            offset: 4,
            formatter: val => {
                const directValue = typeof val.y !== "undefined" ? val.y : val;
                return directValue.toLocaleString();
            }
        },
        ...options
    };
    if (datalabels === false) dataSet.datalabels = { display: false };

    return dataSet;
};
