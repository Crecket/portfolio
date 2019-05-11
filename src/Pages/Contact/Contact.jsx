import React from "react";
import { Helmet } from "react-helmet";

import "./Contact.scss";

import LandingSection from "../../Components/LandingSection";
import Btc from "../../SVGImages/Btc";
import Eth from "../../SVGImages/Eth";
import Ltc from "../../SVGImages/Ltc";
import Neo from "../../SVGImages/Neo";

import WalletItem from "./WalletItem";

const walletList = [
    {
        ticker: "BTC",
        address: "3FXM2FYXn36WgdWexGiuisZwNuYyae1jxA",
        Icon: Btc
    },
    {
        ticker: "ETH",
        address: "0x62BA3D118ddA5447649bFD27f298927B2dA957bA",
        Icon: Eth
    },
    {
        ticker: "LTC",
        address: "3Pj6F7SjRm1DmodUhGeBWmD5AFHTiKmKsa",
        Icon: Ltc
    },
    {
        ticker: "NEO",
        address: "AXKCSsnPRh4EfeDa1J9R37q8Gx8SqWbHyF",
        Icon: Neo
    }
];

const Contact = () => {
    const walletComponents = walletList.map((wallet, index) => {
        return <WalletItem key={index} wallet={wallet} />;
    });

    return (
        <div className="contact">
            <Helmet title="GregoryG - Contact" />

            <LandingSection className="text-wrapper" displayHomeLink>
                <h1>Contact details</h1>

                <div className="links">{walletComponents}</div>
            </LandingSection>
        </div>
    );
};

export default Contact;
