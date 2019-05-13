import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import PaymentIDChart from "./PaymentIDChart";
import PaymentIDChangeChart from "./PaymentIDChangeChart";

export default ({ match, bunqData }) => {
    const [chart, setChart] = useState("total");

    useEffect(() => {
        if (match.params.chart && chart !== match.params.chart) {
            setChart(match.params.chart);
        }
    }, [match.params.chart, chart]);

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
                <Tabs value={chart}>
                    <Tab component={Link} to="/bunq/payments/total" value="total" label="Total payments" />
                    <Tab component={Link} to="/bunq/payments/average" value="average" label="Average payments" />
                </Tabs>
            </AppBar>

            {chartComponent}
        </div>
    );
};
