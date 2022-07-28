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


const AdminProjects = () => {



    const [activeTab, setActiveTab] = useState(0)

    return (


        <Box sx={{ mt: '4rem', width: '100%' }}>
            <nav style={{ backgroundColor: 'aliceblue' }}>
                <List sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => setActiveTab(0)}>
                            <ListItemText
                                sx={{
                                    textAlign: 'center',
                                    color: (activeTab === 0 ? 'blue' : 'black')
                                }}

                                primary="Add New Project"
                            />
                        </ListItemButton>
                    </ListItem>
                    <Divider />

                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => setActiveTab(1)}>
                            <ListItemText
                                sx={{
                                    textAlign: 'center',
                                    color: (activeTab === 1 ? 'blue' : 'black')
                                }}
                                primary="Add Components to Project"
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </nav>

            <Box>
                {
                    (() => {
                        if (activeTab===0)
                            return <span>One</span>
                        if (activeTab===1)
                            return <span>Two</span>
                    })()
                }
            </Box>

        </Box>
    )

}

export default AdminProjects;