import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import StandardChartOptions from "../StandardChartOptions";

export default ({ invoices }) => {
    const [adjusted, setAdjusted] = useState(false);
    let previousChange = 0;
    const invoiceChartDelta = [];
    const invoiceChartDeltaColors = [];
    const invoiceChartData = invoices.map(invoice => {
        const invoiceIdChange = adjusted ? invoice.changeAdjusted : invoice.change;

        // calculate difference in new invoices between now and last month
        const changeVsLastMonth = invoiceIdChange - previousChange;
        const color = changeVsLastMonth < 0 ? "red" : "green";
        invoiceChartDelta.push(changeVsLastMonth);
        invoiceChartDeltaColors.push(color);

        previousChange = invoiceIdChange;
        return invoiceIdChange;
    });

    const invoiceChartLabels = invoices.map(invoice => {
        const date = new Date(invoice.date);
        return `${date.getFullYear()}/${date.getMonth() + 1}`;
    });

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
                <FormControlLabel
                    control={
                        <Switch checked={adjusted} onChange={e => setAdjusted(!adjusted)} value="checked" color="primary" />
                    }
                    label="Estimate invoice IDs for the 15th of the month instead of just showing the change between invoices."
                />
            </div>
            <Bar
                data={{
                    labels: invoiceChartLabels,
                    datasets: [
                        {
                            label: "Invoice change",
                            data: invoiceChartDelta,
                            borderWidth: 1,
                            backgroundColor: invoiceChartDeltaColors
                        },
                        {
                            label: "Invoices",
                            data: invoiceChartData,
                            borderWidth: 1,
                            backgroundColor: "#0d61e8"
                        }
                    ]
                }}
                options={StandardChartOptions}
            />
        </div>
    );
};
