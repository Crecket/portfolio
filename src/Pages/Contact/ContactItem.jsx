import React from "react";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import InputBase from "@material-ui/core/InputBase";

import UrlIcon from "@material-ui/icons/Link";
import QrIcon from "../../SVGImages/QR";

const QrButton = ({ setQrValue, qrValue, value }) => {
    if (!qrValue) return null;

    const usedQrValue = qrValue === true ? value : qrValue;
    return (
        <span className="secondary-link" onClick={() => setQrValue(usedQrValue)}>
            <QrIcon />
        </span>
    );
};

const SecondaryUrl = ({ secondaryUrl }) => {
    if (!secondaryUrl) return null;

    return (
        <a className="secondary-link" target="_blank" rel="noopener noreferrer" href={secondaryUrl}>
            <UrlIcon />
        </a>
    );
};

const ContactItem = ({ mode = "full", setQrValue, contact, ...props }) => {
    const { action, secondaryUrl, type, value, qrValue, image } = contact;

    const onCopy = e => {
        e.target.select();
        document.execCommand("copy");
        window.openSnackbar(`Copied the ${type} to your clipboard!`);
    };

    const component =
        action === "LINK" ? (
            <a className="address-link" target="_blank" rel="noopener noreferrer" href={value}>
                <InputBase readOnly className="address-field" value={value} />
            </a>
        ) : (
            <InputBase readOnly className="address-field" value={value} onClick={onCopy} />
        );

    return (
        <Paper className="contact-item" elevation={3} {...props}>
            <img src={image} alt={`${type} logo`} /> {component}
            {secondaryUrl || qrValue ? (
                <>
                    <Divider className="divider" />
                    <QrButton setQrValue={setQrValue} qrValue={qrValue} value={value} />
                    <SecondaryUrl secondaryUrl={secondaryUrl} />
                </>
            ) : null}
        </Paper>
    );
};

export default ContactItem;
