import React from "react";
import IconButton from "@mui/material/IconButton";

const ContactSelectionButton = ({ contact, onClick, ...props }) => {
    const { action, value, type, title, image } = contact;

    const iconButtonProps: any = {};
    if (action === "LINK") {
        iconButtonProps.component = "a";
        iconButtonProps.href = value;
        iconButtonProps.target = "_blank";
        iconButtonProps.rel = "noopener noreferrer";
    } else {
        iconButtonProps.onClick = onClick;
    }

    return (
        <IconButton className="selection-button" {...iconButtonProps} {...props} size="large">
            <img className="selection-image" src={image} alt={`${title || type} logo`} />
        </IconButton>
    );
};

export default ContactSelectionButton;
