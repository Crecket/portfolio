import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";

import SEO from "../../../Components/SEO";
import Tab from "../../../Components/StyledTab";
import Tabs from "../../../Components/StyledTabs";
import useShareValueSetter from "../../../Hooks/useShareValueSetter";

import TogetherIDsChart from "./TogetherIDsChart";
import TogetherIDChangeChart from "./TogetherIDChangeChart";

export default ({ match, bunqData }) => {
    const [chart, setChart] = useState(match.params.chart || "change");

    useShareValueSetter({ title: "bunq together IDs", url: "https://gregoryg.dev/bunq/together" });

    useEffect(() => {
        if (match.params.chart && chart !== match.params.chart) {
            setChart(match.params.chart);
        }
    }, [match.params.chart, chart]);
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
