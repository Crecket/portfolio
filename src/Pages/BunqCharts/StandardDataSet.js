export default ({ datalabels, ...options }) => {
    const dataSet = {
        borderWidth: 1,
        datalabels: {
            display: "auto",
            color: "white",
            align: "end",
            anchor: "end",
            offset: 4,
            formatter: val => {
                return val.y ? val.y : val;
            }
        },
        ...options
    };
    if (datalabels === false) dataSet.datalabels = { display: false };

    return dataSet;
};
