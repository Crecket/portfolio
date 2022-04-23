import React from "react";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    root: {
        color: "white",
        textAlign: "center",
        width: "100%",
        display: "block",
        margin: "16px 0px"
    }
}));

export default ({ style = {}, ...props }) => {
    const classes = useStyles();

    return (
        <noscript className={classes.root} {...props}>
            You need to enable JavaScript to fully view this website.
        </noscript>
    );
};
