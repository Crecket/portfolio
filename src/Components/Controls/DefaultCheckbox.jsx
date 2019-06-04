import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

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
