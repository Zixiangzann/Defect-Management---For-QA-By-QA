import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
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
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const AdminLayout = (props) => {
    return (
        <Container className={`adminContainer`}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                
                <Drawer
                    sx={{
                        width: '150px',
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: '150px',
                            boxSizing: 'border-box',
                            top: '65px'
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >

                    <List>
                        <ListItem
                            button
                            component={RouterLink}
                            to="/usermanagement/profile">
                            <ListItemText primary="Profile" />
                        </ListItem>

                        <ListItem
                            button
                            component={RouterLink}
                            to="/usermanagement/users">
                            <ListItemText primary="Users" />
                        </ListItem>

                        <ListItem
                            button
                            component={RouterLink}
                            to="/usermanagement/Defects">
                            <ListItemText primary="Defects" />
                        </ListItem>

                        <ListItem
                            button
                            component={RouterLink}
                            to="/usermanagement/Projects">
                            <ListItemText primary="Projects" />
                        </ListItem>
                    </List>
                </Drawer>
                <Typography>User Management</Typography>


            </Box>
            {props.children}
            <ToastContainer />
        </Container>
    )
}

export default AdminLayout;