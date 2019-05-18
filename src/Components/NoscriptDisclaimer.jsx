import React from "react";

const inlineStyle = { color: "white", textAlign: "center", width: "100%", display: "block", margin: "16px 0px" };

export default ({ style = {}, ...props }) => (
    <noscript style={{ ...inlineStyle, ...style }} {...props}>
        You need to enable JavaScript to run this app.
    </noscript>
);
