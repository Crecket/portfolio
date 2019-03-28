import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Route } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";

import "./Bunq.scss";

import PaymentIDs from "./PaymentIDs/PaymentIDs";
import InvoiceIDs from "./InvoiceIDs/InvoiceIDs";
import Combined from "./Combined/Combined";
import Predictions from "./Predictions/Predictions";

// register the chartjs plugin
import "chartjs-plugin-datalabels";

const Bunq = ({ history, match }) => {
    const [bunqData, setBunqData] = useState(false);
    const [tab, setTab] = useState("invoices");

    useEffect(
        () => {
            axios
                .get(`/bunq-data.json?v=v1`)
                .then(response => response.data)
                .then(setBunqData)
                .catch(error => {
                    console.error(error);
                    console.error("Failed to get bunq data");
                });
        },
        [0]
    );

    useEffect(
        () => {
            if (match.params.tab && tab !== match.params.tab) {
                setTab(match.params.tab);
            } else if (!match.params.tab) {
                // history.push(`/bunq/${tab}`);
            }
        },
        [match.params.tab]
    );
    const tabChange = (e, value) => {
        setTab(value);
        history.push(`/bunq/${value}`);
    };

    return (
        <div className="bunq-charts">
            <Helmet title="GregoryG - bunq charts" />
            <div className="content">
                <Paper>
                    <AppBar position="static">
                        <Tabs value={tab} onChange={tabChange}>
                            <Tab value="invoices" label="Invoices" />
                            <Tab value="payments" label="Payments" />
                            <Tab value="combined" label="Combined" />
                            <Tab value="predictions" label="Predictions" />
                        </Tabs>
                    </AppBar>

                    <div style={{ display: "none" }}>
                        <a href="/bunq/invoices">invoices</a>
                        <a href="/bunq/payments">payments</a>
                        <a href="/bunq/combined">combined</a>
                        <a href="/bunq/predictions">predictions</a>
                    </div>

                    <Route
                        path="/bunq/:tab?/:chart?"
                        component={props => {
                            const selectedTab = props.match.params.tab || "invoices";

                            switch (selectedTab) {
                                case "payments":
                                    return <PaymentIDs bunqData={bunqData} {...props} />;
                                case "combined":
                                    return <Combined bunqData={bunqData} {...props} />;
                                case "predictions":
                                    return <Predictions bunqData={bunqData} {...props} />;
                                default:
                                case "invoices":
                                    return <InvoiceIDs bunqData={bunqData} {...props} />;
                            }
                        }}
                    />
                </Paper>
            </div>
        </div>
    );
};

export default Bunq;
