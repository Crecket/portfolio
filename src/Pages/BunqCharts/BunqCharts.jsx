import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";

import "./BunqCharts.scss";

import PaymentIDs from "./PaymentIDs/PaymentIDs";
import InvoiceIDs from "./InvoiceIDs/InvoiceIDs";
import Combined from "./Combined/Combined";

// register the chartjs plugin
import "chartjs-plugin-datalabels";

const BunqCharts = () => {
    const [bunqData, setBunqData] = useState(false);
    const [tab, setTab] = useState(0);

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

    return (
        <div className="bunq-charts">
            <Helmet title="GregoryG - bunq charts" />
            <div className="content">
                <Paper>
                    <AppBar position="static">
                        <Tabs value={tab} onChange={(e, value) => setTab(value)}>
                            <Tab label="Invoices" />
                            <Tab label="Payments" />
                            <Tab label="Combined" />
                        </Tabs>
                    </AppBar>

                    {tab === 0 && <InvoiceIDs bunqData={bunqData} />}
                    {tab === 1 && <PaymentIDs bunqData={bunqData} />}
                    {tab === 2 && <Combined bunqData={bunqData} />}
                </Paper>
            </div>
        </div>
    );
};

export default BunqCharts;
