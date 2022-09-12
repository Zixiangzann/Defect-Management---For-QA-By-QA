//lib
import { useState, useEffect, useRef } from 'react'
import { useFormik, FieldArray, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom'

//comp
import { errorHelper, errorHelperSelect, Loader } from '../../utils/tools'
import { validation, formValues } from './validationSchema'
import ModalComponent from '../../utils/modal/modal';
import WYSIWYG from '../../utils/form/wysiwyg';

//MUI
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import AttachmentIcon from '@mui/icons-material/Attachment';
import PhotoIcon from '@mui/icons-material/Photo';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import ArticleIcon from '@mui/icons-material/Article';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import AddCircleIcon from '@mui/icons-material/AddCircle';

//redux
import { useDispatch, useSelector } from "react-redux";
import { getAllAssignee, getAllComponents, getAllProjects, createDefect, updateAttachment } from '../../store/actions/defects';
import { resetDataState } from '../../store/reducers/defects';
import { Avatar } from '@mui/material';


const CreateDefect = () => {


    const defects = useSelector(state => state.defects);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showSelectProject, setShowSelectProject] = useState(true)
    const [assignee, setAssignee] = useState([])
    const [assigneeSelectTouched, setAssigneeSelectTouched] = useState(false);
    //add files to be uploaded in a array
    const [filesArray, setFilesArray] = useState([])


    //WYSIWYG Blur state
    const [editorBlur, setEditorBlur] = useState(false);

    //Modal
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        dispatch(resetDataState());
        dispatch(getAllProjects());
    }, []);

    const handleChange = async (event) => {
        const {
            target: { value },
        } = event;
        setAssignee(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        )
        console.log(assignee)
    };

    const handleEditorState = (state) => {
        formik.setFieldValue('description', state, true)
    }

    const handleEditorBlur = (blur) => {
        setEditorBlur(blur)
    }


    const handleModalConfirm = () => {
        setShowSelectProject(true)
        setAssignee([])
        setAssigneeSelectTouched(false)
        formik.resetForm()
    }

    //handler for file upload
    const handleRemoveFileArray = (item) => {
        const toRemove = item
        const updated = filesArray.filter((item, j) => toRemove !== item)
        setFilesArray(updated)
    }

    const handleFileArray = (e) => {

        const fileSizeKb = e.target.files[0].size / 1024;
        const MAX_FILE_SIZE = 5120;
        const fileName = e.target.files[0].name

        //max 5mb
        if (fileSizeKb > MAX_FILE_SIZE) {
            alert('Maximum file size limit is 5MB')
        } else if (filesArray.some(e => e.name === fileName)) {
            alert('Filename must be unique, not allowed to attach file with same name')
            console.log(filesArray)
            console.log(filesArray.values('name'))
        } else {
            setFilesArray([...filesArray, e.target.files[0]]);
            console.log(filesArray)
        }


    }

    const attachmentIcon = (filetype) => {
        let icon = <InsertDriveFileIcon />

        if (filetype.includes('image')) icon = <PhotoIcon />
        if (filetype.includes('pdf')) icon = <PictureAsPdfIcon />
        if (filetype.includes('audio')) icon = <AudioFileIcon />
        if (filetype.includes('video')) icon = <VideoFileIcon />
        if (filetype.includes('text')) icon = <ArticleIcon />
        if (filetype.includes('zip') || filetype.includes('7z') || filetype.includes('gz')
            || filetype.includes('rar') || filetype.includes('tar')) icon = <FolderZipIcon />


        return (
            <ListItemIcon>
                {icon}
            </ListItemIcon>
        )
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: formValues,
        validationSchema: validation,
        onSubmit: (values) => {
            formik.values.status = "New"
            dispatch(createDefect(
                values))
                .unwrap()
                .then((response) => {
                    console.log(filesArray)
                    dispatch(updateAttachment({
                        defectId: response.defectid,
                        attachment: filesArray,
                        action: 'uploadFile'
                    }

                    ))
                    navigate('/')
                })
        }
    })

    return (
        <>
            <Typography variant='h4' sx={{ marginTop: '2rem', backgroundColor: 'lightblue', borderRadius: '20px', width: 'fit-content', padding: '0.5rem' }}>Create Issue</Typography>



            <form className='defect_form' style={{ marginTop: '2rem' }} onSubmit={formik.handleSubmit}>

                {/* hide project select box after selecting */}
                {showSelectProject === true ?
                    <Box>
                        <Typography variant='h6' sx={{ marginTop: '2rem' }}>Select a project to continue</Typography>


                        <FormControl
                            fullWidth
                            sx={{ marginTop: '1rem' }}>


                            <InputLabel>Project</InputLabel>
                            <Select
                                name='project'
                                label='Project'
                                sx={{ width: '50%' }}
                                {...formik.getFieldProps('project')}
                            >
                                {defects.data.project ? defects.data.project.map((item) => (
                                    <MenuItem
                                        key={item.title}
                                        value={item.title}
                                        onClick={(e) => {
                                            setShowSelectProject(false)
                                            dispatch(getAllAssignee(e.target.textContent))
                                            dispatch(getAllComponents(e.target.textContent))
                                        }}
                                    >{item.title}</MenuItem>
                                )
                                ) : null}

                            </Select>

                            {errorHelperSelect(formik, 'project')}
                        </FormControl>
                    </Box>
                    : null
                }

                {/* show other components ONLY if project is selected */}

                {showSelectProject === true ? null :
                    <>
                        <Typography variant='overline' fontSize={'1.2rem'} fontWeight={500}>Project: {formik.values.project}</Typography>

                        <Tooltip title="Change Project">
                            <IconButton
                                color="primary"
                                onClick={() => {
                                    setOpenModal(true)
                                }
                                }
                                sx={{ marginRight: '3rem' }}>
                                <ModeEditIcon />
                            </IconButton>
                        </Tooltip>

                        <ModalComponent
                            open={openModal}
                            setOpenModal={setOpenModal}
                            title="Warning"
                            description={"Changing of Project will reset all field"}
                            warn={"Are you sure you want to continue?"}
                            handleModalConfirm={handleModalConfirm}
                            button1="Confirm"
                            button2="Cancel"
                            titleColor="darkred"
                        >
                        </ModalComponent>

                        <Divider sx={{ marginTop: '0.5rem', marginBottom: '2rem', width: '50%' }} />
                        <FormGroup
                            sx={{ marginTop: '0.5rem' }}>
                            <TextField
                                name='title'
                                label='Defect Summary'
                                variant='outlined'
                                {...formik.getFieldProps('title')}
                                {...errorHelper(formik, 'title')}
                            />
                        </FormGroup>


                        <Divider sx={{ marginTop: '2rem', marginBottom: '2rem' }} />


                        {/* TODO */}
                        {/* To add generate template function, set description */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button>Generate Template</Button>
                        </Box>

                
                        <InputLabel>Description: </InputLabel>
                        <FormControl
                            sx={{ marginTop: '1rem' }}>
                            <WYSIWYG
                                setEditorState={(state) => handleEditorState(state)}
                                setEditorBlur={(blur) => handleEditorBlur(blur)}
                                onError={formik.errors.description}
                                editorBlur={editorBlur}
                            />

                            {formik.errors.description || (formik.errors.description && editorBlur)
                                ?
                                <FormHelperText error={true}>
                                    {formik.errors.description}
                                </FormHelperText>
                                :
                                null
                            }
                        </FormControl>

                        <Divider sx={{ marginTop: '2rem', marginBottom: '2rem' }} />

                        <InputLabel>Attach Files:</InputLabel>
                        <InputLabel sx={{ fontSize: '0.8rem', color: 'darkred' }}>Note: Max File size: 5MB</InputLabel>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>

                            <FormControl>
                                <Button
                                    variant="contained"
                                    component="label"
                                    onChange={(e) => handleFileArray(e)}
                                    startIcon={<AttachmentIcon sx={{ transform: 'rotate(265deg)' }} />}
                                >
                                    Upload
                                    <input hidden accept=".csv, .xlsx , .xls , image/* , .pdf , text/plain , video/* , audio/*" multiple type="file" />
                                </Button>
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'flex', maxHeight: '150px', overflow: 'auto' }}>

                            <List>
                                {filesArray.map((item) => (
                                    <ListItem
                                        key={`${item.name}_${item.lastModified}`}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleRemoveFileArray(item)}
                                            >
                                                <DeleteIcon sx={{ color: 'red' }} />
                                            </IconButton>}
                                    >
                                        {attachmentIcon(item.type)}
                                        <ListItemText
                                            primary={item.name}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        <Divider sx={{ marginTop: '2rem', marginBottom: '2rem' }} />

                        <FormControl
                            sx={{ margin: '1rem 1.5rem 0 0' }}>

                            <InputLabel>Components</InputLabel>

                            <Select
                                name='components'
                                label='components'
                                sx={{ width: '250px' }}
                                value={defects.data.components}
                                {...formik.getFieldProps('components')}
                            >

                                {defects.data.components ? defects.data.components.map((item) => (
                                    <MenuItem
                                        key={item}
                                        value={item}
                                    >{item}</MenuItem>
                                )) : null
                                }
                            </Select>

                            {errorHelperSelect(formik, 'components')}
                        </FormControl>

                        <FormikProvider value={formik}>
                            <FieldArray
                                name="assignee"
                                render={arrayHelpers => (
                                    <FormControl
                                        sx={{ margin: '1rem 1.5rem 0 0' }}>
                                        <InputLabel>Assignee</InputLabel>
                                        <Select
                                            sx={{ width: '250px' }}
                                            multiple
                                            name='assignee'
                                            label='Assignee'
                                            value={assignee}
                                            onChange={
                                                (e) => {
                                                    handleChange(e)
                                                }
                                            }
                                            onClose={() => {
                                                setAssigneeSelectTouched(true);
                                                formik.setFieldValue('assignee', [...assignee])
                                            }}
                                            required
                                            renderValue={(selected) => selected.join(', ')}
                                        >
                                            {defects.data.assignee ? defects.data.assignee.map((item) => (

                                                <MenuItem
                                                    key={item.email}
                                                    value={item.email}
                                                >
                                                    <Checkbox
                                                        checked={assignee.indexOf(item.email) > -1}
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
                                        {assignee.length === 0 && assigneeSelectTouched === true ?
                                            <FormHelperText error={true}>
                                                Please select a assignee
                                            </FormHelperText>
                                            :
                                            null
                                        }
                                    </FormControl>
                                )}
                            />
                        </FormikProvider>
                        <br></br>

                        <FormControl
                            sx={{ margin: '1rem 1.5rem 0 0' }}>

                            <InputLabel>Server</InputLabel>
                            <Select
                                name='server'
                                label='Server'
                                sx={{ width: '250px' }}
                                {...formik.getFieldProps('server')}
                            >

                                <MenuItem key="Local" value="Local">Local</MenuItem>
                                <MenuItem key="Development" value="Development">Development</MenuItem>
                                <MenuItem key="QA" value="QA">QA</MenuItem>
                                <MenuItem key="Production" value="Production">Production</MenuItem>
                            </Select>

                            {errorHelperSelect(formik, 'server')}
                        </FormControl>


                        <FormControl
                            sx={{ marginTop: '1rem' }}>

                            <InputLabel>Issue Type</InputLabel>
                            <Select
                                name='issuetype'
                                label='Issue Type'
                                sx={{ width: '250px' }}
                                {...formik.getFieldProps('issuetype')}
                            >
                                <MenuItem key="Bug" value="Bug">Bug</MenuItem>
                                <MenuItem key="Change" value="Change">Change</MenuItem>
                                <MenuItem key="Incident" value="Incident">Incident</MenuItem>
                            </Select>

                            {errorHelperSelect(formik, 'server')}
                        </FormControl>

                        <br></br>
                        <FormControl
                            sx={{ marginTop: '1rem' }}>

                            <InputLabel>Severity</InputLabel>
                            <Select
                                name='severity'
                                label='severity'
                                sx={{ width: '250px' }}
                                {...formik.getFieldProps('severity')}
                            >

                                <MenuItem key="Low" value="Low">Low</MenuItem>
                                <MenuItem key="Medium" value="Medium">Medium</MenuItem>
                                <MenuItem key="High" value="High">High</MenuItem>
                                <MenuItem key="Showstopper" value="Showstopper">Showstopper</MenuItem>
                            </Select>

                            {errorHelperSelect(formik, 'severity')}
                        </FormControl>
                        <br></br>

                        <Button
                            variant='text'
                            onClick={() => navigate('/')}
                            sx={{ float: 'right', margin: '3rem 0.5rem 0 0' }}>
                            Cancel
                        </Button>

                        <Button
                            variant='contained'
                            type="submit"
                            sx={{ float: 'right', margin: '3rem 0.5rem 0 0' }}>
                            Create
                        </Button>

                    </>
                }

            </form>
        </>
    )
}

export default CreateDefect;