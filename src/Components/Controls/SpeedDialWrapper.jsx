import React, { useState } from "react";
import classnames from "classnames";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";

import SaveIcon from "@material-ui/icons/Save";
import ShareIcon from "@material-ui/icons/Share";

import "./SpeedDialWrapper.scss";

const SpeedDialWrapper = ({ shareValue, onSave, onSaveLabel, className = "", ...props }) => {
    const [speedDialOpen, setSpeedDialOpen] = useState(false);

    const toggleSpeedDial = () => setSpeedDialOpen(!speedDialOpen);
    const closeSpeedDial = () => setSpeedDialOpen(false);
    const openSpeedDial = () => setSpeedDialOpen(true);

    const canShare = shareValue && typeof navigator.canShare !== "undefined" && navigator.canShare();
    const onShare = () => {
        if (canShare) {
            navigator
                .share(shareValue)
                .then(() => console.log("Successful share"))
                .catch(error => console.log("Error sharing", error));
        }

        closeSpeedDial();
    };

    const onSaveWrap = event => {
        closeSpeedDial();
        onSave(event);
    };

    return (
        <SpeedDial
            open={speedDialOpen}
            direction="up"
            className={classnames("speed-dial", className)}
            classes={{
                fab: "purple-gradient"
            }}
            icon={<SpeedDialIcon />}
            onBlur={closeSpeedDial}
            onClick={toggleSpeedDial}
            onClose={closeSpeedDial}
            onFocus={openSpeedDial}
            onMouseEnter={openSpeedDial}
            onMouseLeave={closeSpeedDial}
            {...props}
        >
            {canShare && (
                <SpeedDialAction
                    className="grey-gradient"
                    tooltipTitle="Share"
                    icon={<ShareIcon />}
                    onClick={onShare}
                />
            )}
            {onSave && (
                <SpeedDialAction
                    className="grey-gradient"
                    tooltipTitle={onSaveLabel || "Save"}
                    icon={<SaveIcon />}
                    onClick={onSaveWrap}
                />
            )}
        </SpeedDial>
    );
};

export default SpeedDialWrapper;
