import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";

import PaymentIDChart from "./PaymentIDChart";
import PaymentIDChangeChart from "./PaymentIDChangeChart";

import SEO from "../../../Components/SEO";
import Tab from "../../../Components/StyledTab";
import Tabs from "../../../Components/StyledTabs";

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
            <SEO
                title="bunq payments"
                path="/bunq/payments"
                description="View the total payments and payments per month"
            />

            <AppBar position="static" color="default" className="appbar grey-gradient">
                <Tabs value={chart}>
                    <Tab component={Link} to="/bunq/payments/total" value="total" label="Total payments" />
                    <Tab component={Link} to="/bunq/payments/average" value="average" label="Average payments" />
                </Tabs>
            </AppBar>

            <Paper className="paper grey-gradient">{chartComponent}</Paper>
        </div>
    );
};
