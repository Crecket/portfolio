import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import DefaultSwitch from "../../../Components/DefaultSwitch";
import StandardChartOptions from "../StandardChartOptions";
import pluginTrendlineLinear from "../Plugins/trendLine";
import StandardDataSet from "../StandardDataSet";

export default ({ invoices }) => {
    const [logScale, toggleLogScale] = useState(false);
    const [trendLine, toggleTrendLine] = useState(false);

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
        backgroundColor: "rgba(13, 97, 232, 0.4)",
        pointRadius: 0,
        trendlineLinear: trendLine
            ? {
                  style: "#ff7a32",
                  lineStyle: "dotted|line",
                  width: 1
              }
            : false
    });

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The average invoice ID for the lists of invoices we have for each month. This shows the estimated total
                amount of invoices that have been generated.
            </Typography>
            <div className="chart-content">
                <DefaultSwitch label="Log scale" checked={logScale} onChange={toggleLogScale} />
                <DefaultSwitch label="Trend line" checked={trendLine} onChange={toggleTrendLine} />
            </div>
            <Line
                plugins={[pluginTrendlineLinear]}
                data={{
                    datasets: [data]
                }}
                options={options}
            />
        </div>
    );
};
