import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import InvoiceIDChart from "./InvoiceIDChart";
import InvoiceIDChangeChart from "./InvoiceIDChangeChart";

export default ({ bunqData }) => {
    const [tab, setTab] = useState(0);

    if (!bunqData) return null;

    return (
        <div>
            <AppBar position="static">
                <Tabs value={tab} onChange={(e, value) => setTab(value)}>
                    <Tab label="Total invoices" />
                    <Tab label="Invoices change / month" />
                </Tabs>
            </AppBar>

            {tab === 0 && <InvoiceIDChart invoices={bunqData.invoices} />}
            {tab === 1 && <InvoiceIDChangeChart invoices={bunqData.invoices} />}
        </div>
    );
};
