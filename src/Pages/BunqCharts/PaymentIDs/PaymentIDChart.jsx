import React from "react";
import { Line } from "react-chartjs-2";

import StandardChartOptions from "../StandardChartOptions";

export default ({ payments }) => {
    const paymentChartData = payments.map(payment => payment.id);
    const paymentChartLabels = payments.map(payment => {
        const date = new Date(payment.date);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    });

    return (
        <Line
            data={{
                labels: paymentChartLabels,
                datasets: [
                    {
                        label: "Payments",
                        data: paymentChartData,
                        backgroundColor: "rgba(13, 97, 232, 0.2)",
                        pointBackgroundColor: "#1840ff",
                        pointHitRadius: 1
                    }
                ]
            }}
            options={StandardChartOptions}
        />
    );
};
