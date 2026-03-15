import React from "react";
import { Link, useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";

import SEO from "../../../Components/SEO";
import Tab from "../../../Components/StyledTab";
import Tabs from "../../../Components/StyledTabs";
import useShareValueSetter from "../../../Hooks/useShareValueSetter";

import InvoiceIDChart from "./InvoiceIDChart";
import InvoiceIDMultiChart from "./InvoiceIDMultiChart";
import InvoiceIDChangeChart from "./InvoiceIDChangeChart";

const InvoiceIDs = ({ bunqData }) => {
    const params = useParams();
    const chart = params.chart || "change";

    useShareValueSetter({
        title: "Estimate the amount of paying bunq users over time",
        url: "https://gregoryg.dev/bunq/invoices"
    });

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
            <SEO
                title="bunq invoices"
                path="/bunq/invoices"
                description="View the amount of invoices and currently paying bunq users"
            />

            <AppBar position="static" color="default" className="appbar grey-gradient">
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

export default InvoiceIDs;
