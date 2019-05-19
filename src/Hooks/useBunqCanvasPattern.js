import React from "react";
import bunqColors from "../SVGImages/bunq_Colors.svg";

export default (defaultColor = "transparent", target = null) => {
    const [pattern, setPattern] = React.useState(defaultColor);

    React.useEffect(() => {
        const img = new Image();
        img.src = bunqColors;

        img.onload = () => {
            const canvas = target || document.getElementsByTagName("canvas")[0];
            const ctx = canvas.getContext("2d");

            const fillPattern = ctx.createPattern(img, "repeat");

            setPattern(fillPattern);
        };
    }, [target]);

    return pattern;
};
