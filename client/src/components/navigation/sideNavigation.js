//lib
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//comp
import { signOut } from '../../store/actions/users';
import { successGlobal } from '../../store/reducers/notifications'


import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DehazeIcon from '@mui/icons-material/Dehaze';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BugReportIcon from '@mui/icons-material/BugReport';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import FilterVintageOutlinedIcon from '@mui/icons-material/FilterVintageOutlined';
import PieChartIcon from '@mui/icons-material/PieChart';
import HiveIcon from '@mui/icons-material/Hive';
import { Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';




const SideDrawer = ({ users }) => {
    // const users = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const [state, setState] = useState(false)
    return (
        <>
            <DehazeIcon className='drawer_btn' onClick={() => setState(true)} />
            <Drawer 
            anchor={"right"} 
            open={state} 
            onClose={() => setState(false)}
            sx={{'& .MuiPaper-root':{backgroundColor:'#d3eaf2'}}}
            >
                <Box sx={{ width: 300, zIndex: '999999'}}>
                        
                    <List 
                    sx={{'& .MuiButtonBase-root':{backgroundColor:'#d7e8ee'},'& .MuiButtonBase-root:hover':{backgroundColor: '#b0d8e5'}}}>
                    
                        {/* still deciding if there should be any homepage for user that not logged in. Likely not  */}
                        
                        {users.auth ?
                         <>
                         <Typography variant='h6' sx={{ textAlign: 'center', m: '1rem',color:'#2710d7',fontWeight:'500'}}>Home <HomeIcon sx={{color:'black'}}/></Typography>
                         <Divider />
                         <ListItem
                                key="sideNavigation-Home"
                                button
                                component={RouterLink}
                                to="/"
                                onClick={() => setState(false)}
                            >
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItem>
                            </>
                            :
                            null
                        }

                        {!users.auth ?
                        
                            <ListItem
                                key="sideNavigation-SignIn"
                                button
                                component={RouterLink}
                                to="/auth"
                                onClick={() => setState(false)}
                            >
                                <ListItemIcon>
                                    <VpnKeyIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sign in" />
                            </ListItem>
                            :

                            <ListItem
                                key="sideNavigation-SignOut"
                                button
                                component={RouterLink}
                                to="/"
                                onClick={() => {
                                    dispatch(signOut());
                                    setState(false)
                                }}
                            >
                                <ListItemIcon>
                                    <VpnKeyIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sign out" />
                            </ListItem>
                        }
                        {users.auth ?
                            <>
                           
                                <Divider />
                                <Typography variant='h6' sx={{textAlign:'center',m:'1rem',color:'#2710d7'}} >Defect <BugReportIcon sx={{color:'firebrick'}} /></Typography>
                                <Divider />
                                <ListItem
                                    key="sideNavigation-Defect-List"
                                    button
                                    component={RouterLink}
                                    to="/defect"
                                    onClick={() => setState(false)}
                                >
                                    <ListItemIcon>
                                        <BugReportIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Defect List" />
                                </ListItem>
                                <ListItem
                                    key="sideNavigation-Defect-CreateNew"
                                    button
                                    component={RouterLink}
                                    to="/defect/create"
                                    onClick={() => setState(false)}
                                >
                                    <ListItemIcon>
                                        <AddIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Create New Defect" />
                                </ListItem>

                                {/* not ready */}
                                {/* <ListItem
                                key="sideNavigation-Projects"
                                button
                                component={RouterLink}
                                to="/projects"
                                onClick={() => setState(false)}
                            >
                                <ListItemIcon>
                                    <FilterVintageOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Projects" />
                            </ListItem> */}

                                {/* not ready */}
                                {/* <ListItem
                                key="sideNavigation-Dashboards"
                                button
                                component={RouterLink}
                                to="/dashboard"
                                onClick={() => setState(false)}
                            >
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboards" />
                            </ListItem> */}

                                <ListItem
                                    key="sideNavigation-Reports"
                                    button
                                    component={RouterLink}
                                    to="/defect/report"
                                    onClick={() => setState(false)}
                                >
                                    <ListItemIcon>
                                        <PieChartIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Generate reports" />
                                </ListItem>

                                <Divider />

                                {users.data.role === 'admin' || users.data.role === 'owner' ?
                                <Box>
                                <Typography variant='h6' sx={{textAlign:'center',m:'1rem',color:'#2710d7'}} >Management <ManageAccountsOutlinedIcon sx={{color:'purple'}} /></Typography>
                                <Divider />
                                    <ListItem
                                        key="sideNavigation-UserManagement"
                                        button
                                        component={RouterLink}
                                        to="/management/users"
                                        onClick={() => setState(false)}
                                    >
                                        <ListItemIcon>
                                            <ManageAccountsOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="User Management" />
                                    </ListItem>
                                    </Box>
                                    : null}

                                {users.data.role === 'admin' || users.data.role === 'owner' ?
                                 <Box>
                                    <ListItem
                                        key="sideNavigation-ProjectManagement"
                                        button
                                        component={RouterLink}
                                        to="/management/projects"
                                        onClick={() => setState(false)}
                                    >
                                        <ListItemIcon>
                                            <HiveIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Project Management" />
                                    </ListItem>
                                    </Box>
                                    : null}


                            </>
                            : null}
                    </List>
                </Box>
            </Drawer>
        </>
    )
}

export default SideDrawer