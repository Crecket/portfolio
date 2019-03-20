import React from "react";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

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
            display: true,
            color: "rgba(42, 94, 255, 0.3)"
        }
    };
    options.scales.yAxes[1] = {
        id: "invoices",
        type: "linear",
        position: "right",
        fontColor: "white",
        gridLines: {
            display: true,
            color: "rgba(103, 255, 77, 0.3)"
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
                            backgroundColor: "#2a5eff",
                            pointBackgroundColor: "#2a5eff",
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
