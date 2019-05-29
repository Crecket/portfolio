import * as path from "path";
import * as fs from "fs-extra";
import glob from "glob";

import { fileSizePretty, optimizeImageSize, writeJsonFile } from "../server/Functions";

// standard chart configs
import {
    standardBlue,
    standardGreen,
    standardOrange,
    standardPurple,
    standardRed
} from "../src/Pages/Bunq/ChartColors";
import StandardChartOptions from "../src/Pages/Bunq/StandardChartOptions";
import StandardDataSet from "../src/Pages/Bunq/StandardDataSet";
import StandardPlugins from "../src/Pages/Bunq/StandardPlugins";
import MovingAverage from "../src/Functions/MovingAverage";

// bunq data set
import dataSet from "../public/bunq-data.json";
import React from "react";
import { blue, deepOrange, deepPurple, green, red } from "@material-ui/core/colors";

// chartjs plugins
const { CanvasRenderService } = require("chartjs-node-canvas");
const chartjsPluginDataLabels = require("chartjs-plugin-datalabels");

// standard public path
const publicDirectoryPath = path.normalize(`public/bunq-chart-images/`);

const generatedImagesList = [];

const getImageResolution = size => {
    switch (size) {
        case "240p":
            return { width: 426, height: 240 };
        case "360p":
            return { width: 640, height: 360 };
        case "480p":
            return { width: 720, height: 480 };
        case "720p":
            return { width: 1280, height: 720 };
        case "1080p":
            return { width: 1920, height: 1080 };
        case "1440p":
            return { width: 2560, height: 1440 };
        case "2160p":
            return { width: 3840, height: 2160 };
        default:
            return getImageResolution("720p");
    }
};

const emptyDirectory = directory => {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
    });
};

/**
 * Receives a resolution and chart config and renders it the public directory
 * @param chartName
 * @param configuration
 * @param plugins
 * @param resolution
 * @returns {Promise<void>}
 */
const createChart = async (chartName, configuration, plugins = [], size = "1080p") => {
    const { width, height } = getImageResolution(size);

    // chartjs callback to register plugins
    const chartCallback = ChartJS => {
        ChartJS.defaults.global.elements.rectangle.borderWidth = 1;

        plugins.forEach(plugin => {
            // register each plugin separately
            ChartJS.plugins.register(plugin);
        });
    };

    // create the service using the options and callback
    const canvasRenderService = new CanvasRenderService(width, height, chartCallback);

    // render to a NodeJS buffer
    const image = await canvasRenderService.renderToBuffer(configuration);

    // save buffer to file location
    const fileName = `${chartName}-${size}.png`;
    const filePath = path.normalize(`${publicDirectoryPath}/${fileName}`);
    fs.writeFileSync(filePath, image);
    const fileStat = await fs.statSync(filePath);

    console.log(` -> Saved ${filePath} {${fileSizePretty(fileStat.size)}}`);

    return {
        fileName,
        size: fileStat.size
    };
};

/**
 * Update the generateImages list to contain the correct "optimized" image sizes
 * @returns {Promise<any[]>}
 */
const calculateUpdatedImageSize = () => {
    return Promise.all(
        generatedImagesList.map(async (imageList, index) => {
            await imageList.images.map(async (image, imageIndex) => {
                const fullPath = path.normalize(`${publicDirectoryPath}/${image.fileName}`);
                const fileStat = await fs.statSync(fullPath);

                // set file size directly
                generatedImagesList[index].images[imageIndex].size = fileStat.size;
            });
        })
    ).then(() => {
        // sort images to smallest first
        generatedImagesList.map((imageList, index) => {
            imageList.images.sort((image1, image2) => {
                return image1.size < image2.size ? -1 : 1;
            });
        });
    });
};

/**
 * Generate invoices chart
 * @param invoices
 * @param compensation
 * @returns {Promise<void>}
 */
const createInvoiceCharts = async (invoices, compensation = 0) => {
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

    const plugins = StandardPlugins([chartjsPluginDataLabels]);
    const options = StandardChartOptions("label", false, { maintainAspectRatio: true });
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

    const fileNames = [];
    const chartTitle = compensation > 0 ? `invoices-${compensation}` : `invoices`;
    // fileNames.push(await createChart(chartTitle, config, plugins, "240p"));
    fileNames.push(await createChart(chartTitle, config, plugins, "360p"));
    fileNames.push(await createChart(chartTitle, config, plugins, "480p"));
    fileNames.push(await createChart(chartTitle, config, plugins, "720p"));
    fileNames.push(await createChart(chartTitle, config, plugins, "1080p"));
    fileNames.push(await createChart(chartTitle, config, plugins, "1440p"));

    // add to the list
    generatedImagesList.push({
        description: `Invoices with ${compensation}% compensation`,
        images: fileNames
    });
};

/**
 * Generate combined chart
 * @param bunqData
 * @returns {Promise<void>}
 */
