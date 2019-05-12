import React from "react";
import { Helmet } from "react-helmet";

import "./Contact.scss";
import discord from "./Images/discord.svg";
import github from "./Images/github.svg";
import linkedin from "./Images/linkedin.svg";
import steam from "./Images/steam.svg";
import telegram from "./Images/telegram.svg";

import Btc from "./Images/Btc";
import Eth from "./Images/Eth";
import Ltc from "./Images/Ltc";
import Neo from "./Images/Neo";

import LandingSection from "../../Components/LandingSection";
import ContactItem from "./ContactItem";
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

const contactList = [
    {
        action: "LINK",
        value: "linkedin.com/in/gregory-goijaerts/",
        image: linkedin
    },
    {
        action: "LINK",
        value: "github.com/Crecket",
        image: github
    },
    {
        type: "Discord ID",
        action: "COPY",
        value: "Crecket#9979",
        image: discord
    },
    {
        action: "LINK",
        value: "t.me/gregoryg",
        image: telegram
    },
    {
        action: "LINK",
        value: "steamcommunity.com/id/Crecket",
        image: steam
    }
];

const Contact = () => {
    const contactComponents = contactList.map((contact, index) => {
        return <ContactItem key={index} contact={contact} />;
    });
    const walletComponents = walletList.map((wallet, index) => {
        return <WalletItem key={index} wallet={wallet} />;
    });

    return (
        <div className="contact">
            <Helmet title="GregoryG - Contact" />

            <LandingSection className="text-wrapper" displayHomeLink>
                <h1>Contact</h1>
                <div className="links">{contactComponents}</div>

                <h3>Public addresses</h3>
                <div className="links">{walletComponents}</div>
            </LandingSection>
        </div>
    );
};

export default Contact;
