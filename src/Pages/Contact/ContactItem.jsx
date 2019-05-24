import React from "react";
import classNames from "classnames";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

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

const ContactItem = ({ mode = "full", visible = false, setQrValue, contact, ...props }) => {
    const { secondaryUrl, title, type, value, qrValue, image } = contact;

    const onCopy = e => {
        e.target.select();
        document.execCommand("copy");
        if (window) window.openSnackbar(`Copied the ${type} to your clipboard!`);
    };

    return (
        <Paper className={classNames("contact-item", "purple-gradient", visible && "visible")} elevation={3} {...props}>
            {image && <img src={image} alt={`${title || type} logo`} />}

            <FormControl className="address-field">
                <InputLabel htmlFor="adornment-password">{title || type || ""}</InputLabel>
                <Input multiline readOnly value={value || ""} onClick={onCopy} />
            </FormControl>

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
