import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";

import SEO from "../../../Components/SEO";
import Tab from "../../../Components/StyledTab";
import Tabs from "../../../Components/StyledTabs";
import useShareValueSetter from "../../../Hooks/useShareValueSetter";

import PredictionsInvoices from "./PredictionsInvoices";

export default ({ bunqData }) => {
    let params = useParams();
    const [chart, setChart] = useState(params.chart || "invoices");

    useShareValueSetter({
        title: "Predict the amount of bunq users over time",
        url: "https://gregoryg.dev/bunq/predictions"
    });

    useEffect(() => {
        if (params.chart && chart !== params.chart) {
            setChart(params.chart);
        }
    }, [params.chart, chart]);
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
            <SEO
                title="bunq predictions"
                path="/bunq/predictions"
                description="Predictions on how many users bunq will have based on current growth"
            />

            <AppBar position="static" color="default" className="appbar grey-gradient">
                <Tabs value={chart}>
                    <Tab component={Link} to="/bunq/predictions/invoices" value="invoices" label="Invoices" />
                </Tabs>
            </AppBar>

            <Paper className="paper grey-gradient">{chartComponent}</Paper>
        </div>
    );
};