const createdCombinedCharts = async bunqData => {
    const eventMapper = event => ({
        x: new Date(event.date),
        y: event.id
    });

    const plugins = StandardPlugins([chartjsPluginDataLabels]);
    const options = StandardChartOptions("label", false, { maintainAspectRatio: true });

    const paymentChartData = bunqData.payments.map(eventMapper);
    const requestInquiryChartData = bunqData.requestInquiries.map(eventMapper);
    const masterCardActionChartData = bunqData.masterCardActions.map(eventMapper);
    const togetherChartData = bunqData.togetherData.map(eventMapper);
    const invoiceChartData = bunqData.invoices.map(eventMapper);
    const cardsChartData = bunqData.cards.map(eventMapper);

    const showPayments = true;
    const showRequestInquiries = true;
    const showMasterCardActions = true;
    const showTogetherData = true;
    const showInvoices = true;
    const showCards = true;

    const showPaymentAxis = false;
    const showRequestInquiryAxis = false;
    const showMasterCardActionAxis = false;
    const showTogetherDataAxis = false;
    const showInvoiceAxis = false;
    const showCardAxis = false;

    options.scales.yAxes[1] = {
        ...options.scales.yAxes[0],
        id: "invoices",
        type: "linear",
        display: showInvoices && showInvoiceAxis,
        gridLines: {
            display: true,
            color: green[700]
        }
    };
    options.scales.yAxes[2] = {
        ...options.scales.yAxes[0],
        id: "cards",
        type: "linear",
        position: "right",
        display: showCards && showCardAxis,
        gridLines: {
            display: true,
            color: red[700]
        }
    };
    options.scales.yAxes[3] = {
        ...options.scales.yAxes[0],
        id: "requestInquiries",
        type: "linear",
        position: "right",
        display: showRequestInquiries && showRequestInquiryAxis,
        gridLines: {
            display: true,
            color: deepPurple[700]
        }
    };
    options.scales.yAxes[4] = {
        ...options.scales.yAxes[0],
        id: "masterCardActions",
        type: "linear",
        position: "right",
        display: showMasterCardActions && showMasterCardActionAxis,
        gridLines: {
            display: true,
            color: "#009c96"
        }
    };
    options.scales.yAxes[5] = {
        ...options.scales.yAxes[0],
        id: "togetherData",
        type: "linear",
        position: "right",
        display: showTogetherData && showTogetherDataAxis,
        gridLines: {
            display: true,
            color: deepOrange[800]
        }
    };
    options.scales.yAxes[0] = {
        ...options.scales.yAxes[0],
        id: "payments",
        display: showPayments && showPaymentAxis,
        gridLines: {
            display: true,
            color: blue[800]
        }
    };

    const dataSets = [];
    const cardsDataSet = StandardDataSet({
        label: `Cards`,
        yAxisID: "cards",
        data: cardsChartData,
        fill: false,
        pointRadius: 0,
        color: standardRed,
        datalabels: false
    });
    const paymentsDataSet = StandardDataSet({
        label: `Payments`,
        yAxisID: "payments",
        data: paymentChartData,
        fill: false,
        pointRadius: 0,
        color: standardBlue,
        datalabels: false
    });
    const invoicesDataset = StandardDataSet({
        label: `Invoices`,
        yAxisID: "invoices",
        data: invoiceChartData,
        fill: false,
        pointRadius: 0,
        color: standardGreen,
        datalabels: false
    });
    const requestInquiryDataset = StandardDataSet({
        label: `Requests`,
        yAxisID: "requestInquiries",
        data: requestInquiryChartData,
        fill: false,
        pointRadius: 0,
        color: standardPurple,
        datalabels: false
    });
    const masterCardActionDataset = StandardDataSet({
        label: `Card payments`,
        yAxisID: "masterCardActions",
        data: masterCardActionChartData,
        fill: false,
        pointRadius: 0,
        color: "#00fff6",
        datalabels: false
    });
    const togetherUserDataset = StandardDataSet({
        label: `Together users`,
        yAxisID: "togetherData",
        data: togetherChartData,
        fill: false,
        pointRadius: 0,
        color: standardOrange,
        datalabels: false
    });

    if (showCards) dataSets.push(cardsDataSet);
    if (showPayments) dataSets.push(paymentsDataSet);
    if (showInvoices) dataSets.push(invoicesDataset);
    if (showRequestInquiries) dataSets.push(requestInquiryDataset);
    if (showMasterCardActions) dataSets.push(masterCardActionDataset);
    if (showTogetherData) dataSets.push(togetherUserDataset);

    const config = {
        type: "line",
        options: options,
        data: {
            datasets: dataSets
        }
    };

    const fileNames = [];
    const chartTitle = `combined`;
    // fileNames.push(await createChart(chartTitle, config, plugins, "240p"));
    fileNames.push(await createChart(chartTitle, config, plugins, "360p"));
    fileNames.push(await createChart(chartTitle, config, plugins, "480p"));
    fileNames.push(await createChart(chartTitle, config, plugins, "720p"));
    fileNames.push(await createChart(chartTitle, config, plugins, "1080p"));
    fileNames.push(await createChart(chartTitle, config, plugins, "1440p"));

    // add to the list
    generatedImagesList.push({
        description: `Combined datasets`,
        images: fileNames
    });
};

(async () => {
    console.log("> Generating bunq chart images");
    // empty existing charts and ensure dir exists
    await fs.emptyDir(path.normalize("public/bunq-chart-images"));
    console.log(" -> Emptied existing bunq-chart-images dir\n");

    // render the invoice charts with 10 and 0 compensation
    await createInvoiceCharts(dataSet.invoices);
    await createInvoiceCharts(dataSet.invoices, 10);

    // render combined datasets
    await createdCombinedCharts(dataSet);

    // optimize the images
    const generatedImages = glob.sync(`${publicDirectoryPath}/*.png`);
    await optimizeImageSize(generatedImages, "bunq-chart-images");

    // update image lists with new sizes
    await calculateUpdatedImageSize();

    // store the optimized images list
    const jsonListPath = path.normalize(`${publicDirectoryPath}/images.json`);
    await writeJsonFile(jsonListPath, generatedImagesList);
})();
