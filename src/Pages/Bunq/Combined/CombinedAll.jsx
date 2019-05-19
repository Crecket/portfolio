import React from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-annotation";
import Typography from "@material-ui/core/Typography";
import { red, green, blue, deepPurple, deepOrange } from "@material-ui/core/colors";

import DefaultCheckbox from "../../../Components/DefaultCheckbox";
import DefaultSwitch from "../../../Components/DefaultSwitch";

import { eventsToAnnotations, combinedEventList } from "../StandardAnnotations";
import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";
import { standardBlue, standardGreen, standardOrange, standardPurple, standardRed } from "../ChartColors";

const eventMapper = event => ({
    x: new Date(event.date),
    y: event.id
});

const annotationList = eventsToAnnotations(combinedEventList);

export default ({ bunqData }) => {
    const paymentChartData = bunqData.payments.map(eventMapper);
    const requestInquiryChartData = bunqData.requestInquiries.map(eventMapper);
    const masterCardActionChartData = bunqData.masterCardActions.map(eventMapper);
    const togetherChartData = bunqData.togetherData.map(eventMapper);
    const invoiceChartData = bunqData.invoices.map(eventMapper);
    const cardsChartData = bunqData.cards.map(eventMapper);

    const [showAnnotations, setShowAnnotations] = React.useState(false);

    const [showPaymentAxis, setShowPaymentAxis] = React.useState(true);
    const [showRequestInquiryAxis, setShowRequestInquiryAxis] = React.useState(false);
    const [showMasterCardActionAxis, setShowMasterCardActionAxis] = React.useState(false);
    const [showTogetherDataAxis, setShowTogetherDataAxis] = React.useState(false);
    const [showInvoiceAxis, setShowInvoiceAxis] = React.useState(false);
    const [showCardAxis, setShowCardAxis] = React.useState(false);

    const options = { ...StandardChartOptions("nearest", showAnnotations ? annotationList : []) };

    options.scales.yAxes[1] = {
        ...options.scales.yAxes[0],
        id: "invoices",
        type: "linear",
        display: showInvoiceAxis,
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
        display: showCardAxis,
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
        display: showRequestInquiryAxis,
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
        display: showMasterCardActionAxis,
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
        display: showTogetherDataAxis,
        gridLines: {
            display: true,
            color: deepOrange[800]
        }
    };

    options.scales.yAxes[0] = {
        ...options.scales.yAxes[0],
        id: "payments",
        display: showPaymentAxis,
        gridLines: {
            display: true,
            color: blue[800]
        }
    };

    return (
        <div>
            <div className="chart-content">
                <DefaultSwitch label="Show annotations" checked={showAnnotations} onChange={setShowAnnotations} />
            </div>
            <div className="chart-content">
                <Typography variant="body1">
                    Use the checkboxes below to hide/show the axis you need. You can click the different labels in the
                    legend to hide or show them to your liking.
                </Typography>
            </div>
            <div className="chart-content">
                <DefaultCheckbox label="Cards" checked={showCardAxis} onChange={() => setShowCardAxis(!showCardAxis)} />
                <DefaultCheckbox
                    label="Payment"
                    checked={showPaymentAxis}
                    onChange={() => setShowPaymentAxis(!showPaymentAxis)}
                />
                <DefaultCheckbox
                    label="Invoice"
                    checked={showInvoiceAxis}
                    onChange={() => setShowInvoiceAxis(!showInvoiceAxis)}
                />
                <DefaultCheckbox
                    label="Card payment"
                    checked={showMasterCardActionAxis}
                    onChange={() => setShowMasterCardActionAxis(!showMasterCardActionAxis)}
                />
                <DefaultCheckbox
                    label="Request inquiry"
                    checked={showRequestInquiryAxis}
                    onChange={() => setShowRequestInquiryAxis(!showRequestInquiryAxis)}
                />
                <DefaultCheckbox
                    label="Together users"
                    checked={showTogetherDataAxis}
                    onChange={() => setShowTogetherDataAxis(!showTogetherDataAxis)}
                />
            </div>
            <div className="chart-wrapper">
                <Line
                    className="chart"
                    data={{
                        datasets: [
                            StandardDataSet({
                                label: `Cards`,
                                yAxisID: "cards",
                                data: cardsChartData,
                                fill: false,
                                pointRadius: 0,
                                color: standardRed,
                                datalabels: false
                            }),
                            StandardDataSet({
                                label: `Payments`,
                                yAxisID: "payments",
                                data: paymentChartData,
                                fill: false,
                                pointRadius: 0,
                                color: standardBlue,
                                datalabels: false
                            }),
                            StandardDataSet({
                                label: `Invoices`,
                                yAxisID: "invoices",
                                data: invoiceChartData,
                                fill: false,
                                pointRadius: 0,
                                color: standardGreen,
                                datalabels: false
                            }),
                            StandardDataSet({
                                label: `Requests`,
                                yAxisID: "requestInquiries",
                                data: requestInquiryChartData,
                                fill: false,
                                pointRadius: 0,
                                color: standardPurple,
                                datalabels: false
                            }),
                            StandardDataSet({
                                label: `Card payments`,
                                yAxisID: "masterCardActions",
                                data: masterCardActionChartData,
                                fill: false,
                                pointRadius: 0,
                                color: "#00fff6",
                                datalabels: false
                            }),
                            StandardDataSet({
                                label: `Together users`,
                                yAxisID: "togetherData",
                                data: togetherChartData,
                                fill: false,
                                pointRadius: 0,
                                color: standardOrange,
                                datalabels: false
                            })
                        ]
                    }}
                    options={options}
                />
            </div>
        </div>
    );
};
