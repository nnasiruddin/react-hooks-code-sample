import React, { useContext } from 'react';
import AppContext from '../../context/App';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import get from 'lodash.get';

const Header = () => {
    const { userInfo, actions } = useContext(AppContext);
    const name = get(userInfo, 'name', '');
    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography variant="h4">Enterprise Data Platform</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <div className="username">
                            {
                                name
                            }
                        </div>
                        <Button color="primary" onClick={ () => actions.handleLogout()}> Logout </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default Header;
