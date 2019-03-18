import React from "react";
import { Line } from "react-chartjs-2";

import StandardChartOptions from "../StandardChartOptions";

export default ({ invoices }) => {
    const invoiceChartData = invoices.map(invoice => invoice.id);
    const invoiceChartLabels = invoices.map(invoice => {
        const date = new Date(invoice.date);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    });

    return (
        <Line
            data={{
                labels: invoiceChartLabels,
                datasets: [
                    {
                        label: "Invoices",
                        data: invoiceChartData,
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
