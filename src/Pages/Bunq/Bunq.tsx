import React, { useEffect, useState } from "react";
import loadable from "loadable-components";
import axios from "axios";
import "chartjs-plugin-datalabels";
import { Switch, Route, Link, useParams, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";

import MenuIcon from "@mui/icons-material/Menu";

import { DrawerContext } from "../../App";
import bunqThumbnail from "../Projects/images/bunq-charts-thumbnail.png";
import SEO from "../../Components/SEO";
import Tab from "../../Components/StyledTab";
import Tabs from "../../Components/StyledTabs";
import NoscriptDisclaimer from "../../Components/NoscriptDisclaimer";
import SpeedDialWrapper from "../../Components/Controls/SpeedDialWrapper";

import "./Bunq.scss";
import { useRouteMatch } from "react-router";

const PaymentIDs = loadable(() => import(`./PaymentIDs/PaymentIDs`));
const InvoiceIDs = loadable(() => import(`./InvoiceIDs/InvoiceIDs`));
const TogetherIDs = loadable(() => import(`./TogetherIDs/TogetherIDs`));
const Combined = loadable(() => import(`./Combined/Combined`));
const Predictions = loadable(() => import(`./Predictions/Predictions`));
const Images = loadable(() => import(`./Images/Images`));

export const ShareContext = React.createContext(null);

const Bunq = () => {
    let { type: paramTab } = useParams();
    let match = useRouteMatch();

    let params = useParams();
    let location = useLocation();

    console.log(params, match, location);

    const [bunqData, setBunqData] = useState(false);
    const [shareData, setShareData] = useState({ title: "bunq charts", url: "https://gregoryg.dev/bunq/invoices" });
    const [tab, setTab] = useState(paramTab || "invoices");
    const { toggleOpen } = React.useContext(DrawerContext);

    useEffect(() => {
        axios
            .get(`/bunq-data.json?v=v1`)
            .then(response => response.data)
            .then(setBunqData)
            .catch(error => {
                console.error(error);
                console.error("Failed to get bunq data");
            });
    }, []);
    useEffect(() => {
        if (paramTab && tab !== paramTab) {
            setTab(paramTab);
        } else if (!paramTab) {
            // history.push(`/bunq/${tab}`);
        }
    }, [paramTab, tab]);

    const onSave = () => {
        const canvas = document.getElementsByTagName("canvas")[0];
        const hiddenLink = document.getElementById("hidden-link");

        hiddenLink.setAttribute("download", "bunq-chart.png");
        hiddenLink.setAttribute("href", canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        hiddenLink.click();
    };

    return (
        <div className="bunq-charts">
            <ShareContext.Provider value={{ shareData, setShareData }}>
                <SEO
                    title="bunq charts"
                    description="Charts showing the different datasets collected through the bunq API"
                    path="/bunq"
                    image={bunqThumbnail}
                />

                <div className="content">
                    <IconButton
                        role="presentation"
                        aria-label="Menu"
                        className="menu-button"
                        onClick={toggleOpen}
                        size="large"
                    >
                        <MenuIcon />
                    </IconButton>

                    <SpeedDialWrapper
                        onSave={onSave}
                        onSaveLabel="Save chart as image"
                        ariaLabel="Share and save the charts"
                        shareValue={shareData}
                    />
                    <a aria-hidden="true" id="hidden-link" href="/bunq">
                        Helper link to download canvas
                    </a>

                    <AppBar position="static" color="default" className="appbar grey-gradient">
                        <Tabs value={tab}>
                            <Tab component={Link} to={"/bunq/invoices"} value="invoices" label="Invoices" />
                            <Tab component={Link} to={"/bunq/payments"} value="payments" label="Payments" />
                            <Tab component={Link} to={"/bunq/combined"} value="combined" label="Combined" />
                            <Tab component={Link} to={"/bunq/together"} value="together" label="Together users" />
                            <Tab component={Link} to={"/bunq/predictions"} value="predictions" label="Predictions" />
                            <Tab component={Link} to={"/bunq/images"} value="images" label="Images" />
                        </Tabs>
                    </AppBar>

                    <NoscriptDisclaimer />

                    <Switch>
                        <Route path={`/bunq/payments/:chart?`} render={() => <PaymentIDs bunqData={bunqData} />} />
                        <Route path={`/bunq/together/:chart?`} render={() => <TogetherIDs bunqData={bunqData} />} />
                        <Route path={`/bunq/combined/:chart?`} render={() => <Combined bunqData={bunqData} />} />
                        <Route path={`/bunq/predictions/:chart?`} render={() => <Predictions bunqData={bunqData} />} />
                        <Route path={`/bunq/images/:chart?`} render={() => <Images />} />
                        <Route path={`/bunq/invoices/:chart?`} render={() => <InvoiceIDs bunqData={bunqData} />} />
                        <Route render={() => <InvoiceIDs bunqData={bunqData} />} />
                    </Switch>
                </div>
            </ShareContext.Provider>
        </div>
    );
};

export default Bunq;
