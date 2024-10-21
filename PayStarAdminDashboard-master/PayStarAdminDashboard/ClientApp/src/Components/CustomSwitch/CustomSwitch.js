import React, {useState} from 'react';
import Switch from '@material-ui/core/Switch';
import {FormGroup, FormControlLabel} from "@material-ui/core";

// Takes in Label as props
// Takes in isChecked as props
// Takes in onClick function that returns is checked status of button
const CustomSwitch = (props) => {
    const [checked, setChecked] = useState(props.isChecked)

    const handleChange = (event) => {
        setChecked(event.target.checked)
        props.onClick(!checked)
    }

    return(
        <div>
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Switch
                            checked={checked}
                            onChange={handleChange}
                            name="CustomSwitch"
                            color="primary"
                        />
                    }
                    label={props.Label}
                    />
            </FormGroup>

        </div>
    )
}

export default CustomSwitch;
