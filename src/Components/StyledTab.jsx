import React from "react";
import { withStyles } from "@material-ui/core/index";
import Tab from "@material-ui/core/Tab/index";

const styles = theme => ({
    root: {
        textTransform: "none",
        color: "#ffffff",
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1)
    }
});

const StyledTab = props => <Tab disableRipple {...props} />;

export default withStyles(styles)(StyledTab);
