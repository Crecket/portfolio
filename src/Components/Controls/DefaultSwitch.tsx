import React from "react";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const DefaultSwitch = ({ label, checked, onChange, ...props }) => {
    return (
        <FormControlLabel
            control={<Switch checked={checked} onChange={() => onChange(!checked)} value="checked" color="primary" />}
            label={label}
            className="default-switch"
            {...props}
        />
    );
};

export default DefaultSwitch;
