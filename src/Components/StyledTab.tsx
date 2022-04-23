import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Tab from "@mui/material/Tab/index";

const useStyles = makeStyles(theme => ({
    root: {
        textTransform: "none",
        color: "#ffffff"
    }
}));

const StyledTab = props => {
    const classes = useStyles();
    return <Tab className={classes.root} disableRipple {...props} />;
};

export default StyledTab;
