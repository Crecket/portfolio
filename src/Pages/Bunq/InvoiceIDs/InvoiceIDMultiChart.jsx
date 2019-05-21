import React from "react";
import { Line, Bar } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";
import StandardPlugins from "../StandardPlugins";
import DefaultSwitch from "../../../Components/DefaultSwitch";

const selectColor = (colorNum, count) => {
    if (count < 1) count = 1;
    return "hsl(" + ((colorNum * (360 / count)) % 360) + ",100%,50%)";
};

export default ({ dataSets }) => {
    const [barMode, setBarMode] = React.useState(false);

    const invoiceChartDataSets = [];
    dataSets.forEach((dataSet, index) => {
        const color = selectColor(index, dataSets.length);

        if (dataSet.invoices) {
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
        }
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
            <div className="chart-wrapper">
                <Component
                    className="chart"
                    data={{
                        datasets: invoiceChartDataSets
                    }}
                    options={StandardChartOptions("x")}
                    plugins={StandardPlugins()}
                />
            </div>
        </div>
    );
};
