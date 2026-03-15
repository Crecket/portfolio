import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const DefaultCheckbox = ({ label, checked, onChange, SwitchProps = {}, ...props }) => {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={() => onChange(!checked)}
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

export default DefaultCheckbox;
