import React from "react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

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
