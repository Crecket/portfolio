import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";

import CombinedAll from "./CombinedAll";

import Tab from "../../../Components/StyledTab";
import Tabs from "../../../Components/StyledTabs";

export default ({ match, bunqData }) => {
    const [chart, setChart] = useState("all");

    useEffect(() => {
        if (match.params.chart && chart !== match.params.chart) {
            setChart(match.params.chart);
        }
    }, [match.params.chart, chart]);

    if (!bunqData) return null;

    let chartComponent = null;
    switch (chart) {
        default:
        case "all":
            chartComponent = <CombinedAll bunqData={bunqData} />;
            break;
    }

    return (
        <div>
            <Helmet title="GregoryG - bunq combined datasets" />

            <AppBar position="static" color="default" className="appbar grey-gradient">
                <Tabs value={chart}>
                    <Tab component={Link} to="/bunq/combined/all" value="all" label="All data" />
                </Tabs>
            </AppBar>

            <Paper className="paper grey-gradient">{chartComponent}</Paper>
        </div>
    );
};
