import React from "react";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

export default ({ label, checked, onChange, ...props }) => {
    return (
        <FormControlLabel
            control={<Switch checked={checked} onChange={e => onChange(!checked)} value="checked" color="primary" />}
            label={label}
            className="default-switch"
            {...props}
        />
    );
};
