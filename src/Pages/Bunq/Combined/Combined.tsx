import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";

import SEO from "../../../Components/SEO";
import Tab from "../../../Components/StyledTab";
import Tabs from "../../../Components/StyledTabs";
import useShareValueSetter from "../../../Hooks/useShareValueSetter";

import CombinedAll from "./CombinedAll";

export default ({ bunqData }) => {
    let params = useParams();
    const [chart, setChart] = useState(params.chart || "all");

    console.log("abc")

    useShareValueSetter({ title: "Multiple bunq datasets combined", url: "https://gregoryg.dev/bunq/combined" });

    useEffect(() => {
        if (params.chart && chart !== params.chart) {
            setChart(params.chart);
        }
    }, [params.chart, chart]);

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
