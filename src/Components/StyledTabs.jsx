import React from "react";
import { withStyles } from "@material-ui/core/index";
import Tabs from "@material-ui/core/Tabs/index";

const styles = theme => ({
    indicator: {
        display: "flex",
        justifyContent: "center",
        backgroundColor: "transparent",
        "& > div": {
            maxWidth: 40,
            width: "100%",
            backgroundColor: "#635ee7"
        }
    }
});

const StyledTabs = props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />;

export default withStyles(styles)(StyledTabs);
