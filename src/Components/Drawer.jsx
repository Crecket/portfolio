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

const LinkWrapper = ({ onClose }) => ({ to, icon, primary, secondary = "", ...props }) => {
    return (
        <ListItem button component={Link} to={to} onClick={onClose} {...props}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={primary} />
        </ListItem>
    );
};

const Drawer = () => {
    const { open, toggleOpen } = React.useContext(DrawerContext);

    const LinkWrapperComponent = LinkWrapper({ onClose: toggleOpen });

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
                    <LinkWrapperComponent to="/" primary="Home" icon={<HomeIcon />} />
                </List>
                <Divider />
                <List className="list">
                    <LinkWrapperComponent to="/projects" primary="Projects" icon={<CellphoneLinkSvg />} />
                    <LinkWrapperComponent to="/contact" primary="Contact" icon={<AccountBadge />} />
                </List>
                <Divider />
                <List className="list">
                    <LinkWrapperComponent to="/bunq" primary="bunq charts" icon={<ChartIcon />} />
                </List>
            </div>
        </SwipeableDrawer>
    );
};

export default Drawer;
