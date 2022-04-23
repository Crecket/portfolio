import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import Typography from "@mui/material/Typography";

import DefaultSwitch from "../../../Components/Controls/DefaultSwitch";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";
import StandardPlugins from "../StandardPlugins";
import { standardBlue } from "../ChartColors";

export default ({ payments }) => {
    const [logScale, toggleLogScale] = useState(false);

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
        backgroundColor: standardBlue,
        pointRadius: 0,
        trendlineLinear: false
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
            </div>
            <div className="chart-wrapper">
                <Line
                    className="chart"
                    data={{
                        datasets: dataSets
                    }}
                    options={options}
                    plugins={StandardPlugins()}
                />
            </div>
        </div>
    );
};
