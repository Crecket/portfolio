import React from "react";
import classNames from "classnames";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import btc from "../../Images/Cryptocurrencies/btc.svg";
import eth from "../../Images/Cryptocurrencies/eth.svg";
import iota from "../../Images/Cryptocurrencies/miota.svg";
import ltc from "../../Images/Cryptocurrencies/ltc.svg";
import xrp from "../../Images/Cryptocurrencies/xrp.svg";
import axios from "axios";

const cryptoLogoMap = {
    BTC: btc,
    ETH: eth,
    IOTA: iota,
    LTC: ltc,
    XRP: xrp
};

const updateAddressInfo = (currency, address, addressInfo, setAddressInfo) => {
    axios
        .get(`${process.env.REACT_APP_API_BASE}/cryptocurrencies/balance/${currency}/${address}`)
        .then(response => response.data)
        .then(data => {
            const addressInfoCopy = { ...addressInfo };

            addressInfoCopy[`${currency}:${address}`] = data;
            setAddressInfo(addressInfoCopy);
        })
        .catch(error => {
            const addressInfoCopy = { ...addressInfo };

            addressInfoCopy[`${currency}:${address}`] = {
                error: error
            };
            setAddressInfo(addressInfoCopy);
        });
};

const AddressItem = ({ addressInfo }) => {
    const { address, currency, data } = addressInfo;
    const { balance } = data;

    return (
        <Paper className={classNames("contact-item", "purple-gradient")} elevation={3}>
            <ListItem>
                <ListItemIcon>
                    <img src={cryptoLogoMap[currency]} alt="Address currency type logo" />
                </ListItemIcon>
                <ListItemText primary={address} secondary={balance} />
            </ListItem>
        </Paper>
    );
};

const Addresses = ({ addressInfo, selectedAddress, setSelectedAddress }) => {
    console.log(addressInfo);

    const addresses = Object.keys(addressInfo).map(addresKey => (
        <AddressItem key={addresKey} addressInfo={addressInfo[addresKey]} />
    ));

    return <div className="addresses">{addresses}</div>;
};

export default Addresses;
