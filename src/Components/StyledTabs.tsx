import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Tabs from "@mui/material/Tabs/index";

const useStyles = makeStyles(theme => ({
    indicator: {
        display: "flex",
        justifyContent: "center",
        backgroundColor: "transparent",
        color: "orange",
        ".MuiTabs-indicatorSpan": {
            maxWidth: 40,
            width: "100%",
            backgroundColor: "#635ee7"
        }
    }
}));

const StyledTabs = props => {
    const classes = useStyles();

    return (
        <Tabs
            variant="scrollable"
            scrollButtons="auto"
            className={classes.indicator}
            TabIndicatorProps={{ children: <div /> }}
            {...props}
        />
    );
};

export default StyledTabs;
