import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";

import PaymentIDChart from "./PaymentIDChart";
import PaymentIDChangeChart from "./PaymentIDChangeChart";

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
            <Helmet title="GregoryG - bunq payments" />

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
