//comp
import { useState } from 'react';

//lib
import { Link as RouterLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';


//css
import "../styles/main.css";

//MUI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';




const AdminLayout = (props) => {

    const [value, setValue] = useState(0);

    return (

        <Container className={`adminContainer`}>
            <Box>
                <CssBaseline />

                <BottomNavigation
                    id='adminBottomNavigation'
                    sx={{position:'absolute',top:'auto',bottom:'0',right:'0',left:'0',bgcolor:'lavender',display:'flex',justifyContent:'space-around'}}
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction 
                    label="Profile" 
                    icon={<RestoreIcon />} 
                    component={RouterLink}
                    to="/usermanagement/profile"
                    />
                    <BottomNavigationAction 
                    label="User" 
                    icon={<FavoriteIcon />}
                    component={RouterLink}
                    to="/usermanagement/users" 
                    />
                    <BottomNavigationAction 
                    label="Project" 
                    icon={<LocationOnIcon />}
                    component={RouterLink}
                    to="/usermanagement/projects" 
                    />
                </BottomNavigation>

            </Box>
            {props.children}
            <ToastContainer />
        </Container>
    )
}

export default AdminLayout;