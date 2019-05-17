import React from "react";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import InputBase from "@material-ui/core/InputBase";

import UrlIcon from "@material-ui/icons/Link";

const ContactItem = ({ mode = "full", contact, ...props }) => {
    const { action, secondaryUrl, type, value, image } = contact;

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
            {secondaryUrl ? (
                <>
                    <Divider className="divider" />
                    <a className="secondary-link" target="_blank" rel="noopener noreferrer" href={secondaryUrl}>
                        <UrlIcon />
                    </a>
                </>
            ) : null}
        </Paper>
    );
};

export default ContactItem;
