import React from "react";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

import StandardChartOptions from "../StandardChartOptions";
import StandardDataSet from "../StandardDataSet";

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
            if (invoice.change === 0) return;

            const invoicesPerPayment = Math.round(paymentIdChange / invoice.change);

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
            color: "rgba(255,255,255,0.6)"
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
                        StandardDataSet({
                            label: `Payments per invoice`,
                            data: dataSet,
                            fill: false,
                            pointHitRadius: 1,
                            backgroundColor: "rgba(13, 97, 232, 0.6)",
                            pointBackgroundColor: "#0d61e8",
                            yAxisID: "invoice-per-payment",
                            datalabels: false
                        }),
                        StandardDataSet({
                            label: `Total payments in period`,
                            data: dataSet2,
                            fill: false,
                            pointHitRadius: 1,
                            backgroundColor: "rgba(103, 255, 77, 0.6)",
                            pointBackgroundColor: "#67ff4d",
                            yAxisID: "payments-change",
                            datalabels: false
                        })
                    ]
                }}
                options={options}
            />
        </div>
    );
};
