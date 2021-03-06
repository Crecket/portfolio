import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";

import SEO from "../../../Components/SEO";
import Tab from "../../../Components/StyledTab";
import Tabs from "../../../Components/StyledTabs";
import useShareValueSetter from "../../../Hooks/useShareValueSetter";

import CombinedAll from "./CombinedAll";

export default ({ match, bunqData }) => {
    const [chart, setChart] = useState(match.params.chart || "all");

    useShareValueSetter({ title: "Multiple bunq datasets combined", url: "https://gregoryg.dev/bunq/combined" });

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
            <SEO
                title="bunq combined datasets"
                path="/bunq/combined"
                description="View multiple bunq datasets in a single graph"
            />

            <AppBar position="static" color="default" className="appbar grey-gradient">
                <Tabs value={chart}>
                    <Tab component={Link} to="/bunq/combined/all" value="all" label="All data" />
                </Tabs>
            </AppBar>

            <Paper className="paper grey-gradient">{chartComponent}</Paper>
        </div>
    );
};
