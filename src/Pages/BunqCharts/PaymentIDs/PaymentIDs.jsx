import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import PaymentIDChart from "./PaymentIDChart";
import PaymentIDChangeChart from "./PaymentIDChangeChart";

export default ({ bunqData }) => {
    const [tab, setTab] = useState(0);

    if (!bunqData) return null;

    return (
        <div>
            <AppBar position="static">
                <Tabs value={tab} onChange={(e, value) => setTab(value)}>
                    <Tab label="Total payments" />
                    <Tab label="Average payments" />
                </Tabs>
            </AppBar>

            {tab === 0 && <PaymentIDChart payments={bunqData.payments} />}
            {tab === 1 && <PaymentIDChangeChart payments={bunqData.payments} />}
        </div>
    );
};
