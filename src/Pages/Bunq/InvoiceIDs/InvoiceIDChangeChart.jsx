import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import DefaultSwitch from "../../../Components/DefaultSwitch";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";

import MovingAverage from "../../../Functions/MovingAverage";

export default ({ invoices }) => {
    const [movingAverage, setMovingAverage] = useState(true);

    let previousChange = 0;
    const invoiceChartDelta = [];
    const invoiceChartDeltaColors = [];
    const invoiceChartData = [];

    // map invoice list to x/y values
    const mappedInvoiceXY = invoices.map(invoice => {
        return {
            x: new Date(invoice.date),
            y: invoice.change
        };
    });
    // calculate moving average
    const movingAverageChartData = MovingAverage(mappedInvoiceXY, 1, true);

    // wich dataset to use
    const invoiceList = movingAverage ? movingAverageChartData : mappedInvoiceXY;

    invoiceList.forEach(invoice => {
        const invoiceIdChange = invoice.y;

        // skip no change events
        if (invoiceIdChange === 0) return;

        // calculate difference in new invoices between now and last month
        const changeVsLastMonth = invoiceIdChange - previousChange;
        const color = changeVsLastMonth < 0 ? "#ff171f" : "#67ff4d";
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

    invoiceChartData.forEach(invoiceChartItem => {});

    const options = StandardChartOptions();

    const dataSets = [
        StandardDataSet({
            label: "Invoice change",
            data: invoiceChartDelta,
            backgroundColor: invoiceChartDeltaColors,
            datalabels: false
        }),
        StandardDataSet({
            label: "Invoices",
            data: invoiceChartData,
            backgroundColor: "#0d61e8",
            forceShowDataLabel: true
        })
    ];

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                Blue displays the change in Invoices compared to the previous period.This number is always positive as
                the invoice ID is incremental.
            </Typography>
            <Typography variant="body1" className="chart-description">
                Green and Red display the increase or decrease in invoice IDs compared to the previous period. If for a
                longer period of time the value stays green you can assume that bunq is gaining customers.
            </Typography>
            <div className="chart-content">
                <DefaultSwitch label="Use 3 month moving average" checked={movingAverage} onChange={setMovingAverage} />
            </div>
            <Bar
                options={options}
                data={{
                    datasets: dataSets
                }}
            />
        </div>
    );
};
