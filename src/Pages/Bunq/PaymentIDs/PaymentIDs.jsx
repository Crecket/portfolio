import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import PaymentIDChart from "./PaymentIDChart";
import PaymentIDChangeChart from "./PaymentIDChangeChart";

export default ({ match, history, bunqData }) => {
    const [chart, setChart] = useState("total");

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
        history.push(`/bunq/payments/${value}`);
    };

    if (!bunqData) return null;
    let chartComponent = null;
    switch (chart) {
        case "average":
            chartComponent = <PaymentIDChangeChart payments={bunqData.payments} />;
            break;
        default:
        case "total":
            chartComponent = <PaymentIDChart payments={bunqData.payments} />;
            break;
    }

    return (
        <div>
            <Helmet title="GregoryG - bunq payments" />

            <AppBar position="static">
                <Tabs value={chart} onChange={chartChange}>
                    <Tab value="total" label="Total payments" />
                    <Tab value="average" label="Average payments" />
                </Tabs>
            </AppBar>

            <div style={{ display: "none" }}>
                <a href="/bunq/invoices/total">total</a>
                <a href="/bunq/payments/average">average</a>
            </div>

            {chartComponent}
        </div>
    );
};
