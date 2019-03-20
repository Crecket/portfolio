import React from "react";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import StandardChartOptions from "../StandardChartOptions";

export default ({ bunqData }) => {
    const dataSet = [];
    bunqData.invoices.forEach(invoice => {
        const invoiceDate = new Date(invoice.date);

        let previousIndex = 0;
        const nextPayment = bunqData.payments.find((payment, index) => {
            const paymentDate = new Date(payment.date);
            const isNewer = paymentDate > invoiceDate;

            // keep previous index if this payment is newer
            if (!isNewer) previousIndex = index;
            return isNewer;
        });

        if (nextPayment) {
            const previousPayment = bunqData.payments[previousIndex];
            const averagePaymentId = (nextPayment.id + previousPayment.id) / 2;
            const invoicesPerPayment = Math.round(averagePaymentId / invoice.id);

            dataSet.push({
                x: invoiceDate,
                y: invoicesPerPayment
            });
        }
    });

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The amount of payments which have been done VS the currently total amount of invoices.
            </Typography>
            <Line
                data={{
                    datasets: [
                        {
                            label: `Payments per invoice`,
                            data: dataSet,
                            fill: true,
                            pointHitRadius: 1,
                            backgroundColor: "#0d61e8",
                            pointBackgroundColor: "#0d61e8"
                        }
                    ]
                }}
                options={StandardChartOptions()}
            />
        </div>
    );
};
