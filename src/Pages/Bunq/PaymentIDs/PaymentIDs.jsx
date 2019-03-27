import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import PaymentIDChart from "./PaymentIDChart";
import PaymentIDChangeChart from "./PaymentIDChangeChart";

export default ({ match, history, bunqData }) => {
    const [tab, setTab] = useState("total");

    useEffect(
        () => {
            if (match.params.tab && tab !== match.params.tab) {
                setTab(match.params.tab);
            } else if (!match.params.tab) {
                history.push(`/bunq/payments/${tab}`);
            }
        },
        [match.params.tab]
    );
    const tabChange = (e, value) => {
        setTab(value);
        history.push(`/bunq/payments/${value}`);
    };

    if (!bunqData) return null;

    return (
        <div>
            <AppBar position="static">
                <Tabs value={tab} onChange={tabChange}>
                    <Tab value="total" label="Total payments" />
                    <Tab value="average" label="Average payments" />
                </Tabs>
            </AppBar>

            <div style={{ display: "none" }}>
                <a href="/bunq/invoices/total">total</a>
                <a href="/bunq/payments/average">average</a>
            </div>

            <Switch>
                <Route path="/bunq/payments/total">
                    <PaymentIDChart payments={bunqData.payments} />
                </Route>
                <Route path="/bunq/payments/average">
                    <PaymentIDChangeChart payments={bunqData.payments} />
                </Route>
            </Switch>
        </div>
    );
};
