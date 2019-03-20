import React from "react";
import { Bar } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import StandardChartOptions from "../StandardChartOptions";

export default ({ payments }) => {
    const paymentChartData = payments.map(payment => {
        return {
            x: new Date(payment.date),
            y: payment.change
        };
    });

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The amount of payments done each DAY over the previous period. E.G. if in one week 500,000 payments are
                done, this number is divided by ~7 which is about 71,500 payments per day.
            </Typography>
            <Bar
                data={{
                    datasets: [
                        {
                            label: "Payments",
                            data: paymentChartData,
                            borderWidth: 1,
                            backgroundColor: "#0d61e8"
                        }
                    ]
                }}
                options={StandardChartOptions()}
            />
        </div>
    );
};
