import React from "react";
import Link from "react-router-dom/Link";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import HomeIcon from "@material-ui/icons/Home";
import ChartIcon from "@material-ui/icons/BarChart";
import AccountBadge from "../SVGImages/AccountBadge";
import CellphoneLinkSvg from "../SVGImages/CellphoneLinkSvg";

import "./Drawer.scss";
import { DrawerContext } from "../App";

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const Drawer = () => {
    const { open, toggleOpen } = React.useContext(DrawerContext);

    return (
        <SwipeableDrawer
            className="drawer"
            open={open}
            onOpen={toggleOpen}
            onClose={toggleOpen}
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
            classes={{
                paper: "purple-gradient"
            }}
        >
            <div role="presentation" className="drawer-content">
                <List className="list">
                    <ListItem button component={Link} to="/">
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                </List>
                <Divider />
                <List className="list">
                    <ListItem button component={Link} to="/projects">
                        <ListItemIcon>
                            <CellphoneLinkSvg />
                        </ListItemIcon>
                        <ListItemText primary="Projects" />
                    </ListItem>
                    <ListItem button component={Link} to="/contact">
                        <ListItemIcon>
                            <AccountBadge />
                        </ListItemIcon>
                        <ListItemText primary="Contact" />
                    </ListItem>
                </List>
                <Divider />
                <List className="list">
                    <ListItem button component={Link} to="/bunq">
                        <ListItemIcon>
                            <ChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="bunq charts" />
                    </ListItem>
                </List>
            </div>
        </SwipeableDrawer>
    );
};

export default Drawer;
