import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import DefaultSwitch from "../../../Components/DefaultSwitch";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";
import pluginTrendlineLinear from "../Plugins/trendLine";

export default ({ payments }) => {
    const [logScale, toggleLogScale] = useState(false);
    const [trendLine, toggleTrendLine] = useState(false);

    const paymentChartData = payments.map(payment => {
        return {
            x: new Date(payment.date),
            y: payment.id
        };
    });

    const options = StandardChartOptions();
    options.scales.yAxes[0].type = logScale ? "logarithmic" : "linear";

    const paymentDataSet = StandardDataSet({
        label: "Payments",
        data: paymentChartData,
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

    const dataSets = [paymentDataSet];

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The value shown is the average payment ID we found for that week. This is only an estimate but shows how
                many payments bunq has completed in total.
            </Typography>
            <div className="chart-content">
                <DefaultSwitch label="Log scale" checked={logScale} onChange={toggleLogScale} />
                <DefaultSwitch label="Trend line" checked={trendLine} onChange={toggleTrendLine} />
            </div>
            <Line
                plugins={[pluginTrendlineLinear]}
                data={{
                    datasets: dataSets
                }}
                options={options}
            />
        </div>
    );
};
