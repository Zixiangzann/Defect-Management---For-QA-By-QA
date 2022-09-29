//lib
import Moment from 'react-moment';
import { htmlDecode } from '../../../../utils/tools'

//MUI
import { Divider, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import GridViewIcon from '@mui/icons-material/GridView';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';



const ManageUserProject = ({
    admin,
    searchUser,
    userProject,
    removeUserProject,
    handleProjectDelete,
    selectProject,
    handleSelectProject,
    handleProjectAssign
}
) => {

    return (
        <Box width='100%'>


            <Typography className="adminHeader" variant='h5' sx={{ flexBasis: '100%', mt: 5, mb: 5 }}>{userProject.length <= 1 ? "Project " : "Projects "} currently assigned to user</Typography>

            <Typography display={'inline-block'} sx={{ width: '200px', color: '#1a1ad2', fontWeight: '600', ml: 2 }}>Number of: {userProject.length <= 1 ? "project: " : "projects: "}</Typography>
            <Typography display={'inline'}>{userProject.length}</Typography>


            <Box sx={{ mt: 1, mr: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>

                {userProject.length === 0 ?
                    <Typography flexBasis={'100%'} mt={'2rem'}>There is no project assigned to this user</Typography>
                    :
                    <List className='card' sx={{ m: 3, flexBasis: '100%' }}>
                        <Typography ml={2} fontWeight={'600'} color={'#0288d1'}>{userProject.length <= 1 ? "Assigned Project: " : "Assigned Projects: "} </Typography>


                        <ListItem
                            sx={{ flexWrap: 'wrap' }}>
                            <ListItemAvatar
                                className="BoxAvatarLayout"
                            >
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>

                            </ListItemAvatar>

                            {userProject ? userProject.map((title, index) => (
                                <Chip
                                    key={`${title + index}`}
                                    item={title}
                                    label={title}
                                    color="info"
                                    className='chip'
                                    variant='filled'
                                    deleteIcon={
                                        <Tooltip title="remove project">
                                            <RemoveCircleOutlineIcon />
                                        </Tooltip>
                                    }
                                    onDelete={() => {

                                        handleProjectDelete(title)
                                    }}
                                    sx={{ m: 1 }}
                                />
                            ))
                                :
                                null}


                        </ListItem>
                    </List>
                }

            </Box>

            <Divider sx={{ borderBottom: '2px solid black', mt: 5, mb: 5 }}></Divider>
            <Typography className="adminHeader" variant='h5' sx={{ flexBasis: '100%', mb: 5 }}>Assign project to user</Typography>

            <FormControl
                id='project-select'
                sx={{ mt: 1, width: '100%' }}>
                <InputLabel htmlFor='project-select'
                    sx={{ color: 'mediumblue' }}
                >{selectProject === "" ? "Select Project to assign" : "Selected Project"}</InputLabel>
                <Select
                    id="project-select"
                    value={selectProject}
                    label={selectProject === "" ? "Select Project to assign" : "Selected Project"}
                    onChange={handleSelectProject}

                >
                    {admin.projectList.map((project, index) => (
                        <MenuItem key={`${project}-${index}`} value={project.title}>{project.title}</MenuItem>
                    ))}

                </Select>

                {selectProject !== "" && admin.selectedProjectDetails[0] ?
                    <Box flexBasis={'100%'}>

                        <Box className="projectDetailsContainer" display={'flex'} flexWrap={'wrap'}>
                            <Typography sx={{ flexBasis: '100%', mt: 3, mb: 2, ml: 2, fontSize: '1.2rem', fontWeight: '300' }}>Project Details</Typography>
                            <Typography className="projectManagementDetailsSubject" display={'inline'} sx={{ flexBasis: '200px', color: '#1a1ad2', fontWeight: '600', ml: 2 }}>Project Title: </Typography>
                            <Typography className="projectManagementDetailsValue" sx={{ display: 'inline' }}>{admin.selectedProjectDetails[0].title}</Typography>
                            <Box flexBasis={'100%'}></Box>
                            <Typography className="projectManagementDetailsSubject" display={'inline'} sx={{ flexBasis: '200px', color: '#1a1ad2', fontWeight: '600', ml: 2 }}>Project Description: </Typography>
                            <Typography className="projectManagementDetailsValue" sx={{ display: 'inline' }}>{<div style={{ display: 'inline' }} dangerouslySetInnerHTML={{ __html: htmlDecode(admin.selectedProjectDetails[0].description) }}></div>}</Typography>
                            <Box flexBasis={'100%'}></Box>
                            <Typography className="projectManagementDetailsSubject" display={'inline'} sx={{ flexBasis: '200px', color: '#1a1ad2', fontWeight: '600', ml: 2 }}>Project Created Date: </Typography>
                            <Typography className="projectManagementDetailsValue" sx={{ display: 'inline' }}><Moment format="DD/MMM/YYYY HH:MMA">{admin.selectedProjectDetails[0].date}</Moment></Typography>
                        </Box>

                        <List className='card' sx={{ m: 3, flexBasis: '100%' }}>
                            <Typography ml={2} fontWeight={'600'} color={'#9f2f9f'}>Components</Typography>


                            <ListItem
                                sx={{ flexWrap: 'wrap' }}>

                                <ListItemAvatar
                                    className="BoxAvatarLayout"
                                >
                                    <Avatar>
                                        <GridViewIcon />
                                    </Avatar>

                                </ListItemAvatar>
                                <Box sx={{ width: '90%' }}>
                                    {admin.selectedProjectDetails[0].components ? admin.selectedProjectDetails[0].components.map((component, index) => (
                                        <Chip
                                            key={`${component + index}`}
                                            item={component}
                                            label={component}
                                            color="secondary"
                                            className='chip'
                                            variant='filled'
                                            sx={{ m: 1 }}
                                        />
                                    ))
                                        :
                                        null}
                                </Box>


                            </ListItem>
                        </List>

                        <List className='card' sx={{ m: 3, flexBasis: '100%' }}>
                            <Typography ml={2} fontWeight={'600'} color={'#0288d1'}>Assignee</Typography>


                            <ListItem
                                sx={{ flexWrap: 'wrap' }}>
                                <ListItemAvatar
                                    className="BoxAvatarLayout"
                                >
                                    <Avatar>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <Box sx={{ width: '90%' }}>
                                    {admin.selectedProjectDetails[1] ? admin.selectedProjectDetails[1].map((user, index) => (
                                        <Chip
                                            key={`${user.username + index}`}
                                            avatar={<Avatar alt={user.username} src={user.photoURL} />}
                                            item={user.username}
                                            label={user.username}
                                            className='chip'
                                            color="primary"
                                            variant='filled'
                                            sx={{ m: 1 }}
                                        />
                                    ))
                                        :
                                        null}
                                </Box>


                            </ListItem>
                        </List>




                        <Box className="assignProjectBtnContainer" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Tooltip title={admin.selectedProjectDetails[0].assignee.includes(searchUser) ? "User is already assigned" : ""}>
                                <span>
                                <Button
                                    variant='contained'
                                    sx={{ mt: 5 }}
                                    disabled={admin.selectedProjectDetails[0].assignee.includes(searchUser)}
                                    onClick={() => handleProjectAssign()}
                                >Assign user to this project</Button>
                                </span>
                            </Tooltip>
                        </Box>



                    </Box>
                    :
                    null

                }


            </FormControl>

        </Box>

    )
}

export default ManageUserProject