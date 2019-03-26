import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import PredictionsInvoices from "./PredictionsInvoices";

export default ({ match, history, bunqData }) => {
    const [tab, setTab] = useState("invoices");

    useEffect(
        () => {
            if (match.params.tab && tab !== match.params.tab) {
                setTab(match.params.tab);
            } else if (!match.params.tab) {
                history.push(`/bunq/predictions/${tab}`);
            }
        },
        [match.params.tab]
    );
    const tabChange = (e, value) => {
        setTab(value);
        history.push(`/bunq/predictions/${value}`);
    };

    if (!bunqData) return null;

    return (
        <div>
            <AppBar position="static">
                <Tabs value={tab} onChange={tabChange}>
                    <Tab value="invoices" label="Invoices" />
                </Tabs>
            </AppBar>

            <Switch>
                <Route path="/bunq/predictions/invoices">
                    <PredictionsInvoices invoices={bunqData.invoices} />
                </Route>
            </Switch>
        </div>
    );
};
