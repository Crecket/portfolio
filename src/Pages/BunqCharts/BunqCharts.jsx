import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";

import MuiTheme from "../../Config/MuiTheme";
import "./BunqCharts.scss";

import PaymentIDs from "./PaymentIDs/PaymentIDs";
import InvoiceIDs from "./InvoiceIDs/InvoiceIDs";

const theme = createMuiTheme(MuiTheme);

const BunqCharts = () => {
    const [bunqData, setBunqData] = useState(false);
    const [tab, setTab] = useState(0);

    useEffect(
        () => {
            axios
                .get(`/bunq-data.json`)
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
            <MuiThemeProvider theme={theme}>
                <div className="content">
                    <Paper>
                        <AppBar position="static">
                            <Tabs value={tab} onChange={(e, value) => setTab(value)}>
                                <Tab label="Payments" />
                                <Tab label="Invoices" />
                            </Tabs>
                        </AppBar>

                        {tab === 0 && <PaymentIDs bunqData={bunqData} />}
                        {tab === 1 && <InvoiceIDs bunqData={bunqData} />}
                    </Paper>
                </div>
            </MuiThemeProvider>
        </div>
    );
};

export default BunqCharts;
