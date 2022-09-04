//lib
import Moment from 'react-moment';

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

const ManageUserProject = ({
    admin,
    userProject,
    handleProjectDelete,
    selectProject,
    handleSelectProject
}
) => {
    return (
        <Box flexBasis='100%'>

            <Typography variant='h5' sx={{ flexBasis: '100%',mt:5}}>Project current assigned to user</Typography>

            <Box sx={{ mt: 3, mr: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>

                {userProject.map((item, index) => (
                    <Chip
                        label={item}
                        id={`${item}-${index}`}
                        key={`${item}-${index}`}
                        variant="outlined"
                        color="info"
                        deleteIcon={
                            <Tooltip title="remove project">
                                <RemoveCircleOutlineIcon />
                            </Tooltip>
                        }
                        onDelete={handleProjectDelete}
                        sx={{ mr: 3, mt: 1 }}
                    />
                ))}

            </Box>

            <Divider sx={{ borderBottom: '2px solid black', mt: 5, mb: 5 }}></Divider>
            <Typography variant='h5' sx={{ flexBasis: '100%',mb:5}}>Assign project to user</Typography>

            <FormControl
                id='project-select'
                sx={{ mt: 1, width: '100%' }}>
                <InputLabel htmlFor='project-select'
                >Select Project to assign</InputLabel>
                <Select
                    id="project-select"
                    value={selectProject}
                    label="project-select"
                    onChange={handleSelectProject}
                >
                    {admin.projectList.map((project,index) => (
                        <MenuItem key={`${project}-${index}`} value={project.title}>{project.title}</MenuItem>
                    ))}

                </Select>

                {selectProject !== "" ?
                <Box flexBasis={'100%'}>
                <Typography sx={{ flexBasis: '100%', mt: 3, mb: 2, fontSize: '1.2rem', fontWeight: '300' }}>Project Details</Typography> 
                <Typography>Project Title: {admin.selectedProjectDetails.title}</Typography>
                <Typography>Project Description: {admin.selectedProjectDetails.description}</Typography>
                <Typography>Project Created Date: <Moment format="DD/MMM/YYYY HH:MMA">{admin.selectedProjectDetails.date}</Moment></Typography>

                <Typography mt={1}>Current assignee: </Typography>

                <Box sx={{ mt: 1, mr: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {admin.selectedProjectDetails.assignee ? admin.selectedProjectDetails.assignee.map((item, index) => (
                    <Chip
                        label={item}
                        id={`${item}-${index}`}
                        key={`${item}-${index}`}
                        variant="outlined"
                        color="info"
                        sx={{ mr: 3, mt: 1 }}
                    />
                ))
   :
   null
            }

            </Box>

            <Box sx={{display:'flex',justifyContent:'flex-end'}}>
            <Button 
            variant='contained'
            sx={{mt:5}}
            >Assign project to user</Button>
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