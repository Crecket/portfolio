import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import TogetherIDsChart from "./TogetherIDsChart";
import TogetherIDChangeChart from "./TogetherIDChangeChart";

export default ({ match, bunqData }) => {
    const [chart, setChart] = useState(match.params.chart || "change");

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
            <Helmet title="GregoryG - bunq together IDs" />

            <AppBar position="static">
                <Tabs value={chart}>
                    <Tab component={Link} to="/bunq/together/change" value="change" label="Users / month" />
                    <Tab component={Link} to="/bunq/together/total" value="total" label="Total users" />
                </Tabs>
            </AppBar>

            {chartComponent}
        </div>
    );
};