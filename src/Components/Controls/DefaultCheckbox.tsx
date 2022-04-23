import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default ({ label, checked, onChange, SwitchProps = {}, ...props }) => {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={e => onChange(!checked)}
                    value="checked"
                    color="primary"
                    {...SwitchProps}
                />
            }
            label={label}
            {...props}
        />
    );
};
