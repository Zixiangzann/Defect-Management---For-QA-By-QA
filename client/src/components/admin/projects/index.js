//lib
import { useState } from 'react';

//comp
import AddProject from './addProject';
import ManageProject from './manageProject';

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


const ProjectManagement = () => {



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

                                primary="Project Management"
                            />
                        </ListItemButton>
                    </ListItem>

                    <Divider
                        flexItem
                        orientation="vertical"
                        sx={{ borderRightWidth: 2, borderColor: 'black' }} />

                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => setActiveTab(1)}>
                            <ListItemText
                                sx={{
                                    textAlign: 'center',
                                    color: (activeTab === 1 ? 'blue' : 'black')
                                }}
                                primary="Add Project"
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </nav>

            <Box>
                {
                    (() => {
                        if (activeTab === 0)
                            return(
                                <ManageProject>
                                    
                                </ManageProject>
                            )
                        if (activeTab === 1)
                            return (
                            <AddProject>
                                    
                            </AddProject>
                            )
                    })()
                }
            </Box>

        </Box>
    )

}

export default ProjectManagement;