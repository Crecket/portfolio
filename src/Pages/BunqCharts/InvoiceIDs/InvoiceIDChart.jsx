import React from "react";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import StandardChartOptions from "../StandardChartOptions";

export default ({ invoices }) => {
    const invoiceChartData = invoices.map(invoice => {
        return {
            x: new Date(invoice.date),
            y: invoice.id
        };
    });

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The average invoice ID for the lists of invoices we have for each month. This shows the estimated total
                amount of invoices that have been generated.
            </Typography>
            <Line
                data={{
                    datasets: [
                        {
                            label: "Invoices",
                            data: invoiceChartData,
                            backgroundColor: "#0d61e8",
                            pointRadius: 0
                        }
                    ]
                }}
                options={StandardChartOptions()}
            />
        </div>
    );
};
