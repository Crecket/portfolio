import React from "react";
import { Bar } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";

export default ({ invoices }) => {
    let previousChange = 0;
    const invoiceChartDelta = [];
    const invoiceChartDeltaColors = [];
    const invoiceChartData = [];
    invoices.forEach(invoice => {
        const invoiceIdChange = invoice.change;

        // skip no change events
        if (invoiceIdChange === 0) return;

        // calculate difference in new invoices between now and last month
        const changeVsLastMonth = invoiceIdChange - previousChange;
        const color = changeVsLastMonth < 0 ? "#ff171f" : "#67ff4d";
        invoiceChartDelta.push({
            x: new Date(invoice.date),
            y: changeVsLastMonth
        });
        invoiceChartDeltaColors.push(color);

        previousChange = invoiceIdChange;
        invoiceChartData.push({
            x: new Date(invoice.date),
            y: invoiceIdChange
        });
    });

    const options = StandardChartOptions();

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
            <Bar
                options={options}
                data={{
                    datasets: [
                        StandardDataSet({
                            label: "Invoice change",
                            data: invoiceChartDelta,
                            backgroundColor: invoiceChartDeltaColors,
                            datalabels: false
                        }),
                        StandardDataSet({
                            label: "Invoices",
                            data: invoiceChartData,
                            backgroundColor: "#0d61e8"
                        })
                    ]
                }}
            />
        </div>
    );
};
