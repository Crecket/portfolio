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

    const [showPayments, setShowPayments] = React.useState(true);
    const [showRequestInquiries, setShowRequestInquiries] = React.useState(true);
    const [showMasterCardActions, setShowMasterCardActions] = React.useState(true);
    const [showTogetherData, setShowTogetherData] = React.useState(true);
    const [showInvoices, setShowInvoices] = React.useState(true);
    const [showCards, setShowCards] = React.useState(true);

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

    return (
        <div>
            <div className="chart-content">
                <DefaultSwitch label="Show annotations" checked={showAnnotations} onChange={setShowAnnotations} />
            </div>
            <div className="chart-content">
                <Typography variant="subtitle1">Datasets</Typography>
            </div>
            <div className="chart-content">
                <DefaultCheckbox label="Cards" checked={showCards} onChange={() => setShowCards(!showCards)} />
                <DefaultCheckbox
                    label="Payment"
                    checked={showPayments}
                    onChange={() => setShowPayments(!showPayments)}
                />
                <DefaultCheckbox
                    label="Invoice"
                    checked={showInvoices}
                    onChange={() => setShowInvoices(!showInvoices)}
                />
                <DefaultCheckbox
                    label="Card payment"
                    checked={showMasterCardActions}
                    onChange={() => setShowMasterCardActions(!showMasterCardActions)}
                />
                <DefaultCheckbox
                    label="Request inquiry"
                    checked={showRequestInquiries}
                    onChange={() => setShowRequestInquiries(!showRequestInquiries)}
                />
                <DefaultCheckbox
                    label="Together users"
                    checked={showTogetherData}
                    onChange={() => setShowTogetherData(!showTogetherData)}
                />
            </div>
            <div className="chart-content">
                <Typography variant="subtitle1">Y-axis for each dataset.</Typography>
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
                        datasets: dataSets
                    }}
                    options={options}
                />
            </div>
        </div>
    );
};
