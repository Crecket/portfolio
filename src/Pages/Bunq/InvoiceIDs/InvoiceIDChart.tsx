import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import Typography from "@mui/material/Typography";

import DefaultSwitch from "../../../Components/Controls/DefaultSwitch";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";
import StandardPlugins from "../StandardPlugins";
import { standardBlue } from "../ChartColors";

export default ({ invoices }) => {
    const [logScale, toggleLogScale] = useState(false);

    const invoiceChartData = invoices.map(invoice => {
        return {
            x: new Date(invoice.date),
            y: invoice.id
        };
    });

    const options = StandardChartOptions();
    options.scales.yAxes[0].type = logScale ? "logarithmic" : "linear";

    const data = StandardDataSet({
        label: "Invoices",
        data: invoiceChartData,
        backgroundColor: standardBlue,
        pointRadius: 0,
        trendlineLinear: false
    });

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The average invoice ID for the lists of invoices we have for each month. This shows the estimated total
                amount of invoices that have been generated.
            </Typography>
            <div className="chart-content">
                <DefaultSwitch label="Log scale" checked={logScale} onChange={toggleLogScale} />
            </div>
            <div className="chart-wrapper">
                <Line
                    className="chart"
                    data={{
                        datasets: [data]
                    }}
                    plugins={StandardPlugins()}
                    options={options}
                />
            </div>
        </div>
    );
};
