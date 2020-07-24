import React, { useState, useEffect } from 'react';
import TypeForm from 'react-typeform';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const CustomTypeForm = () => {
    return (
        <TypeForm
            onSubmit={() => {}}
        >
            <Grid container>
                <Grid item xs={12}>
                    <TextField variant="outlined" onChange={() => {}} placeholder="Enter your age"/>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    <TextField variant="outlined" onChange={() => {}} placeholder="Enter your age"/>
                </Grid>
            </Grid>
        </TypeForm>
    )
};

export default CustomTypeForm;
