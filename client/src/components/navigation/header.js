import { useEffect } from 'react';
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { clearNotifications } from '../../store/reducers/notifications'


//css
import "../../styles/main.css";

import SideDrawer from './sideNavigation';
import { showToast } from '../../utils/tools';

//MUI
import AppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { Toolbar } from '@mui/material';


const Header = () => {

    const users = useSelector(state => state.users);
    const notifications = useSelector(state => state.notifications);
    const dispatch = useDispatch();


    useEffect(() => {
        if (notifications.global.error) {
            const message = notifications.global.message ? notifications.global.message : 'Error';
            showToast('ERROR', message);
            dispatch(clearNotifications());
        }

        if (notifications.global.success) {
            const message = notifications.global.message ? notifications.global.message : 'Success';
            showToast('SUCCESS', message);
            dispatch(clearNotifications());
        }
    }, [notifications])

    return (
            <Box>
                <CssBaseline />
                <AppBar
                    className={`header`}
                    position="static"
                    sx={{backgroundColor:'aliceblue',maxHeight:'65px'}}
                >
                    <Toolbar sx={{display:'flex',justifyContent:'space-between'}}>
                    <Typography
                    variant='h6'
                    sx={{color:'black'}}
                    >Defect Management</Typography>
                    <SideDrawer users={users} />
                    </Toolbar>
                </AppBar>
            </Box>
    )
}

export default Header;