//comp
import { useState,useEffect } from 'react';

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
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import FilterVintageOutlinedIcon from '@mui/icons-material/FilterVintageOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';



const AdminLayout = (props) => {

    // const [value, setValue] = useState(0);

    // useEffect(() => {
    //     if(window.location.href.includes('users')){
    //         setValue(0);
    //     }

    //     if(window.location.href.includes('projects')){
    //         setValue(1);
    //     }

    //     if(window.location.href.includes('assign')){
    //         setValue(2);
    //     }
        
    // }, [window.location.href]);

    // return (

    //     <Container className={`adminContainer`}>
    //         <Box>
    //             <CssBaseline />

    //             <BottomNavigation
    //                 id='adminBottomNavigation'
    //                 sx={{ position: 'absolute', top: 'auto', bottom: '0', right: '0', left: '0', bgcolor: 'lavender', display: 'flex', justifyContent: 'space-around',zIndex:'1' }}
    //                 showLabels
    //                 value={value}
    //             >
    //                 <BottomNavigationAction
    //                     label="User"
    //                     icon={<PersonAddAltIcon />}
    //                     component={RouterLink}
    //                     to="/usermanagement/users"
    //                 />
    //                 <BottomNavigationAction
    //                     label="Project/Component"
    //                     icon={<FilterVintageOutlinedIcon />}
    //                     component={RouterLink}
    //                     to="/usermanagement/projects"
    //                 />

    //                 <BottomNavigationAction
    //                     label="Assign project"
    //                     icon={<AssignmentIndIcon />}
    //                     component={RouterLink}
    //                     to="/usermanagement/assign"
    //                 />
    //             </BottomNavigation>


    //         </Box>
    //         {props.children}
    //         <ToastContainer />
    //     </Container>
    // )
}

export default AdminLayout;