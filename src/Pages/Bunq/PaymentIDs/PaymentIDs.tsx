import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";

import SEO from "../../../Components/SEO";
import Tab from "../../../Components/StyledTab";
import Tabs from "../../../Components/StyledTabs";
import useShareValueSetter from "../../../Hooks/useShareValueSetter";

import PaymentIDChart from "./PaymentIDChart";
import PaymentIDChangeChart from "./PaymentIDChangeChart";

export default ({ bunqData }) => {
    let params = useParams();
    const [chart, setChart] = useState(params.chart || "total");

    useShareValueSetter({ title: "Total amount of bunq payments", url: "https://gregoryg.dev/bunq/together" });

    useEffect(() => {
        if (params.chart && chart !== params.chart) {
            setChart(params.chart);
        }
    }, [params.chart, chart]);

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
