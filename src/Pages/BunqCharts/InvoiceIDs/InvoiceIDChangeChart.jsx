import React from "react";
import { Bar } from "react-chartjs-2";

import StandardChartOptions from "../StandardChartOptions";

export default ({ invoices }) => {
    let previousChange = 0;
    const invoiceChartDelta = [];
    const invoiceChartDeltaColors = [];
    const invoiceChartData = invoices.map(invoice => {
        const invoiceIdChange = invoice.change;

        // calculate difference in new invoices between now and last month
        const changeVsLastMonth = invoiceIdChange - previousChange;
        const color = changeVsLastMonth < 0 ? "red" : "green";
        invoiceChartDelta.push(changeVsLastMonth);
        invoiceChartDeltaColors.push(color);

        previousChange = invoiceIdChange;
        return invoiceIdChange;
    });

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
                        label: "Invoices",
                        data: invoiceChartData,
                        borderWidth: 1,
                        backgroundColor: "#0d61e8"
                    },
                    {
                        label: "Invoice change",
                        data: invoiceChartDelta,
                        borderWidth: 1,
                        backgroundColor: invoiceChartDeltaColors
                    }
                ]
            }}
            options={StandardChartOptions}
        />
    );
};
