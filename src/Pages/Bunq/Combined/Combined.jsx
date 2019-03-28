import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import CombinedPaymentsAndInvoicesChart from "./CombinedPaymentsAndInvoicesChart";
import CombinedPaymentsPerInvoice from "./CombinedPaymentsPerInvoice";

export default ({ match, history, bunqData }) => {
    const [chart, setChart] = useState("payments-invoices");

    useEffect(
        () => {
            if (match.params.chart && chart !== match.params.chart) {
                setChart(match.params.chart);
            }
        },
        [match.params.chart]
    );
    const chartChange = (e, value) => {
        setChart(value);
        history.push(`/bunq/combined/${value}`);
    };

    if (!bunqData) return null;

    let chartComponent = null;
    switch (chart) {
        case "payments-per-invoice":
            chartComponent = <CombinedPaymentsPerInvoice bunqData={bunqData} />;
            break;
        default:
        case "payments-invoices":
            chartComponent = <CombinedPaymentsAndInvoicesChart bunqData={bunqData} />;
            break;
    }

    return (
        <div>
            <Helmet title="GregoryG - bunq combined datasets" />

            <AppBar position="static">
                <Tabs value={chart} onChange={chartChange}>
                    <Tab value="payments-invoices" label="Payments and Invoices" />
                    <Tab value="payments-per-invoice" label="Payments per Invoice" />
                </Tabs>
            </AppBar>

            <div style={{ display: "none" }}>
                <a href="/bunq/combined/payments-invoices">payments-invoices</a>
                <a href="/bunq/combined/payments-per-invoice">payments-per-invoice</a>
            </div>

            {chartComponent}
        </div>
    );
};
