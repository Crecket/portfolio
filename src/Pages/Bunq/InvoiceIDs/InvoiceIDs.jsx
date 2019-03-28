import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import InvoiceIDChart from "./InvoiceIDChart";
import InvoiceIDMultiChart from "./InvoiceIDMultiChart";
import InvoiceIDChangeChart from "./InvoiceIDChangeChart";

export default ({ match, history, bunqData }) => {
    const [chart, setChart] = useState("change");

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
        history.push(`/bunq/invoices/${value}`);
    };

    if (!bunqData) return null;

    let chartComponent = null;
    switch (chart) {
        case "total":
            chartComponent = <InvoiceIDChart invoices={bunqData.invoices} />;
            break;
        case "datasets":
            chartComponent = <InvoiceIDMultiChart dataSets={bunqData.dataSets} />;
            break;
        default:
        case "change":
            chartComponent = <InvoiceIDChangeChart invoices={bunqData.invoices} />;
            break;
    }

    return (
        <div>
            <Helmet title="GregoryG - bunq invoices" />

            <AppBar position="static">
                <Tabs value={chart} onChange={chartChange}>
                    <Tab value="change" label="Invoices / month" />
                    <Tab value="total" label="Total invoices" />
                    <Tab value="datasets" label="Datasets" />
                </Tabs>
            </AppBar>

            <div style={{ display: "none" }}>
                <a href="/bunq/invoices/change">change</a>
                <a href="/bunq/invoices/total">total</a>
                <a href="/bunq/invoices/datasets">datasets</a>
            </div>

            {chartComponent}
        </div>
    );
};
