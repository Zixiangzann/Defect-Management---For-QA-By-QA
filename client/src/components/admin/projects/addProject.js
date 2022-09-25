//lib
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { addProject, getAllUsersForAssign } from "../../../store/actions/projects";

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
        assignee.map((a)=>{
            assigneeEmail.push(a.email)
        })

        dispatch(addProject({
            title: projectName,
            description: projectDescription,
            assignee: assigneeEmail,
            components: components
        }))
        .unwrap()
        .then(()=>{
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
            <form style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} onSubmit={handleSubmit}>
                
                <Typography variant='h6' mb={3} flexBasis='100%' color='#07078e'>Project Details: </Typography>
                {/* <Typography variant='h6' sx={{ m: 1 }}>Project Title: </Typography> */}

                <FormControl
                    id='addprojectNameForm'
                    sx={{ m: 1 ,mb:2 ,flexBasis:'25%'}}
                    >
                    <InputLabel htmlFor='projectName'
                    sx={{color:'#9a239a'}}
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
                        inputProps={{maxLength:20}}
                    />
                     <FormHelperText sx={{textAlign:'end'}}>Max Length: 20</FormHelperText>
                </FormControl>
                

                <TextField
                    id="projectDescription"
                    label={<Typography color='#9a239a'>Project Description</Typography>}
                    multiline
                    minRows={4}
                    sx={{ flexBasis: '100%', m: 1 }}
                    value={projectDescription}
                    onChange={handleProjectDescription}
                />

                <Box flexBasis={'100%'} borderBottom={'1px solid grey'} m={6}></Box>
                <Typography variant='h6' mb={2} flexBasis='100%' color='#07078e'>Assign Project: </Typography>

                <FormControl
                    id="availableForAssign"
                    sx={{ m: '2rem' }}
                    fullWidth
                >
                    <InputLabel className='availableForAssignLabel' sx={{color:'#9a239a'}}>Assign to Project: </InputLabel>
                    <Select
                        multiple
                        name='assignee'
                        label='Assign to Project'
                        value={assignee}
                        onChange={
                            (e) => {
                                handleAssignee(e)
                            }
                        }
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip
                                        avatar={<Avatar alt={value.username} src={value.photoURL} />}
                                        key={value.username}
                                        label={value.username}
                                        color="primary"
                                        variant='outlined'
                                        sx={{ ml: 2 }} />
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

                <Typography variant='h6' mb={2} flexBasis='100%' color='#07078e'>Project Components</Typography>


{/* need to add remove components from array */}
                <List className='card' sx={{ m: 2, flexBasis: '100%' }}>
                    <Typography ml={2} fontWeight={'600'} color={'#9f2f9f'}>Added Components</Typography>


                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <GridViewIcon />
                            </Avatar>

                        </ListItemAvatar>
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
                                onDelete={()=>handleRemoveComponent(component)}
                                sx={{ ml: 2 }}
                            />
                        ))}


                    </ListItem>
                </List>

                <FormControl
                    id='addProjectComponentsForm'
                    sx={{ m: 2, flexBasis: '40%' }}

                >
                    <InputLabel htmlFor='projectComponents'
                    sx={{color:'#9a239a'}}
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
                        inputProps={{maxLength:20}}
                        endAdornment={
                            <Button
                                id="addComponentsBtn"
                                variant="outlined"
                                color="secondary"
                                startIcon={<AddIcon sx={{color:'blueviolet'}}/>}
                                onClick={handleAddComponent}
                            >
                                Add
                            </Button>
                        }
                    />
                    <FormHelperText sx={{textAlign:'end'}}>Max Length: 20</FormHelperText>
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