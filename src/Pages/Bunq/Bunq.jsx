import React, { useEffect, useState } from "react";
import loadable from "loadable-components";
import axios from "axios";
import { Route, Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";

import SEO from "../../Components/SEO";
import NoscriptDisclaimer from "../../Components/NoscriptDisclaimer";
import Tab from "../../Components/StyledTab";
import Tabs from "../../Components/StyledTabs";

import "./Bunq.scss";
import bunqThumbnail from "../Projects/images/bunq-charts.png";

// register the chartjs plugin
import "chartjs-plugin-datalabels";

const PaymentIDs = loadable(() => import(`./PaymentIDs/PaymentIDs`));
const InvoiceIDs = loadable(() => import(`./InvoiceIDs/InvoiceIDs`));
const TogetherIDs = loadable(() => import(`./TogetherIDs/TogetherIDs`));
const Combined = loadable(() => import(`./Combined/Combined`));
const Predictions = loadable(() => import(`./Predictions/Predictions`));

const Bunq = ({ match }) => {
    const [bunqData, setBunqData] = useState(false);
    const [tab, setTab] = useState("invoices");

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
        if (match.params.tab && tab !== match.params.tab) {
            setTab(match.params.tab);
        } else if (!match.params.tab) {
            // history.push(`/bunq/${tab}`);
        }
    }, [match.params.tab, tab]);

    // https://developers.google.com/web/progressive-web-apps/checklist
    // and
    // https://developers.google.com/web/updates/2016/09/navigator-share
    // if (navigator.share) {
    //     navigator.share({
    //         title: 'bunq charts',
    //         text: 'Check out Web Fundamentals — it rocks!',
    //         url: 'https://gregoryg.dev/bunq',
    //     })
    //         .then(() => console.log('Successful share'))
    //         .catch((error) => console.log('Error sharing', error));
    // }

    return (
        <div className="bunq-charts">
            <SEO
                title="bunq charts"
                description="Charts showing the different datasets collected through the bunq API"
                path="/bunq"
                image={bunqThumbnail}
            />

            <div className="content">
                <AppBar position="static" color="default" className="appbar grey-gradient">
                    <Tabs value={tab}>
                        {/*<Tabs value={tab} variant="fullWidth">*/}
                        <Tab component={Link} to={"/bunq/invoices"} value="invoices" label="Invoices" />
                        <Tab component={Link} to={"/bunq/payments"} value="payments" label="Payments" />
                        <Tab component={Link} to={"/bunq/combined"} value="combined" label="Combined" />
                        <Tab component={Link} to={"/bunq/together"} value="together" label="Together users" />
                        <Tab component={Link} to={"/bunq/predictions"} value="predictions" label="Predictions" />
                    </Tabs>
                </AppBar>

                <NoscriptDisclaimer />

                <Route
                    path="/bunq/:tab?/:chart?"
                    component={props => {
                        const selectedTab = props.match.params.tab || "invoices";

                        switch (selectedTab) {
                            case "payments":
                                return <PaymentIDs bunqData={bunqData} {...props} />;
                            case "together":
                                return <TogetherIDs bunqData={bunqData} {...props} />;
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
            </div>
        </div>
    );
};

export default Bunq;
