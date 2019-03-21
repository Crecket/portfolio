import React from "react";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import StandardChartOptions from "../StandardChartOptions";

export default ({ bunqData }) => {
    const dataSet = [];
    const dataSet2 = [];
    let previousPaymentId = 0;
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
            const paymentIdChange = averagePaymentId - previousPaymentId;
            previousPaymentId = averagePaymentId;

            // go to next round, don't add this invoice
            if (invoice.changeAdjusted === 0) return;

            const invoicesPerPayment = Math.round(paymentIdChange / invoice.changeAdjusted);

            dataSet.push({
                x: invoiceDate,
                y: invoicesPerPayment
            });
            dataSet2.push({
                x: invoiceDate,
                y: paymentIdChange
            });
        }
    });

    const options = { ...StandardChartOptions() };
    options.scales.yAxes[0] = {
        ...options.scales.yAxes[0],
        id: "invoice-per-payment",
        gridLines: {
            display: true,
            color: "rgba(103, 77, 255, 0.6)"
        }
    };
    options.scales.yAxes[1] = {
        id: "payments-change",
        type: "linear",
        position: "right",
        fontColor: "white",
        ticks: {
            fontColor: "white",
            beginAtZero: true,
            callback: function(value, index, values) {
                return value.toLocaleString();
            }
        },
        gridLines: {
            display: true,
            color: "rgba(103, 255, 77, 0.6)"
        }
    };

    // remove the last month since it isn't complete and the amonut of payments will be lower
    dataSet.pop();
    dataSet2.pop();

    return (
        <div>
            <Typography variant="body1" className="chart-description">
                The amount of payments which have been done VS the amount of invoices for that month.
            </Typography>
            <Line
                data={{
                    datasets: [
                        {
                            label: `Invoices per payment`,
                            data: dataSet,
                            fill: false,
                            pointHitRadius: 1,
                            backgroundColor: "rgba(13, 97, 232, 0.6)",
                            // backgroundColor: "#0d61e8",
                            pointBackgroundColor: "#0d61e8",
                            yAxisID: "invoice-per-payment"
                        },
                        {
                            label: `Payments change`,
                            data: dataSet2,
                            fill: false,
                            pointHitRadius: 1,
                            backgroundColor: "rgba(103, 255, 77, 0.6)",
                            pointBackgroundColor: "#67ff4d",
                            yAxisID: "payments-change"
                        }
                    ]
                }}
                options={options}
            />
        </div>
    );
};
