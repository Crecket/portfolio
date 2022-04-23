import React from "react";
import { Bar } from "react-chartjs-2";
import Typography from "@mui/material/Typography";

import DefaultSwitch from "../../../Components/Controls/DefaultSwitch";
import MovingAverage from "../../../Functions/MovingAverage";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";
import StandardPlugins from "../StandardPlugins";
import { standardBlue } from "../ChartColors";

export default ({ payments }) => {
    const [movingAverage, setMovingAverage] = React.useState(true);

    let paymentChartData = payments.map(payment => {
        return {
            x: new Date(payment.date),
            y: payment.change
        };
    });
    if (movingAverage) {
        paymentChartData = MovingAverage(paymentChartData, 1, true);
    }

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The amount of payments done each DAY over the previous period. E.G. if in one week 500,000 payments are
                done, this number is divided by ~7 which is about 71,500 payments per day.
            </Typography>
            <div className="chart-content">
                <DefaultSwitch label="Use 3 week moving average" checked={movingAverage} onChange={setMovingAverage} />
            </div>
            <div className="chart-wrapper">
                <Bar
                    className="chart"
                    data={{
                        datasets: [
                            StandardDataSet({
                                label: "Payments",
                                data: paymentChartData,
                                borderWidth: 1,
                                backgroundColor: standardBlue,
                                datalabels: false
                            })
                        ]
                    }}
                    options={StandardChartOptions()}
                    plugins={StandardPlugins()}
                />
            </div>
        </div>
    );
};
