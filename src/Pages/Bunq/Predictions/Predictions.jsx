import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import PredictionsInvoices from "./PredictionsInvoices";

export default ({ match, history, bunqData }) => {
    const [chart, setChart] = useState("invoices");

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
        history.push(`/bunq/predictions/${value}`);
    };

    if (!bunqData) return null;

    let chartComponent = null;
    switch (chart) {
        default:
        case "invoices":
            chartComponent = <PredictionsInvoices invoices={bunqData.invoices} />;
            break;
    }

    return (
        <div>
            <Helmet title="GregoryG - bunq predictions" />

            <AppBar position="static">
                <Tabs value={chart} onChange={chartChange}>
                    <Tab value="invoices" label="Invoices" />
                </Tabs>
            </AppBar>

            <div style={{ display: "none" }}>
                <a href="/bunq/predictions/invoices">total</a>
            </div>

            {chartComponent}
        </div>
    );
};
