import React from "react";
import QRCodeReact from "qrcode.react";
import Collapse from "@material-ui/core/Collapse";

import SEO from "../../Components/SEO";
import LandingSection from "../../Components/LandingSection";
import NoscriptDisclaimer from "../../Components/NoscriptDisclaimer";

import "./Contact.scss";
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
import xmr from "./Images/xmr.svg";
import xrp from "./Images/xrp.svg";

const contactList = [
    {
        title: "LinkedIn",
        action: "LINK",
        value: "https://linkedin.com/in/gregory-goijaerts/",
        image: linkedin
    },
    {
        title: "Github",
        action: "LINK",
        value: "https://github.com/Crecket",
        image: github
    },
    {
        title: "Discord",
        type: "Discord ID",
        action: "COPY",
        value: "Crecket#9979",
        image: discord
    },
    {
        title: "Telegram",
        action: "LINK",
        value: "https://t.me/gregoryg",
        image: telegram
    },
    {
        title: "Steam",
        action: "LINK",
        value: "https://steamcommunity.com/id/Crecket",
        image: steam
    }
];

const walletList = [
    {
        title: "bunq",
        action: "LINK",
        value: "https://bunq.me/gregory",
        image: bunq
    },
    {
        type: "Bitcoin Address",
        action: "COPY",
        value: "3FXM2FYXn36WgdWexGiuisZwNuYyae1jxA",
        secondaryUrl: "bitcoin:3FXM2FYXn36WgdWexGiuisZwNuYyae1jxA",
        qrValue: true,
        image: btc
    },
    {
        type: "Ether Address",
        action: "COPY",
        value: "0x62BA3D118ddA5447649bFD27f298927B2dA957bA",
        secondaryUrl: "https://etherscan.io/address/0x62BA3D118ddA5447649bFD27f298927B2dA957bA",
        qrValue: true,
        image: eth
    },
    {
        type: "Litecoin Address",
        action: "COPY",
        value: "3Pj6F7SjRm1DmodUhGeBWmD5AFHTiKmKsa",
        secondaryUrl: "litecoin:3Pj6F7SjRm1DmodUhGeBWmD5AFHTiKmKsa",
        qrValue: true,
        image: ltc
    },
    {
        type: "Monero Address",
        action: "COPY",
        value: "4AtAKpWXacM2hQbGNnC27cM7nhWRUgrBUWMAzqpHTZWz2MVtuQLrQ1YjMYRFofsEzf7DgBKUYG2ZD5sZAm2V5FrmGBwVNT5",
        qrValue: true,
        image: xmr
    },
    {
        type: "Neo Address",
        action: "COPY",
        value: "AXKCSsnPRh4EfeDa1J9R37q8Gx8SqWbHyF",
        secondaryUrl: "https://neotracker.io/address/AXKCSsnPRh4EfeDa1J9R37q8Gx8SqWbHyF",
        qrValue: true,
        image: neo
    },
    {
        type: "XRP Address",
        action: "COPY",
        value: "rUpmKwXMRzyA7VNWnFrnmbFg7mPCuKf2e9",
        secondaryUrl: "https://bithomp.com/explorer/rUpmKwXMRzyA7VNWnFrnmbFg7mPCuKf2e9",
        qrValue: true,
        image: xrp
    }
];

const contactCombined = {
    contact: contactList,
    wallet: walletList
};

const Contact = () => {
    const [selected, setSelected] = React.useState(null);
    const [qrValue, setQrValue] = React.useState(false);

    const onContactClick = index => () => setSelected({ type: "contact", index });
    const onWalletClick = index => () => setSelected({ type: "wallet", index });

    const contactSelectionButtons = contactList.map((contact, index) => {
        return <ContactSelectionButton key={index} contact={contact} onClick={onContactClick(index)} />;
    });
    const walletSelectionButtons = walletList.map((contact, index) => {
        return <ContactSelectionButton key={index} contact={contact} onClick={onWalletClick(index)} />;
    });

    const qrOnClick = () => setQrValue(false);

    return (
        <div className="contact">
            <SEO title="Contact" path="/contact" description="My public contact and payment details" />

            {qrValue && (
                <div className="qr-wrapper" onClick={qrOnClick}>
                    <div className="qr-content">
                        <QRCodeReact className="qr-code" size={225} value={qrValue} />
                    </div>
                </div>
            )}

            <LandingSection className="text-wrapper contact-content" displayMenuButton>
                <h1>Contact</h1>

                <NoscriptDisclaimer />

                <h3 className="contact-subheader">Contact details</h3>
                <div className="links">{contactSelectionButtons}</div>

                <h3 className="contact-subheader">Payment details</h3>
                <div className="links">{walletSelectionButtons}</div>

                <Collapse in={selected !== null} className="collapse">
                    {selected && (
                        <ContactItem contact={contactCombined[selected.type][selected.index]} setQrValue={setQrValue} />
                    )}
                </Collapse>
            </LandingSection>
        </div>
    );
};

export default Contact;
