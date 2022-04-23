function LineFitter() {}

LineFitter.prototype = {
    count: 0,
    sumX: 0,
    sumX2: 0,
    sumXY: 0,
    sumY: 0,
    add: function(x, y) {
        this.count++;
        this.sumX += x;
        this.sumX2 += x * x;
        this.sumXY += x * y;
        this.sumY += y;
    },
    project: function(x) {
        const det = this.count * this.sumX2 - this.sumX * this.sumX;
        const offset = (this.sumX2 * this.sumY - this.sumX * this.sumXY) / det;
        const scale = (this.count * this.sumXY - this.sumX * this.sumY) / det;
        return offset + x * scale;
    }
};

function addFitter(datasetMeta, ctx, dataset, yScale) {
    let style = dataset.trendlineLinear.style || dataset.borderColor;
    let lineWidth = dataset.trendlineLinear.width || dataset.borderWidth;
    const lineStyle = dataset.trendlineLinear.lineStyle || "solid";

    style = style !== undefined ? style : "rgba(169,169,169, .6)";
    lineWidth = lineWidth !== undefined ? lineWidth : 3;

    const lastIndex = dataset.data.length - 1;
    const startPos = datasetMeta.data[0]._model.x;
    const endPos = datasetMeta.data[lastIndex]._model.x;
    const fitter = new LineFitter();

    dataset.data.forEach(function(data, index) {
        fitter.add(index, data.y ? data.y : data);
    });

    ctx.lineWidth = lineWidth;
    if (lineStyle === "dotted") {
        ctx.setLineDash([2, 3]);
    }
    ctx.beginPath();
    ctx.moveTo(startPos, yScale.getPixelForValue(fitter.project(0)));
    ctx.lineTo(endPos, yScale.getPixelForValue(fitter.project(lastIndex)));
    ctx.strokeStyle = style;
    ctx.stroke();
}

const pluginTrendlineLinear = {
    beforeDraw: function(chartInstance) {
        const yScale = chartInstance.scales["y-axis-0"];
        const ctx = chartInstance.chart.ctx;

        chartInstance.data.datasets.forEach(function(dataset, index) {
            if (dataset.trendlineLinear && chartInstance.isDatasetVisible(index)) {
                const datasetMeta = chartInstance.getDatasetMeta(index);
                addFitter(datasetMeta, ctx, dataset, yScale);
            }
        });

        ctx.setLineDash([]);
    }
};

export default pluginTrendlineLinear;
