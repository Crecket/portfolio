import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import CombinedMultiChart from "./CombinedMultiChart";

export default ({ bunqData }) => {
    const [tab, setTab] = useState(0);

    if (!bunqData) return null;

    return (
        <div>
            <AppBar position="static">
                <Tabs value={tab} onChange={(e, value) => setTab(value)}>
                    <Tab label="Payments / Invoices" />
                </Tabs>
            </AppBar>

            {tab === 0 && <CombinedMultiChart bunqData={bunqData} />}
        </div>
    );
};
