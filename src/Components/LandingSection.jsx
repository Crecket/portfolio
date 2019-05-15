import React from "react";
import Link from "react-router-dom/Link";
// import useWindowSize from "react-use/lib/useWindowSize";
import IconButton from "@material-ui/core/IconButton";
// import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
// import List from "@material-ui/core/List";
// import Divider from "@material-ui/core/Divider";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";

// import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";

import "./LandingSection.scss";

// const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const LandingSection = ({
    children,
    className = "",
    height = "100vh",
    displayMenuButton = false
}) => {
    // const { width } = useWindowSize();
    // const [menuOpen, setMenuOpen] = React.useState(false);
    // const toggleOpen = event => {
    //     if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
    //         return;
    //     }
    //     setMenuOpen(!menuOpen);
    // };
    // const fullList = (
    //     <div className="sidebar-list-wrapper" role="presentation" onClick={toggleOpen} onKeyDown={toggleOpen}>
    //         <List>
    //             <ListItem button>
    //                 <ListItemIcon>
    //                     <HomeIcon />
    //                 </ListItemIcon>
    //                 <ListItemText primary="Home" />
    //             </ListItem>
    //         </List>
    //         <Divider />
    //         <List>
    //             <ListItem button>
    //                 <ListItemIcon>
    //                     <MenuIcon />
    //                 </ListItemIcon>
    //                 <ListItemText primary="Projects" />
    //             </ListItem>
    //             <ListItem button>
    //                 <ListItemIcon>
    //                     <MenuIcon />
    //                 </ListItemIcon>
    //                 <ListItemText primary="bunq" />
    //             </ListItem>
    //         </List>
    //     </div>
    // );

    return (
        <>
            {/*<SwipeableDrawer*/}
            {/*    open={menuOpen}*/}
            {/*    disableBackdropTransition={!iOS}*/}
            {/*    disableDiscovery={iOS}*/}
            {/*    onClose={toggleOpen}*/}
            {/*    onOpen={toggleOpen}*/}
            {/*>*/}
            {/*    {fullList}*/}
            {/*</SwipeableDrawer>*/}

            <div className="landing standard-background" style={{ height: height }}>
                {displayMenuButton && (
                    <IconButton className="menu-button" component={Link} to="/">
                        <HomeIcon />
                    </IconButton>
                )}

                <div className={`content fadeIn ${className}`}>{children}</div>
            </div>
        </>
    );
};

export default LandingSection;
