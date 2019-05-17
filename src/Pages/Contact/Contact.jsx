import React from "react";
import { Helmet } from "react-helmet";
import Collapse from "@material-ui/core/Collapse";

import "./Contact.scss";
import LandingSection from "../../Components/LandingSection";
import ContactSelectionButton from "./ContactSelectionButton";
import ContactItem from "./ContactItem";

import discord from "./Images/discord.svg";
import github from "./Images/github.svg";
import linkedin from "./Images/linkedin.svg";
import steam from "./Images/steam.svg";
import telegram from "./Images/telegram.svg";

import bunq from "./Images/bunq.svg";
import btc from "./Images/btc.svg";
import eth from "./Images/eth.svg";
import ltc from "./Images/ltc.svg";
import neo from "./Images/neo.svg";
import xrp from "./Images/xrp.svg";

const contactList = [
    {
        action: "LINK",
        value: "https://linkedin.com/in/gregory-goijaerts/",
        image: linkedin
    },
    {
        action: "LINK",
        value: "https://github.com/Crecket",
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
        value: "https://t.me/gregoryg",
        image: telegram
    },
    {
        action: "LINK",
        value: "https://steamcommunity.com/id/Crecket",
        image: steam
    }
];

const walletList = [
    {
        action: "LINK",
        value: "https://bunq.me/gregory",
        image: bunq
    },
    {
        type: "Bitcoin Address",
        action: "COPY",
        value: "3FXM2FYXn36WgdWexGiuisZwNuYyae1jxA",
        secondaryUrl: "bitcoin:3FXM2FYXn36WgdWexGiuisZwNuYyae1jxA",
        image: btc
    },
    {
        type: "Ether Address",
        action: "COPY",
        value: "0x62BA3D118ddA5447649bFD27f298927B2dA957bA",
        image: eth
    },
    {
        type: "Litecoin Address",
        action: "COPY",
        value: "3Pj6F7SjRm1DmodUhGeBWmD5AFHTiKmKsa",
        image: ltc
    },
    {
        type: "Neo Address",
        action: "COPY",
        value: "AXKCSsnPRh4EfeDa1J9R37q8Gx8SqWbHyF",
        image: neo
    },
    {
        type: "XRP Address",
        action: "COPY",
        value: "rUpmKwXMRzyA7VNWnFrnmbFg7mPCuKf2e9",
        image: xrp
    }
];

const contactCombined = {
    contact: contactList,
    wallet: walletList
};

const Contact = () => {
    const [selected, setSelected] = React.useState(null);

    const onContactClick = index => () => setSelected({ type: "contact", index });
    const onWalletClick = index => () => setSelected({ type: "wallet", index });

    const contactSelectionButtons = contactList.map((contact, index) => {
        return <ContactSelectionButton key={index} contact={contact} onClick={onContactClick(index)} />;
    });
    const walletSelectionButtons = walletList.map((contact, index) => {
        return <ContactSelectionButton key={index} contact={contact} onClick={onWalletClick(index)} />;
    });

    return (
        <div className="contact">
            <Helmet title="GregoryG - Contact" />

            <LandingSection className="text-wrapper contact-content" displayMenuButton>
                <h1>Contact</h1>

                <h3 className="contact-subheader">Contact details</h3>
                <div className="links">{contactSelectionButtons}</div>

                <h3 className="contact-subheader">Payment details</h3>
                <div className="links">{walletSelectionButtons}</div>

                <Collapse in={selected !== null}>
                    {selected && <ContactItem contact={contactCombined[selected.type][selected.index]} />}
                </Collapse>
            </LandingSection>
        </div>
    );
};

export default Contact;
