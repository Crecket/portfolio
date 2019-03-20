import React from "react";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import StandardChartOptions from "../StandardChartOptions";

export default ({ payments }) => {
    const paymentChartData = payments.map(payment => {
        return {
            x: new Date(payment.date),
            y: payment.id
        };
    });

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The value shown is the average payment ID we found for that week. This is only an estimate but shows how
                many payments bunq has completed in total.
            </Typography>
            <Line
                data={{
                    datasets: [
                        {
                            label: "Payments",
                            data: paymentChartData,
                            backgroundColor: "#0d61e8",
                            pointRadius: 0
                        }
                    ]
                }}
                options={StandardChartOptions()}
            />
        </div>
    );
};
