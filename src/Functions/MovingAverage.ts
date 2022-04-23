/**
 * @param dataSet    - The data in {x,y}
 * @param movingSize - How many indexes before and after each item
 * @param round      - Round the Y values
 * @constructor
 */
const MovingAverage = (dataSet, movingSize = 1, round = true) => {
    const dataSize = dataSet.length;
    const movingAverageData = [];

    for (let i = 0; i < dataSize; i++) {
        const startIndex = i - movingSize;
        const endIndex = i + movingSize;

        const dataValues = [];
        for (let itemIndex = startIndex; itemIndex <= endIndex; itemIndex++) {
            if (dataSet[itemIndex]) dataValues.push(dataSet[itemIndex]);
        }

        const combinedValue = dataValues.reduce((average, dataValue) => {
            const value = typeof dataValue.y !== "undefined" ? dataValue.y : dataValue;
            return average + value;
        }, 0);
        const averageValue = combinedValue / dataValues.length;

        const xValue = dataSet[i].x ? dataSet[i].x : i;
        movingAverageData.push({
            x: xValue,
            y: round ? Math.round(averageValue) : averageValue
        });
    }

    return movingAverageData;
};

export default MovingAverage;
