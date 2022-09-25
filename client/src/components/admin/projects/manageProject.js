//lib
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { htmlDecode } from '../../../utils/tools';
import Moment from 'react-moment';

import { getProjectByTitle } from '../../../store/actions/defects';
import { getAllUsersEmail } from '../../../store/actions/admin';
import { getAllProjects } from '../../../store/actions/admin';
import ModalComponent from '../../../utils/modal/modal';

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
import OutlinedInput from '@mui/material/OutlinedInput';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InputAdornment from '@mui/material/InputAdornment';

const ManageProject = () => {

    //redux
    const dispatch = useDispatch()
    const projects = useSelector(state => state.projects)
    const users = useSelector(state => state.users)

    //Modal state
    const [openModal, setOpenModal] = useState(false);
    const [modalDescription, setModalDescription] = useState('');
    const [modalInput, setModalInput] = useState('');

    //state
    //project details
    const [projectTitle, setProjectTitle] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [projectComponents, setProjectComponents] = useState([])
    const [projectAssignee, setProjectAssignee] = useState([])

    //selected project
    const [selectProject, setSelectProject] = useState('')

    //editing state
    const [editingField, setEditingField] = useState('')
    const [confirmChanges, setConfirmChanges] = useState('')

    const defaultEditState = {
        editProjectTitle: false
    }
    const [editEnabled, setEditEnabled] = useState({
        defaultEditState
    })

    const handleModalInput = (event) => {
        setModalInput(event.target.value);
    }

    //Edit handle
    const handleEditState = (fieldName, enabled) => {
        //only set 1 to edit state at a time
        setEditEnabled({ [fieldName]: enabled })
    }

    const handleModalConfirm = async () => {

        // const adminPassword = modalInput
        // const userEmail = searchUser

        switch (editingField) {
            case "confirmProfilePicture":
                // dispatch(updateProfilePicture({
                //     adminPassword,
                //     userEmail,
                //     uploadProfilePicture: uploadProfilePicture
                // }))
                //     .unwrap()
                //     .then(() => {
                //         setEditEnabled({ ...editEnabled, "editProfilePicture": false })
                //         setUploadProfilePicture("")
                //     })
                //     .then(() => {
                //         dispatch(getUserByEmail({ email: searchUser }))
                //     })
                // break;
            default:
                break;
        }
        setModalInput('')
    }

    const handleEditConfirm = () => {

        // setOpenModal(true)
        switch (confirmChanges) {
            case "confirmProjectTitle":
                setModalDescription(`You are about to change Project Title \n\n From: "${projects.selectedProjectDetails.title}" 
                To: "+${projectTitle}"`)
                setEditingField(confirmChanges);
                break;
            default:
                break;
        }

        setConfirmChanges('')
    }


    const handleProjectTitle = (event) => {
        setProjectTitle(event.target.value)
    }


    const handleSelectProject = (event) => {
        setSelectProject(event.target.value)
        console.log(selectProject)

    }

    //trimming when click confirm
    useEffect(() => {
        switch (confirmChanges) {
            case "confirmProjectTitle":
                setProjectTitle(projectTitle.trim())
                setOpenModal(true)
                break;
            default:
                break;
        }
    }, [confirmChanges])


    useEffect(() => {
        if (selectProject !== "") {
            dispatch(getProjectByTitle({
                projectTitle: selectProject
            }))
        }
    }, [selectProject])

    useEffect(()=>{
        setProjectTitle(projects.selectedProjectDetails.title)

    },[projects.selectedProjectDetails])

    useEffect(() => {
        dispatch(getAllUsersEmail({}))
        dispatch(getAllProjects({}))
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <Box className="manageProjectContainer" mt={5} sx={{ overflow: 'auto', maxHeight: '650px' }} >

            <form style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} onSubmit={handleSubmit}>
                {!selectProject ?
                    <Typography variant='h6' flexBasis={'100%'} mb={3}>Select Project to begin</Typography>
                    :
                    null}


                <FormControl
                    id='project-select'
                    sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor='project-select'
                        sx={{ color: 'mediumblue' }}
                    >{selectProject === "" ? "Select Project" : "Selected Project"}</InputLabel>
                    <Select
                        id="project-select"
                        value={selectProject}
                        label={selectProject === "" ? "Select Project" : "Selected Project"}
                        onChange={handleSelectProject}

                    >
                        {projects.projectList.map((project, index) => (
                            <MenuItem key={`${project}-${index}`} value={project.title}>{project.title}</MenuItem>
                        ))}

                    </Select>
                </FormControl>

                {projectTitle  ?
                    <FormControl
                        id='editProjectTitleForm'
                        sx={{ m: 1, width: '80%' }}>
                        <InputLabel htmlFor='projectTitle'
                            sx={{ color: '#1a1ad2' }}
                        >Project Title</InputLabel>
                        <OutlinedInput
                            required
                            name="projectTitle"
                            id="projectTitle"
                            text="text"
                            value={projectTitle}
                            label="Project Title"
                            onChange={handleProjectTitle}
                            fullWidth
                            disabled={!editEnabled.editProjectTitle}
                            endAdornment={users.data.permission[0].addProject ?
                                <InputAdornment position='end'>
                                    <Tooltip title="Confirm changes">
                                        <span>
                                            <IconButton
                                                aria-label="confirmProjectTitle"
                                                edge="end"
                                                onClick={(e) => {
                                                    setConfirmChanges("confirmProjectTitle")
                                                }}
                                                disabled={editEnabled.editProjectTitle && projects.selectedProjectDetails.title !== projectTitle.trim() ? false : true}
                                                sx={{ color: 'green' }}
                                            >
                                                {<CheckCircleIcon />}
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                    <Tooltip title="Edit field">
                                        <IconButton
                                            name="editProjectTitle"
                                            aria-label="edit-projectTitle"
                                            edge="end"
                                            onClick={(e) => handleEditState("editProjectTitle", true)}
                                            sx={{ color: 'blue' }}
                                        >
                                            {<EditIcon

                                            />}
                                        </IconButton>
                                    </Tooltip>

                                </InputAdornment>
                                :
                                null
                            }
                        />
                    </FormControl>
                    :
                    null
                }

                <Box sx={{ flexBasis: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        id="saveProjectChanges"
                        variant='contained'
                        type='submit'
                        sx={{ mt: 7, flexBasis: '25%' }}
                    >
                        Save changes
                    </Button>
                </Box>

                <ModalComponent
                    open={openModal}
                    setOpenModal={setOpenModal}
                    title="Warning"
                    description={modalDescription}
                    warn={"Enter your password and click on confirm to make changes"}
                    input={true}
                    inputValue={modalInput}
                    inputLabel={"Password"}
                    inputType={"password"}
                    handleModalInput={handleModalInput}
                    handleModalConfirm={handleModalConfirm}
                    button1="Confirm"
                    button2="Cancel"
                    titleColor="darkred"
                >
                </ModalComponent>


            </form>
        </Box>

    )
}

export default ManageProject