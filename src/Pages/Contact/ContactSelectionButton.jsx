import React from "react";
import IconButton from "@material-ui/core/IconButton";

const ContactSelectionButton = ({ contact, ...props }) => {
    const { type, title, image } = contact;

    return (
        <IconButton className="selection-button" {...props}>
            <img className="selection-image" src={image} alt={`${title || type} logo`} />
        </IconButton>
    );
};

export default ContactSelectionButton;
