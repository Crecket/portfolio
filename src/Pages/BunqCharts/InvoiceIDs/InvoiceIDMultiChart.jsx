import React from "react";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";

export default ({ dataSets }) => {
    const invoiceChartDataSets = [];
    dataSets.forEach((dataSet, index) => {
        let color;
        switch (index) {
            case 0:
                color = "#ff171f";
                break;
            case 1:
                color = "#67ff4d";
                break;
            case 2:
                color = "#0d61e8";
                break;
            default:
                color = "red";
                break;
        }

        const data = dataSet.invoices.map(invoice => {
            return {
                x: new Date(invoice.date),
                y: invoice.id
            };
        });

        invoiceChartDataSets.push(
            StandardDataSet({
                label: `Dateset #${index + 1}`,
                data: data,
                backgroundColor: color,
                fill: false,
                pointHitRadius: 1,
                datalabels: false
            })
        );
    });

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The datasets currently used to calculate the average change in invoiceIDs. The average change from each
                month for each dataset is calculated separately and then these values are averaged to get a more stable
                line.
            </Typography>
            <Line
                data={{
                    datasets: invoiceChartDataSets
                }}
                options={StandardChartOptions()}
            />
        </div>
    );
};
