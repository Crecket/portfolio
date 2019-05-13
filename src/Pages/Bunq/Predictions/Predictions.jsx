import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import PredictionsInvoices from "./PredictionsInvoices";

export default ({ match, bunqData }) => {
    const [chart, setChart] = useState("invoices");

    useEffect(() => {
        if (match.params.chart && chart !== match.params.chart) {
            setChart(match.params.chart);
        }
    }, [match.params.chart, chart]);
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
                <Tabs value={chart}>
                    <Tab component={Link} to="/bunq/predictions/invoices" value="invoices" label="Invoices" />
                </Tabs>
            </AppBar>

            {chartComponent}
        </div>
    );
};
