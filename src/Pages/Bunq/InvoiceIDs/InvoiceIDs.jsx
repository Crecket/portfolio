import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";

import InvoiceIDChart from "./InvoiceIDChart";
import InvoiceIDMultiChart from "./InvoiceIDMultiChart";
import InvoiceIDChangeChart from "./InvoiceIDChangeChart";

import Tab from "../../../Components/StyledTab";
import Tabs from "../../../Components/StyledTabs";

export default ({ match, bunqData }) => {
    const [chart, setChart] = useState("change");

    useEffect(() => {
        if (match.params.chart && chart !== match.params.chart) {
            setChart(match.params.chart);
        }
    }, [match.params.chart, chart]);
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

            <AppBar position="static" color="default" className="grey-gradient">
                <Tabs value={chart}>
                    <Tab component={Link} to="/bunq/invoices/change" value="change" label="Invoices / month" />
                    <Tab component={Link} to="/bunq/invoices/total" value="total" label="Total invoices" />
                    <Tab component={Link} to="/bunq/invoices/datasets" value="datasets" label="Datasets" />
                </Tabs>
            </AppBar>

            <Paper className="paper grey-gradient">{chartComponent}</Paper>
        </div>
    );
};
