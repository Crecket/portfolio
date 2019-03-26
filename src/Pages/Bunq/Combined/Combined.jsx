import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import CombinedPaymentsAndInvoicesChart from "./CombinedPaymentsAndInvoicesChart";
import CombinedPaymentsPerInvoice from "./CombinedPaymentsPerInvoice";

export default ({ bunqData }) => {
    const [tab, setTab] = useState(0);

    if (!bunqData) return null;

    return (
        <div>
            <AppBar position="static">
                <Tabs value={tab} onChange={(e, value) => setTab(value)}>
                    <Tab label="Payments and Invoices" />
                    <Tab label="Payments per Invoice" />
                </Tabs>
            </AppBar>

            {tab === 0 && <CombinedPaymentsAndInvoicesChart bunqData={bunqData} />}
            {tab === 1 && <CombinedPaymentsPerInvoice bunqData={bunqData} />}
        </div>
    );
};
