import React from "react";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";

const ContactItem = ({ contact, ...props }) => {
    const { action, type, value, image } = contact;

    const onCopy = e => {
        e.target.select();
        document.execCommand("copy");
        window.openSnackbar(`Copied the ${type} to your clipboard!`);
    };

    const component =
        action === "LINK" ? (
            <a target="_blank" rel="noopener noreferrer" href={`https://${value}`}>
                <InputBase readOnly className="address-field" value={value} />
            </a>
        ) : (
            <InputBase readOnly className="address-field" value={value} onClick={onCopy} />
        );

    return (
        <Paper className="contact-item" {...props}>
            <img src={image} alt={`${type} logo`} /> {component}
        </Paper>
    );
};

export default ContactItem;
