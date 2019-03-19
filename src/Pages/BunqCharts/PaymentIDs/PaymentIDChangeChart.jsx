import React from "react";
import { Bar } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import StandardChartOptions from "../StandardChartOptions";

const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

export default ({ payments }) => {
    const firstPayment = payments.slice(payments.length - 1, 1);

    let previousDate = new Date(firstPayment.created);
    let previousId = firstPayment.id;
    const paymentChartData = payments.map(payment => {
        const paymentId = payment.id;
        const paymentDate = new Date(payment.date);

        // change in payment id value
        const paymentIdChange = paymentId - previousId;

        // change in date since last payment
        const diffDays = Math.round(Math.abs((previousDate.getTime() - paymentDate.getTime()) / oneDay));

        // average change per day
        const paymentIdAverageChange = Math.round(paymentIdChange / diffDays);

        previousId = paymentId;
        previousDate = paymentDate;

        return paymentIdAverageChange;
    });

    const paymentChartLabels = payments.map(payment => {
        const date = new Date(payment.date);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    });

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The amount of payments done each DAY over the previous period. E.G. if in one week 500,000 payments are
                done, this number is divided by ~7 which is about 71,500 payments per day.
            </Typography>
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
        </div>
    );
};
