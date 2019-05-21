import Chart from "chart.js";

const plugin = {
    beforeDraw: function(chartInstance) {
        const { backgroundColor } = chartInstance.chart.options;

        if (backgroundColor) {
            const ctx = chartInstance.chart.ctx;
            const canvas = chartInstance.chart.canvas;

            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
};

Chart.pluginService.register(plugin);

export default plugin;
