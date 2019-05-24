import * as fs from "fs";
import * as path from "path";

import { standardBlue, standardGreen, standardRed } from "../src/Pages/Bunq/ChartColors";
import StandardChartOptions from "../src/Pages/Bunq/StandardChartOptions";
import StandardDataSet from "../src/Pages/Bunq/StandardDataSet";
import StandardPlugins from "../src/Pages/Bunq/StandardPlugins";
import MovingAverage from "../src/Functions/MovingAverage";

import dataSet from "../public/bunq-data.json";

const { CanvasRenderService } = require("chartjs-node-canvas");
const chartjsPluginDataLabels = require("chartjs-plugin-datalabels");

/**
 * Receives a resolution and chart config and renders it the public directory
 * @param chartName
 * @param configuration
 * @param plugins
 * @param resolution
 * @returns {Promise<void>}
 */
const createChart = async (chartName, configuration, plugins = [], resolution = { width: 1280, height: 720 }) => {
    const chartCallback = ChartJS => {
        ChartJS.defaults.global.elements.rectangle.borderWidth = 2;

        plugins.forEach(plugin => {
            // register each plugin separately
            ChartJS.plugins.register(plugin);
        });
    };

    // create the service using the options and callback
    const canvasRenderService = new CanvasRenderService(resolution.width, resolution.height, chartCallback);

    // render to a NodeJS buffer
    const image = await canvasRenderService.renderToBuffer(configuration);

    // save buffer to file location
    const fileName = `${chartName}-${resolution.width}x${resolution.height}.png`;
    const filePath = path.normalize(`public/bunq-charts/${fileName}`);
    fs.writeFileSync(filePath, image);

    console.log(` -> Saved ${filePath}`);
};

/**
 * Generate invoices chart
 * @param invoices
 * @param compensation
 * @returns {Promise<void>}
 */
const createInvoiceCharts = async (invoices, compensation = 10) => {
    let previousChange = 0;
    const finalCompensation = (100 - compensation) / 100;
    const invoiceChartDelta = [];
    const invoiceChartDeltaColors = [];
    const invoiceChartData = [];

    // map invoice list to x/y values
    const mappedInvoiceXY = invoices.map(invoice => {
        return {
            x: new Date(invoice.date),
            y: invoice.change * finalCompensation
        };
    });

    // calculate moving average
    const invoiceList = MovingAverage(mappedInvoiceXY, 2, true);

    invoiceList.forEach(invoice => {
        const invoiceIdChange = invoice.y;

        // skip no change events
        if (invoiceIdChange === 0) return;

        // calculate difference in new invoices between now and last month
        const changeVsLastMonth = invoiceIdChange - previousChange;
        const color = changeVsLastMonth < 0 ? standardRed : standardGreen;
        invoiceChartDelta.push({
            x: invoice.x,
            y: changeVsLastMonth
        });
        invoiceChartDeltaColors.push(color);

        previousChange = invoiceIdChange;
        invoiceChartData.push({
            x: invoice.x,
            y: invoiceIdChange
        });
    });

    // first month always 0
    invoiceChartDelta[0].y = 0;

    const options = StandardChartOptions("label");
    const dataSets = [
        StandardDataSet({
            type: "line",
            label: "Invoices",
            fill: false,
            data: invoiceChartData,
            color: standardBlue
        }),
        StandardDataSet({
            type: "bar",
            label: "Invoice change",
            data: invoiceChartDelta,
            backgroundColor: invoiceChartDeltaColors,
            fill: invoiceChartDeltaColors,
            color: invoiceChartDeltaColors,
            datalabels: true
        })
    ];

    const config = {
        type: "bar",
        options: options,
        data: {
            datasets: dataSets
        }
    };
    const plugins = StandardPlugins([chartjsPluginDataLabels]);
    await createChart(`invoices-${compensation}`, config, plugins, { width: 720, height: 480 });
    await createChart(`invoices-${compensation}`, config, plugins);
    await createChart(`invoices-${compensation}`, config, plugins, { width: 1920, height: 1080 });
};

(async () => {
    await createInvoiceCharts(dataSet.invoices);
    await createInvoiceCharts(dataSet.invoices, 0);
})();
