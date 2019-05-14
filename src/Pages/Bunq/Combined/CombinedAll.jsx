import React from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-annotation";

import { eventsToAnnotations, combinedEventList } from "../StandardAnnotations";
import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";
import DefaultCheckbox from "../../../Components/DefaultCheckbox";
import DefaultSwitch from "../../../Components/DefaultSwitch";

const eventMapper = event => ({
    x: new Date(event.date),
    y: event.id
});

const annotationList = eventsToAnnotations(combinedEventList);

export default ({ bunqData }) => {
    const paymentChartData = bunqData.payments.map(eventMapper);
    const requestInquiryChartData = bunqData.requestInquiries.map(eventMapper);
    const masterCardActionChartData = bunqData.masterCardActions.map(eventMapper);
    const invoiceChartData = bunqData.invoices.map(eventMapper);
    const cardsChartData = bunqData.cards.map(eventMapper);

    const [showAnnotations, setShowAnnotations] = React.useState(false);

    const [showPaymentAxis, setShowPaymentAxis] = React.useState(true);
    const [showRequestInquiryAxis, setShowRequestInquiryAxis] = React.useState(false);
    const [showMasterCardActionAxis, setShowMasterCardActionAxis] = React.useState(false);
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
            color: "#3d972c"
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
            color: "#a60a23"
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
            color: "#9c0d7a"
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

    options.scales.yAxes[0] = {
        ...options.scales.yAxes[0],
        id: "payments",
        display: showPaymentAxis,
        gridLines: {
            display: true,
            color: "#0b489c"
        }
    };

    return (
        <div>
            <div className="chart-content">
                <DefaultSwitch label="Show annotations" checked={showAnnotations} onChange={setShowAnnotations} />
                <DefaultCheckbox
                    label="Cards Y-axis"
                    checked={showCardAxis}
                    onChange={() => setShowCardAxis(!showCardAxis)}
                />
                <DefaultCheckbox
                    label="Payment Y-axis"
                    checked={showPaymentAxis}
                    onChange={() => setShowPaymentAxis(!showPaymentAxis)}
                />
                <DefaultCheckbox
                    label="Invoice Y-axis"
                    checked={showInvoiceAxis}
                    onChange={() => setShowInvoiceAxis(!showInvoiceAxis)}
                />
                <DefaultCheckbox
                    label="Card payment Y-axis"
                    checked={showMasterCardActionAxis}
                    onChange={() => setShowMasterCardActionAxis(!showMasterCardActionAxis)}
                />
                <DefaultCheckbox
                    label="Request Inquiry Y-axis"
                    checked={showRequestInquiryAxis}
                    onChange={() => setShowRequestInquiryAxis(!showRequestInquiryAxis)}
                />
            </div>
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
                            color: "#FF272C",
                            datalabels: false
                        }),
                        StandardDataSet({
                            label: `Payments`,
                            yAxisID: "payments",
                            data: paymentChartData,
                            fill: false,
                            pointRadius: 0,
                            color: "#0d69ff",
                            datalabels: false
                        }),
                        StandardDataSet({
                            label: `Invoices`,
                            yAxisID: "invoices",
                            data: invoiceChartData,
                            fill: false,
                            pointRadius: 0,
                            color: "#67ff4d",
                            datalabels: false
                        }),
                        StandardDataSet({
                            label: `Requests`,
                            yAxisID: "requestInquiries",
                            data: requestInquiryChartData,
                            fill: false,
                            pointRadius: 0,
                            color: "#ff13c8",
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
                        })
                    ]
                }}
                options={options}
            />
        </div>
    );
};
