import React from "react";
import { Bar } from "react-chartjs-2";

import StandardChartOptions from "../StandardChartOptions";

export default ({ invoices }) => {
    let previousId = invoices[0].id;

    const invoiceChartData = invoices.map(invoice => {
        const invoiceId = invoice.id;
        const invoiceIdChange = invoiceId - previousId;

        previousId = invoiceId;
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
                        label: "Invoice ID average change per day",
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
