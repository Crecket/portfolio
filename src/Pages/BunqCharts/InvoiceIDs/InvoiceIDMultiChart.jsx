import React from "react";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import StandardChartOptions from "../StandardChartOptions";

export default ({ dataSets }) => {
    const invoiceChartDataSets = [];
    dataSets.forEach((dataSet, index) => {
        let color;
        switch (index) {
            case 0:
                color = "rgb(255, 40, 40)";
                break;
            case 1:
                color = "rgb(40, 255, 40)";
                break;
            case 2:
                color = "rgb(40, 40, 255)";
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

        invoiceChartDataSets.push({
            label: `Dateset #${index + 1}`,
            data: data,
            backgroundColor: color,
            fill: false,
            pointHitRadius: 1
        });
    });

    const options = { ...StandardChartOptions };
    options.scales.xAxes[0] = {
        type: "time",
        distribution: "series"
    };

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
                options={options}
            />
        </div>
    );
};
