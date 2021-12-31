import React from 'react';
import {TextField, Grid} from '@material-ui/core';
import { useFormContext, Controller} from 'react-hook-form';

export default function FormInput({name, label, required}) {
    const {control} =useFormContext();
    return (
        // <div>
            <Grid item xs={12} sm={6}>
                <Controller
        control={control}
        name={name}
        render={({ field }) => <TextField fullWidth label={label} required />}
      />
            </Grid>
        // {/* </div> */}
    );
}
