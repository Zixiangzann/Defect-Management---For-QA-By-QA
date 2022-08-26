//comp
import AddUser from './addUser';
import ManageUser from './manageUser';

//lib
import { useState } from 'react';

//mui
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';



const AdminUsersManagement = () => {

const [activeTab, setActiveTab] = useState('User Management')

return (

    <Box sx={{ mt: '4rem', width: '100%' }}>
        <nav style={{ backgroundColor: 'aliceblue' }}>
            <List sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => setActiveTab('User Management')}>
                        <ListItemText
                            sx={{
                                textAlign: 'center',
                                color: (activeTab === 'User Management' ? 'blue' : 'black')
                            }}

                            primary="User Management"
                        />
                    </ListItemButton>
                </ListItem>
                
          
                <Divider 
                flexItem 
                orientation="vertical" 
                sx={{ borderRightWidth: 2 ,borderColor:'black'}}/>
                
                
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => setActiveTab('Add User')}>
                        <ListItemText
                            sx={{
                                textAlign: 'center',
                                color: (activeTab === 'Add User' ? 'blue' : 'black')
                            }}
                            primary="Add User"
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </nav>

        <Box>
            {
                (() => {
                    if (activeTab==='User Management')
                        return <ManageUser/>
                    if (activeTab==='Add User')
                        return <AddUser/>
                })()
            }
        </Box>

    </Box>
)

}

export default AdminUsersManagement;