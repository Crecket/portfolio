import React from "react";
import IconButton from "@material-ui/core/IconButton";

const ContactSelectionButton = ({ contact, onClick, ...props }) => {
    const { action, value, type, title, image } = contact;

    const iconButtonProps = {};
    if (action === "LINK") {
        iconButtonProps.component = "a";
        iconButtonProps.href = value;
        iconButtonProps.target = "_blank";
        iconButtonProps.rel = "noopener noreferrer";
    } else {
        iconButtonProps.onClick = onClick;
    }

    return (
        <IconButton className="selection-button" {...iconButtonProps} {...props}>
            <img className="selection-image" src={image} alt={`${title || type} logo`} />
        </IconButton>
    );
};

export default ContactSelectionButton;
