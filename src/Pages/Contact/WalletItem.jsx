import React from "react";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";

const WalletItem = ({ wallet, ...props }) => {
    const { ticker, address, Icon } = wallet;

    const onCopy = e => {
        e.target.select();
        document.execCommand("copy");
        window.openSnackbar(`Copied the ${ticker} address to your clipboard!`);
    };

    return (
        <Paper className="wallet-item" {...props}>
            <Icon color={true} /> <InputBase readOnly className="address-field" value={address} onClick={onCopy} />
        </Paper>
    );
};

export default WalletItem;
