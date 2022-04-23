import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";

import SEO from "../../../Components/SEO";
import Tab from "../../../Components/StyledTab";
import Tabs from "../../../Components/StyledTabs";
import useShareValueSetter from "../../../Hooks/useShareValueSetter";

import TogetherIDsChart from "./TogetherIDsChart";
import TogetherIDChangeChart from "./TogetherIDChangeChart";

export default ({ bunqData }) => {
    let params = useParams();
    const [chart, setChart] = useState(params.chart || "change");

    useShareValueSetter({ title: "bunq together IDs", url: "https://gregoryg.dev/bunq/together" });

    useEffect(() => {
        if (params.chart && chart !== params.chart) {
            setChart(params.chart);
        }
    }, [params.chart, chart]);
    if (!bunqData) return null;

    let chartComponent = null;
    switch (chart) {
        case "total":
            chartComponent = <TogetherIDsChart together={bunqData.togetherData} />;
            break;
        default:
        case "change":
            chartComponent = <TogetherIDChangeChart together={bunqData.togetherData} />;
            break;
    }

    return (
        <div>
            <SEO
                title="bunq together IDs"
                path="/bunq/together"
                description="View the amount of currently registered bunq Together users"
            />

            <AppBar position="static" color="default" className="appbar grey-gradient">
                <Tabs value={chart}>
                    <Tab component={Link} to="/bunq/together/change" value="change" label="Users / month" />
                    <Tab component={Link} to="/bunq/together/total" value="total" label="Total users" />
                </Tabs>
            </AppBar>

            <Paper className="paper grey-gradient">{chartComponent}</Paper>
        </div>
    );
};
