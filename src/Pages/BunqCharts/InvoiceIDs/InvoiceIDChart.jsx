import React from "react";
import { Bar } from "react-chartjs-2";

import StandardChartOptions from "../StandardChartOptions";

export default ({ invoices }) => {
    const invoiceChartData = invoices.map(invoice => invoice.id);
    const invoiceChartLabels = invoices.map(invoice => {
        const date = new Date(invoice.date);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    });

    return (
        <Bar
            data={{
                labels: invoiceChartLabels,
                datasets: [
                    {
                        label: "Invoice ID",
                        data: invoiceChartData,
                        borderWidth: 1,
                        backgroundColor: "#0d61e8"
                    }
                ]
            }}
            options={StandardChartOptions}
        />
    );
};
