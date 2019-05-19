import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import DefaultSwitch from "../../../Components/DefaultSwitch";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";
import { standardBlue } from "../ChartColors";

export default ({ together }) => {
    const [logScale, toggleLogScale] = useState(false);

    const togetherChartData = together.map(user => {
        return {
            x: new Date(user.date),
            y: user.id
        };
    });

    const options = StandardChartOptions();
    options.scales.yAxes[0].type = logScale ? "logarithmic" : "linear";

    const data = StandardDataSet({
        label: "Together users",
        data: togetherChartData,
        backgroundColor: standardBlue,
        pointRadius: 0,
        trendlineLinear: false
    });

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The estimated total amount of users registered on Together.
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
                    options={options}
                />
            </div>
        </div>
    );
};
