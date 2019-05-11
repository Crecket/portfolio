import React from "react";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";

const Contact = ({ wallet, ...props }) => {
    const { ticker, address, Icon } = wallet;

    return (
        <Paper key={ticker} className="wallet-item" {...props}>
            <Icon color={true} /> <InputBase className="address-field" readOnly value={address} />
        </Paper>
    );
};

export default Contact;
