import React from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import SEO from "../../Components/SEO";
import LandingSection from "../../Components/LandingSection";

import Addresses from "./Addresses";
import AddressInfo from "./AddressInfo";

import "./Wallet.scss";

const supportedCryptocurrencies = ["BTC", "LTC", "ETH", "IOTA", "XRP"];

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

            addressInfoCopy[`${currency}:${address}`] = data;
            setAddressInfo(addressInfoCopy);
        });
};

const Wallet = props => {
    console.log("Render");
    const [addressInfo, setAddressInfo] = React.useState({});
    const [selectedAddress, setSelectedAddress] = React.useState(0);

    React.useEffect(() => {
        const searchParams = new URLSearchParams(props.location.search);
        const addressParams = searchParams.getAll("address");
        const addressInfoCopy = { ...addressInfo };

        // remove address info for addresses no longer in the list
        Object.keys(addressInfo).forEach(addressKey => {
            if (!addressParams.includes(addressKey)) {
                delete addressInfoCopy[addressKey];
                console.log("Deleted info");
                setAddressInfo(addressInfoCopy);
            }
        });

        addressParams.forEach(addressKey => {
            const [currency, address] = addressKey.split(":");

            // ignore unsupported currencies
            if (!supportedCryptocurrencies.includes(currency)) return;

            if (!addressInfo[addressKey]) {
                // update API info
                updateAddressInfo(currency, address, addressInfo, setAddressInfo);
            }
        });
    }, [props.location.search, addressInfo]);

    return (
        <div className="wallet">
            <SEO title="Wallet" description="Cryptocurrency wallet overview" path="/wallet" />

            <LandingSection className="text-wrapper" height="40vh" displayMenuButton>
                <h1>Wallet</h1>
            </LandingSection>

            <div className="content">
                <Grid container justify="center">
                    <Grid item xs={12} sm={10} md={8} lg={6} xl={5}>
                        <Grid container>
                            <Grid item xs={12} sm={5} md={4}>
                                <Addresses
                                    addressInfo={addressInfo}
                                    selectedAddress={selectedAddress}
                                    setSelectedAddress={setSelectedAddress}
                                />
                            </Grid>
                            <Grid item xs={12} sm={7} md={8}>
                                <AddressInfo addressInfo={addressInfo} selectedAddress={selectedAddress} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Wallet;
