import React from "react";
import { Line } from "react-chartjs-2";

import StandardChartOptions from "../StandardChartOptions";

export default ({ bunqData }) => {
    const paymentChartData = bunqData.payments.map(payment => {
        return {
            x: new Date(payment.date),
            y: payment.id
        };
    });
    const invoiceChartData = bunqData.invoices.map(invoice => {
        return {
            x: new Date(invoice.date),
            y: invoice.id
        };
    });

    const options = { ...StandardChartOptions() };
    options.scales.yAxes[0] = {
        ...options.scales.yAxes[0],
        id: "payments",
        gridLines: {
            display: true
        }
    };
    options.scales.yAxes[1] = {
        id: "invoices",
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
            color: "rgba(103, 255, 77, 0.8)"
        }
    };

    return (
        <div>
            <Line
                data={{
                    datasets: [
                        {
                            label: `Payments`,
                            data: paymentChartData,
                            fill: false,
                            pointHitRadius: 1,
                            backgroundColor: "#0d61e8",
                            pointBackgroundColor: "#0d61e8",
                            yAxisID: "payments"
                        },
                        {
                            label: `Invoices`,
                            data: invoiceChartData,
                            fill: false,
                            pointHitRadius: 1,
                            backgroundColor: "#67ff4d",
                            pointBackgroundColor: "#67ff4d",
                            yAxisID: "invoices"
                        }
                    ]
                }}
                options={options}
            />
        </div>
    );
};
