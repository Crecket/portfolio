import React from "react";
import { Line, Bar } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";
import DefaultSwitch from "../../../Components/DefaultSwitch";

export default ({ dataSets }) => {
    const [barMode, setBarMode] = React.useState(false);

    const invoiceChartDataSets = [];
    dataSets.forEach((dataSet, index) => {
        let color;
        switch (index) {
            case 0:
                color = "#e8300f";
                break;
            case 1:
                color = "#66ff4c";
                break;
            case 2:
                color = "#12a4ff";
                break;
            case 3:
                color = "#ffc234";
                break;
            case 4:
                color = "#ff04f4";
                break;
            case 5:
                color = "#d8d7ff";
                break;
            case 6:
                color = "#3cf5ff";
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

    const Component = barMode ? Bar : Line;
    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The datasets currently used to calculate the average change in invoiceIDs. The average change from each
                month for each dataset is calculated separately and then these values are averaged to get a more stable
                line.
            </Typography>
            <div className="chart-content">
                <DefaultSwitch label="Bar charts" checked={barMode} onChange={setBarMode} />
            </div>
            <Component
                data={{
                    datasets: invoiceChartDataSets
                }}
                options={StandardChartOptions()}
            />
        </div>
    );
};
