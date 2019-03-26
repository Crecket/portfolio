import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import InvoiceIDChart from "./InvoiceIDChart";
import InvoiceIDMultiChart from "./InvoiceIDMultiChart";
import InvoiceIDChangeChart from "./InvoiceIDChangeChart";

export default ({ match, history, bunqData }) => {
    const [tab, setTab] = useState("change");

    useEffect(
        () => {
            if (match.params.tab && tab !== match.params.tab) {
                setTab(match.params.tab);
            } else if (!match.params.tab) {
                history.push(`/bunq/invoices/${tab}`);
            }
        },
        [match.params.tab]
    );
    const tabChange = (e, value) => {
        setTab(value);
        history.push(`/bunq/invoices/${value}`);
    };

    if (!bunqData) return null;

    return (
        <div>
            <AppBar position="static">
                <Tabs value={tab} onChange={tabChange}>
                    <Tab value="change" label="Invoices / month" />
                    <Tab value="total" label="Total invoices" />
                    <Tab value="datasets" label="Datasets" />
                </Tabs>
            </AppBar>

            <Switch>
                <Route path="/bunq/invoices/change">
                    <InvoiceIDChangeChart invoices={bunqData.invoices} />
                </Route>
                <Route path="/bunq/invoices/total">
                    <InvoiceIDChart invoices={bunqData.invoices} />
                </Route>
                <Route path="/bunq/invoices/datasets">
                    <InvoiceIDMultiChart dataSets={bunqData.dataSets} />
                </Route>
            </Switch>
        </div>
    );
};
