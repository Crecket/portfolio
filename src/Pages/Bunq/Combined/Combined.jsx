import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import CombinedPaymentsAndInvoicesChart from "./CombinedPaymentsAndInvoicesChart";
import CombinedPaymentsPerInvoice from "./CombinedPaymentsPerInvoice";

export default ({ match, history, bunqData }) => {
    const [tab, setTab] = useState("payments-invoices");

    useEffect(
        () => {
            if (match.params.tab && tab !== match.params.tab) {
                setTab(match.params.tab);
            } else if (!match.params.tab) {
                history.push(`/bunq/combined/${tab}`);
            }
        },
        [match.params.tab]
    );
    const tabChange = (e, value) => {
        setTab(value);
        history.push(`/bunq/combined/${value}`);
    };

    if (!bunqData) return null;

    return (
        <div>
            <AppBar position="static">
                <Tabs value={tab} onChange={tabChange}>
                    <Tab value="payments-invoices" label="Payments and Invoices" />
                    <Tab value="payments-per-invoice" label="Payments per Invoice" />
                </Tabs>
            </AppBar>

            <div style={{ display: "none" }}>
                <a href="/bunq/combined/payments-invoices">payments-invoices</a>
                <a href="/bunq/combined/payments-per-invoice">payments-per-invoice</a>
            </div>

            <Switch>
                <Route path="/bunq/combined/payments-invoices">
                    <CombinedPaymentsAndInvoicesChart bunqData={bunqData} />
                </Route>
                <Route path="/bunq/combined/payments-per-invoice">
                    <CombinedPaymentsPerInvoice bunqData={bunqData} />
                </Route>
            </Switch>
        </div>
    );
};
