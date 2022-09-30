//lib
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { addProject, getAllUsersForAssign } from "../../../store/actions/projects";

//comp
import { Loader } from "../../../utils/tools";

//mui
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select'
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import GridViewIcon from '@mui/icons-material/GridView';
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import FormHelperText from '@mui/material/FormHelperText';
import { Divider } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';




const AddProject = () => {

    const dispatch = useDispatch()
    const availableForAssign = useSelector(state => state.projects.assignee.availableForAssign)
//loading show loader
    const projectLoading = useSelector(state => state.projects.loading)

    const [projectName, setProjectName] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [assignee, setAssignee] = useState([])

    //components
    const [components, setComponents] = useState([])
    const [componentField, setComponentField] = useState('')
    const [componentAddError, setComponentAddError] = useState(false)
    const [componentErrorMessage, setComponentErrorMessage] = useState('')


    const handleProjectName = (event) => {
        setProjectName(event.target.value)
    }

    const handleProjectDescription = (event) => {
        setProjectDescription(event.target.value)
    }

    const handleProjectComponentField = (event) => {
        setComponentField(event.target.value)
    }

    const handleAddComponent = () => {

        if (componentField.trim() === "") {
            setComponentErrorMessage("Component name cannot be empty")
            setComponentAddError(true)
        } else if (components.includes(componentField)) {
            setComponentErrorMessage("Component cannot have same name")
            setComponentAddError(true)
        } else {
            components.push(componentField)
            setComponentField('')
            setComponentErrorMessage('')
            setComponentAddError(false)
        }
    }

    const handleRemoveComponent = (component) => {
        const toBeRemoved = component
        const removed = components.filter((e) => !e.includes(toBeRemoved))
        setComponents([...removed])

    }

    const handleTrimOnBlur = (event) => {
        setProjectName(projectName.trim())
        setComponentField(componentField.trim())

    }

    const handleAssignee = async (event) => {
        const {
            target: { value },
        } = event;
        setAssignee(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        )
    };

    useEffect(() => {
        dispatch(getAllUsersForAssign())
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();

        //only want to store the email
        const assigneeEmail = []
        assignee.map((a) => {
            assigneeEmail.push(a.email)
        })

        dispatch(addProject({
            title: projectName,
            description: projectDescription,
            assignee: assigneeEmail,
            components: components
        }))
            .unwrap()
            .then(() => {
                setProjectName('')
                setProjectDescription('')
                setAssignee([])
                setComponents([])
                setComponentErrorMessage('')
                setComponentAddError('')
            })
    }


    return (
        <Box className="addProjectContainer" sx={{ display: 'flex' }}>
            
            {projectLoading ?
                <Loader
                    loading={projectLoading} />
                :
                null
            }

            <form style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} onSubmit={handleSubmit}>

                <Typography variant='h6' mb={3} flexBasis='100%' color='#07078e'>Enter project details </Typography>
                {/* <Typography variant='h6' sx={{ m: 1 }}>Project Title: </Typography> */}

                <FormControl
                    id='addprojectNameForm'
                    sx={{ m: 1, mb: 2, flexBasis: '25%' }}
                >
                    <InputLabel htmlFor='projectName'
                        sx={{ color: 'black' }}
                    >Project Name</InputLabel>
                    <OutlinedInput
                        required
                        name="projectName"
                        id="projectName"
                        text="text"
                        value={projectName}
                        label="Project Title"
                        onChange={handleProjectName}
                        onBlur={handleTrimOnBlur}
                        inputProps={{ maxLength: 20 }}
                    />
                    <FormHelperText sx={{ textAlign: 'end' }}>Max Length: 20</FormHelperText>
                </FormControl>


                <TextField
                    id="projectDescription"
                    label={<Typography color='black'>Project Description</Typography>}
                    multiline
                    minRows={4}
                    sx={{ flexBasis: '100%', m: 1 }}
                    value={projectDescription}
                    onChange={handleProjectDescription}
                />

                <Box flexBasis={'100%'} borderBottom={'1px solid grey'} m={6}></Box>
                <Typography variant='h6' mb={2} flexBasis='100%' color='#07078e'>Assign user to project</Typography>

                <List className='card' sx={{ m: 2, flexBasis: '100%', borderColor: '#1976d2' }}>
                    <Typography ml={2} fontWeight={'600'} color={'#1976d2'}>Added Assignee</Typography>


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
                            {assignee.map((user, index) => (
                                <Chip
                                    avatar={<Avatar alt={user.username} src={user.photoURL} />}
                                    key={`${user.username + index}`}
                                    item={user.username}
                                    label={user.username}
                                    className='chip'
                                    color="primary"
                                    variant='filled'
                                    sx={{ m: 1 }}
                                />
                            ))}
                        </Box>

                    </ListItem>
                </List>

                <FormControl
                    id="availableForAssign"
                    sx={{flexBasis:'40%', m: '2rem', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#0288d1' } }}
                    
                >
                    <InputLabel className='availableForAssignLabel' sx={{ color: '#0288d1' }}>{assignee && assignee.length <= 0 ? "Select User" : "Selected User"} </InputLabel>
                    <Select
                        multiple
                        name='assignee'
                        label={assignee && assignee.length <= 0 ? "Select User" : "Selected User"}
                        value={assignee}

                        sx={{
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: '#05a5fc'
                            }, "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: '#0288d1'
                            }
                        }}
                        onChange={
                            (e) => {
                                handleAssignee(e)
                            }
                        }
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip
                                        // avatar={<Avatar alt={value.username} src={value.photoURL} />}
                                        key={value.email}
                                        label={value.username}
                                        color="primary"
                                        variant='contained'
                                        sx={{ ml: 0 }} />
                                ))}
                            </Box>
                        )}
                    >
                        {availableForAssign ? availableForAssign.map((item) => (

                            <MenuItem
                                key={item.email}
                                value={item}
                            >
                                <Checkbox
                                    checked={assignee.indexOf(item) > -1}
                                    icon={<AddCircleIcon sx={{ display: 'none' }} />}
                                    checkedIcon={<AddCircleIcon sx={{ color: 'green' }} />}

                                />

                                <Avatar
                                    alt={item.email}
                                    src={item.photoURL}
                                    sx={{ marginRight: '1rem', width: 65, height: 65 }}></Avatar>

                                <Box>
                                    <Typography
                                        sx={{ maxWidth: '15rem', overflow: 'auto', fontWeight: '600' }}
                                    >{item.email}</Typography>
                                    <Typography
                                        sx={{ maxWidth: '15rem', overflow: 'auto', fontWeight: '300' }}
                                    >@{item.username}</Typography>
                                </Box>

                            </MenuItem>

                        )
                        ) : null}
                    </Select>
                </FormControl>

                <Box flexBasis={'100%'} borderBottom={'1px solid grey'} m={6}></Box>

                <Typography variant='h6' mb={2} flexBasis='100%' color='#07078e'>Add components to project</Typography>


                <List className='card' sx={{ m: 2, flexBasis: '100%', borderColor: '#9f2f9f' }}>
                    <Typography ml={2} fontWeight={'600'} color={'#9f2f9f'}>Added Components</Typography>


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
                            {components.map((component, index) => (
                                <Chip
                                    key={`${component + index}`}
                                    item={component}
                                    label={component}
                                    color="secondary"
                                    className='chip'
                                    variant='filled'
                                    deleteIcon={
                                        <Tooltip title="remove">
                                            <RemoveCircleOutlineIcon />
                                        </Tooltip>
                                    }
                                    onDelete={() => handleRemoveComponent(component)}
                                    sx={{ m: 1 }}
                                />
                            ))}
                        </Box>


                    </ListItem>
                </List>

                <FormControl
                    id='addProjectComponentsForm'
                    sx={{ m: 2, flexBasis: '40%' }}
                    color="secondary"

                >
                    <InputLabel htmlFor='projectComponents'
                        sx={{ color: '#9a239a', '&. MuiInputBase-input': { borderColor: '#9a239a' } }}
                    >Add Components</InputLabel>
                    <OutlinedInput
                        name="projectComponents"
                        id="projectComponents"
                        text="text"
                        value={componentField}
                        label="Project Components"
                        onChange={handleProjectComponentField}
                        onBlur={handleTrimOnBlur}
                        error={componentAddError}
                        inputProps={{ maxLength: 20 }}
                        color="secondary"
                        sx={{
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: '#df35fc'
                            }, "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: '#9c27b0'
                            }
                        }}
                        endAdornment={
                            <Button
                                id="addComponentsBtn"
                                variant="outlined"
                                color="secondary"
                                startIcon={<AddIcon sx={{ color: 'blueviolet' }} />}
                                onClick={handleAddComponent}
                            >
                                Add
                            </Button>
                        }
                    />
                    <FormHelperText sx={{ textAlign: 'end' }}>Max Length: 20</FormHelperText>
                    <FormHelperText id="componentErrorMessage" error>{componentErrorMessage}</FormHelperText>
                </FormControl>


                <Box sx={{ flexBasis: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        id="addProject"
                        variant='contained'
                        type='submit'
                        sx={{ mt: 7, flexBasis: '25%' }}
                    >
                        Add Project
                    </Button>
                </Box>




            </form>
        </Box>
    )
}

export default AddProject