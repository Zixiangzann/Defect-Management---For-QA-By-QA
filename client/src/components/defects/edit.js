//lib
import { useState, useEffect, useRef } from 'react'
import { useFormik, FieldArray, FormikProvider } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useParams } from 'react-router-dom'

//comp
import { errorHelper, errorHelperSelect, Loader } from '../../utils/tools'
import { validation, formValues } from './validationSchema'
import ModalComponent from '../../utils/modal/modal';
import WYSIWYG from '../../utils/form/wysiwyg';

//MUI
import { Checkbox, FormControlLabel, Tooltip, Typography } from "@mui/material";
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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PhotoIcon from '@mui/icons-material/Photo';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import ArticleIcon from '@mui/icons-material/Article';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachmentIcon from '@mui/icons-material/Attachment';

//redux
import { useDispatch, useSelector } from "react-redux";
import { getAllAssignee, getAllComponents, getAllProjects, createDefect, getDefectById, updateDefect,updateAttachment } from '../../store/actions/defects';


const EditDefect = () => {


    const defects = useSelector(state => state.defects);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let { defectId } = useParams();

    const [showSelectProject, setShowSelectProject] = useState(false)
    const [assignee, setAssignee] = useState([])
    const [assigneeSelectTouched, setAssigneeSelectTouched] = useState(false);

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(formValues)
    const [editorContent, setEditorContent] = useState(null);
    //WYSIWYG Blur state
    const [editorBlur, setEditorBlur] = useState(false);

    //Modal
    const [openModal, setOpenModal] = useState(false);
    const [modalDescription, setModalDescription] = useState('');
    const [modalType , setModalType] = useState('');

    //add files to be uploaded in a array
    const [ filesArray, setFilesArray ] = useState([])
    //item state for to be deleted
    const [toBeDeleted, setToBeDeleted] = useState('')
    //Attachment action
    const [attachmentAction,setAttachmentAction] = useState('')


    const handleChange = async (event) => {
        const {
            target: { value },
        } = event;
        setAssignee(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        )
    };

    const handleEditorState = (state) => {
        formik.setFieldValue('description', state, true)
    }

    const handleEditorBlur = (blur) => {
        setEditorBlur(blur)
    }

    const handleModalConfirm = () => {

        if(modalType === 'changeProject'){
        setShowSelectProject(true)
        dispatch(getAllProjects());
        setAssignee([])
        setAssigneeSelectTouched(false)
        formik.resetForm()
    }

        if(modalType === 'deleteFile'){
            handleDeleteFile(toBeDeleted)
    }
        
    }

    useEffect(()=>{
        if(modalType === 'changeProject'){
            setModalDescription("Changing of Project will require to re-select Assignee and Components.")
        }else if(modalType === 'deleteFile'){
            setModalDescription(`You are about to permanently delete file "${toBeDeleted.name}"`)
        }
    },[openModal])

    //handler for file delete
    const handleDeleteFile = (item) => {
        const toRemove = item
        const updated = filesArray.filter((item, j) => toRemove !== item)
        setFilesArray([...updated])
        setAttachmentAction('deleteFile')
    }

    //handler for file upload
    const handleUploadFile = (e) => {

        const fileSizeKb = e.target.files[0].size / 1024;
        const MAX_FILE_SIZE = 5120;
        const fileName = e.target.files[0].name

        //max 5mb
        if(fileSizeKb > MAX_FILE_SIZE){
            alert('Maximum file size limit is 5MB')
        }else if(filesArray.some(e => e.name === fileName)){
            alert('Filename must be unique, not allowed to attach file with same name')
            console.log(filesArray)
            console.log(filesArray.values('name'))
        }else{
            setFilesArray([...filesArray, e.target.files[0]]);
            console.log(filesArray)
            setAttachmentAction('uploadFile')
        }

    }

    useEffect(()=>{
        console.log(filesArray)
        console.log(toBeDeleted)
        dispatch(updateAttachment({
            defectId: defectId,
            attachment: filesArray,
            action: attachmentAction,
            toBeDeleted: toBeDeleted.name
        }))
    },[filesArray])


    const attachmentRender = () => {

        return(
<>
        <InputLabel>Attach Files:</InputLabel>
        <InputLabel sx={{fontSize:'0.8rem',color:'darkred'}}>Note: Max File size: 5MB</InputLabel>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>

            <FormControl>
                <Button
                    variant="contained"
                    component="label"
                    onChange={(e) => handleUploadFile(e)}
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
                                onClick={() => {
                                    setModalType('deleteFile');
                                    setToBeDeleted(item);
                                    setOpenModal(true);
                                }}
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
        </>
)
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
        initialValues: formData,
        validationSchema: validation,
        onSubmit: (values) => {
            dispatch(updateDefect({ values, defectId }))
                .unwrap()
                .then((response) => {
                    navigate('/')
                })
        }
    })

    useEffect(() => {
        dispatch(getDefectById(defectId))
            .unwrap()
            .then(response => {
                setLoading(false);
                setFormData(response);
                setEditorContent(response.description)
                dispatch(getAllAssignee(response.project))
                dispatch(getAllComponents(response.project))
                setAssignee(
                    // On autofill we get a stringified value.
                    typeof response.assignee === 'string' ? response.assignee.split(',') : response.assignee,
                )
                setFilesArray([...response.attachment])
            })
    }, [dispatch, defectId])

    return (
        <>
            <Typography variant='h4' sx={{ marginTop: '2rem', backgroundColor: 'lightblue', borderRadius: '20px', width: 'fit-content', padding: '0.5rem' }}>Edit Issue</Typography>



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
                                    setModalType('changeProject');
                                    setOpenModal(true);
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
                            description={modalDescription}
                            warn={"Are you sure you want to continue?"}
                            handleModalConfirm={handleModalConfirm}
                            button1="Confirm"
                            button2="Cancel"
                            titleColor="darkred"
                        >
                        </ModalComponent>

                        <FormControl
                            variant="standard"
                            sx={{ margin: '1rem 1.5rem 0 0', textAlign: 'center', float: 'right' }}>

                            <InputLabel>Status</InputLabel>
                            <Select
                                name='status'
                                label='Status'
                                sx={{ width: '150px' }}
                                {...formik.getFieldProps('status')}
                            >

                                <MenuItem key="New" value="New">New</MenuItem>
                                <MenuItem key="Open" value="Open">Open</MenuItem>
                                <MenuItem key="Fixed" value="Fixed">Fixed</MenuItem>
                                <MenuItem key="Pending re-test" value="Pending re-test">Pending re-test</MenuItem>
                                <MenuItem key="Verified" value="Verified">Verified</MenuItem>
                                <MenuItem key="Closed" value="Closed">Closed</MenuItem>
                                <MenuItem key="Deferred" value="Deferred">Deferred</MenuItem>
                                <MenuItem key="Duplicate" value="Duplicate">Duplicate</MenuItem>
                                <MenuItem key="Not a bug" value="Not a bug">Not a bug</MenuItem>

                            </Select>

                            {errorHelperSelect(formik, 'status')}
                        </FormControl>

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

                        <InputLabel>Description: </InputLabel>
                        <FormControl
                            sx={{ marginTop: '1rem' }}>
                            <WYSIWYG
                                setEditorState={(state) => handleEditorState(state)}
                                setEditorBlur={(blur) => handleEditorBlur(blur)}
                                onError={formik.errors.description}
                                editorBlur={editorBlur}
                                editorContent={editorContent}
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
                        {attachmentRender()}
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
                                                // formik.values.assignee = assignee
                                                formik.setFieldValue('assignee', [...assignee])
                                            }}
                                            required
                                            renderValue={(selected) => selected.join(', ')}
                                        >

                                            {defects.data.assignee ? defects.data.assignee.map((item) => (
                                                <MenuItem key={item} value={item}>
                                                    <Checkbox
                                                        checked={assignee.indexOf(item) > -1}
                                                    />
                                                    <ListItemText primary={item} />
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
                            Edit
                        </Button>

                    </>
                }

            </form>
        </>
    )
}

export default EditDefect;