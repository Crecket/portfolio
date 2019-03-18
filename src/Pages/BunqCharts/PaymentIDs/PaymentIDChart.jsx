import React from "react";
import { Bar } from "react-chartjs-2";

import StandardChartOptions from "../StandardChartOptions";

export default ({ payments }) => {
    const paymentChartData = payments.map(payment => payment.id);
    const paymentChartLabels = payments.map(payment => {
        const date = new Date(payment.date);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    });

    return (
        <Bar
            data={{
                labels: paymentChartLabels,
                datasets: [
                    {
                        label: "Payments",
                        data: paymentChartData,
                        borderWidth: 1,
                        backgroundColor: "#0d61e8"
                    }
                ]
            }}
            options={StandardChartOptions}
        />
    );
};
