import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import Link from "react-router-dom/Link";
import Typography from "@material-ui/core/Typography";

import DefaultSwitch from "../../../Components/DefaultSwitch";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";

import MovingAverage from "../../../Functions/MovingAverage";
import TextField from "@material-ui/core/TextField";

export default ({ invoices }) => {
    const [movingAverage, setMovingAverage] = useState(true);
    const [compensation, setCompensation] = useState(10);
    const finalCompensation = (100 - compensation) / 100;

    let previousChange = 0;
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
    const movingAverageChartData = MovingAverage(mappedInvoiceXY, 2, true);

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

    const options = StandardChartOptions();
    const dataSets = [
        StandardDataSet({
            label: "Invoices",
            data: invoiceChartData,
            backgroundColor: "#0d61e8"
        }),
        StandardDataSet({
            label: "Invoice change",
            data: invoiceChartDelta,
            backgroundColor: invoiceChartDeltaColors,
            datalabels: false
        })
    ];

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                These numbers show how many invoices were created compared to the previous period. This is an estimate
                based on multiple lists of invoices found under the{" "}
                <Link className="inline-link" to="/bunq/invoices/datasets">
                    data sets
                </Link>{" "}
                tab.
            </Typography>
            <Typography variant="body1" className="chart-description">
                The compensation field removes X percentage of invoices to compensate for extra invoices which are
                generated for things like buying a new card.
            </Typography>
            <div className="chart-content">
                <DefaultSwitch label="Use 5 month moving average" checked={movingAverage} onChange={setMovingAverage} />
                <TextField
                    min="0"
                    type="number"
                    label="Percentage compensation"
                    className="text-field"
                    value={compensation}
                    onChange={e => setCompensation(e.target.value)}
                />
            </div>
            <Bar
                className="chart"
                options={options}
                data={{
                    datasets: dataSets
                }}
            />
        </div>
    );
};
