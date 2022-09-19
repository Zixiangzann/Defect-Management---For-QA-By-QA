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
import Avatar from '@mui/material/Avatar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Chip from '@mui/material/Chip';


//redux
import { useDispatch, useSelector } from "react-redux";
import { getAllAssignee, getAllComponents, getAllProjects, createDefect, getDefectById, updateDefect, updateAttachment } from '../../store/actions/defects';
import { addHistory } from '../../store/actions/history';


const EditDefect = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { defectId } = useParams();

    //redux selector
    const defect = useSelector(state => state.defects.data)
    const currentDefect = useSelector(state => state.defects.current.defect)
    const currentAssignee = useSelector(state => state.defects.current.assignee)

    //states
    //selected project,components
    const [selectedProject, setSelectedProject] = useState("")
    const [selectedComponents, setSelectedComponents] = useState("")

    //default, disable selectproject
    const [enableSelectProject, setEnableSelectProject] = useState(false)

    const [assignee, setAssignee] = useState([])
    const [assigneeSelectTouched, setAssigneeSelectTouched] = useState(false);

    //state for changing project, when confirmation of changning project, set the state to true and reset components and assignee.
    const [projectChanging, setProjectChanging] = useState(false)

    //formik
    const [formData, setFormData] = useState(formValues)
    const [editorContent, setEditorContent] = useState(null);
    //WYSIWYG Blur state
    const [editorBlur, setEditorBlur] = useState(false);

    //Modal
    const [openModal, setOpenModal] = useState(false);
    const [modalDescription, setModalDescription] = useState('');
    const [modalType, setModalType] = useState('');

    //add files to be uploaded in a array
    const [filesArray, setFilesArray] = useState([])
    //item state for to be deleted
    const [toBeDeleted, setToBeDeleted] = useState('')
    //Attachment action
    const [attachmentAction, setAttachmentAction] = useState('')


    //store after edit attachment to a array, to be use for history comparison
    const afterEditAttachment = []
    //store after edit assignee to a array, to be use for history comparison
    const afterEditAssignee = []

    //handler
    const handleEditorState = (state) => {
        formik.setFieldValue('description', state, true)
    }

    const handleEditorBlur = (blur) => {
        setEditorBlur(blur)
    }

    const handleModalConfirm = () => {

        if (modalType === 'changeProject') {
            setProjectChanging(true)
        }

        if (modalType === 'deleteFile') {
            handleDeleteFile(toBeDeleted)
        }

    }

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
        if (fileSizeKb > MAX_FILE_SIZE) {
            alert('Maximum file size limit is 5MB')
        } else if (filesArray.some(e => e.name === fileName)) {
            alert('Filename must be unique, not allowed to attach file with same name')
            console.log(filesArray)
            console.log(filesArray.values('name'))
        } else {
            setFilesArray([...filesArray, e.target.files[0]]);
            console.log(filesArray)
            setAttachmentAction('uploadFile')
        }
    }

    //attachment components
    const attachmentRender = () => {

        return (
            <>
                <Typography className='defectSubHeader'>Attachment: </Typography>
                {/* <InputLabel>Attach Files:</InputLabel> */}
                <InputLabel sx={{ fontSize: '0.8rem', color: 'darkred' }}>Note: Max File size: 5MB</InputLabel>
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
        if (filetype.includes('vnd.ms-excel')) icon = <ArticleIcon />
        if (filetype.includes('zip') || filetype.includes('7z') || filetype.includes('gz')
            || filetype.includes('rar') || filetype.includes('tar')) icon = <FolderZipIcon />


        return (
            <ListItemIcon>
                {icon}
            </ListItemIcon>
        )
    }

    //useEffect

    //inital, get defect details and 
    useEffect(() => {
        dispatch(getDefectById(defectId))
    }, [dispatch, defectId])


    // initial, set formdata,selected,attachment to currentDefect(before edit) 
    // set assignee to currentAssignee(before edit)
    // dispatch to get the project's assignee and components 
    useEffect(() => {

        if (currentDefect) {
            setFormData(currentDefect);
            setEditorContent(currentDefect.description)

            dispatch(getAllComponents(currentDefect.project))
            setFilesArray([...currentDefect.attachment])
            dispatch(getAllAssignee(currentDefect.project))
            dispatch(getAllProjects())
            setAssignee(currentAssignee)
            setSelectedProject(currentDefect.project)
            setSelectedComponents(currentDefect.components)

        }

    }, [currentDefect])


    //when add/remove attachment, update filesarray
    useEffect(() => {
        dispatch(updateAttachment({
            defectId: defectId,
            attachment: filesArray,
            action: attachmentAction,
            toBeDeleted: toBeDeleted.name
        }))
    }, [filesArray])

    //When modal open
    useEffect(() => {
        if (modalType === 'changeProject') {
            setModalDescription("Changing of Project will require to re-select Assignee and Components.")
        } else if (modalType === 'deleteFile') {
            setModalDescription(`You are about to permanently delete file "${toBeDeleted.name}"`)
        }
    }, [openModal])

    //project changed
    useEffect(() => {

        if (projectChanging) {
            setEnableSelectProject(true)
            setAssignee([])
            setSelectedComponents("")
            formik.setFieldValue("components", "")
            setAssigneeSelectTouched(false)

            setProjectChanging(false)
            // formik.resetForm()
        }

    }, [projectChanging])


    useEffect(() => {
        //push attachment name to afterEditAttachment array. To be use for comparison and add history if different from before edit
        filesArray.map((item) => {
            afterEditAttachment.push(item.name)
        })


        //push assignee username to afterEditAssignee array. To be use for comparison and add history if different from before edit
        assignee.map((item) => {
            afterEditAssignee.push(item.username)
        })
    })



    const formik = useFormik({
        enableReinitialize: true,
        initialValues: formData,
        validationSchema: validation,
        onSubmit: (values) => {
            // compare initial defect value to edited value
            // If have differences, add it as a comment as a history log.

            const editdate = Date.now()

            if (currentDefect.status !== formik.values.status) {
                dispatch(addHistory({
                    defectId,
                    from: currentDefect.status,
                    to: formik.values.status,
                    field: "status",
                    editdate: editdate
                }))
            }

            if (currentDefect.title !== formik.values.title) {
                dispatch(addHistory({
                    defectId,
                    from: currentDefect.title,
                    to: formik.values.title,
                    field: "title",
                    editdate: editdate
                }))
            }

            if (currentDefect.description !== formik.values.description) {
                dispatch(addHistory({
                    defectId,
                    from: currentDefect.description,
                    to: formik.values.description,
                    field: "description",
                    editdate: editdate
                }))
            }

            if (currentDefect.project !== formik.values.project) {
                dispatch(addHistory({
                    defectId,
                    from: currentDefect.project,
                    to: formik.values.project,
                    field: "project",
                    editdate: editdate
                }))
            }

            if (currentDefect.components !== formik.values.components) {
                dispatch(addHistory({
                    defectId,
                    from: currentDefect.components,
                    to: formik.values.components,
                    field: "components",
                    editdate: editdate
                }))
            }

            if (currentDefect.server !== formik.values.server) {
                dispatch(addHistory({
                    defectId,
                    from: currentDefect.server,
                    to: formik.values.server,
                    field: "server",
                    editdate: editdate
                }))
            }

            if (currentDefect.issuetype !== formik.values.issuetype) {
                dispatch(addHistory({
                    defectId,
                    from: currentDefect.issuetype,
                    to: formik.values.issuetype,
                    field: "type",
                    editdate: editdate
                }))
            }

            if (currentDefect.severity !== formik.values.severity) {
                dispatch(addHistory({
                    defectId,
                    from: currentDefect.severity,
                    to: formik.values.severity,
                    field: "severity",
                    editdate: editdate
                }))
            }


            const beforeEditAttachment = []

            currentDefect.attachment.map((item) => {
                beforeEditAttachment.push(item.name)
            })


            if (beforeEditAttachment.sort().toString() !== afterEditAttachment.sort().toString()) {
                dispatch(addHistory({
                    defectId,
                    from: beforeEditAttachment,
                    to: afterEditAttachment,
                    field: "attachment",
                    editdate: editdate
                }))
            }

            const beforeEditAssignee = []
            currentAssignee.map((item) => {
                beforeEditAssignee.push(item.username)
            })

            //for more accurate, maybe need to order by the id first then compare.
            if (beforeEditAssignee.sort().toString() !== afterEditAssignee.sort().toString()) {
                dispatch(addHistory({
                    defectId,
                    from: beforeEditAssignee,
                    to: afterEditAssignee,
                    field: "assignee",
                    editdate: editdate
                }))
            }

            //only want to save the assignee email. Only save the changes if there is changes.
            if (currentAssignee !== assignee) {
                const assigneeEmail = []
                assignee.map((item) => {
                    assigneeEmail.push(item.email)
                })

                formik.values.assignee = assigneeEmail
            }


            dispatch(updateDefect({ values, defectId }))
                .unwrap()
                .then((response) => {
                    navigate('/')
                })
        }
    })

    return (
        <>
            <Typography variant='h4' sx={{ marginTop: '2rem', backgroundColor: 'lightblue', borderRadius: '20px', width: 'fit-content', padding: '0.5rem' }}>Edit Issue</Typography>



            <form className='defect_form' style={{ marginTop: '2rem' }} onSubmit={formik.handleSubmit}>

                {/* revamp project select */}
                <Box sx={{ display: 'flex', marginBottom: '2rem' }}>

                    <FormControl
                        fullWidth
                        sx={{ marginTop: '1rem', flexBasis: '50%' }}>

                        <InputLabel sx={{ color: 'mediumblue' }}>Select Project</InputLabel>
                        <Select
                            name='project'
                            label='Select Project'
                            value={defect.project ? selectedProject : ""}
                            //if enableSelectProject is true, set disabled to false
                            disabled={enableSelectProject ? false : true}
                            {...formik.getFieldProps('project')}
                        >
                            {defect.project ? defect.project.map((item) => (
                                <MenuItem
                                    key={item.title}
                                    value={item.title}
                                    onClick={(e) => {
                                        setEnableSelectProject(false)
                                        dispatch(getAllAssignee(e.target.textContent))
                                        dispatch(getAllComponents(e.target.textContent))
                                    }}
                                >{item.title}</MenuItem>
                            )
                            ) : null}

                        </Select>

                        {errorHelperSelect(formik, 'project')}
                    </FormControl>

                    <Tooltip title="Change Project">
                        <IconButton
                            color="primary"
                            onClick={() => {
                                setModalType('changeProject');
                                setOpenModal(true);
                            }
                            }
                            sx={{ mt: '1rem', ml: '1rem' }}>
                            <ModeEditIcon />
                        </IconButton>
                    </Tooltip>

                </Box>

                {/* show other components ONLY if project is selected */}

                {currentDefect ?
                    <Box id="defectDetails" sx={{ border: '1px dotted black', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                        <Box>
                            <Typography display={'inline'} variant='overline' fontSize={'1.2rem'} fontWeight={500} color={'mediumblue'}>Project: </Typography>
                            <Typography display={'inline'} variant='overline' fontSize={'1.2rem'} fontWeight={500} >{formik.values.project}</Typography>
                        </Box>
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
                        <Divider sx={{ marginTop: '0.5rem', marginBottom: '2rem', width: '50%' }} />
                        <FormControl
                            variant="standard"
                            sx={{ margin: '1rem 1.5rem 0 0', textAlign: 'center' }}>

                            {/* <InputLabel sx={{}}>Status</InputLabel> */}
                            <Typography variant='body' mb={1} alignSelf={'flex-start'} color={'mediumblue'} >Status: </Typography>
                            <Select
                                name='status'
                                label='Status'
                                sx={{ width: '190px', mb: '1rem' }}
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
                        <Typography className="defectSubHeader">Defect Summary: </Typography>
                        <FormGroup
                            sx={{
                                mt: '1rem', '& legend': { display: 'none' },
                                '& fieldset': { top: 0 }
                            }}>
                            <TextField
                                name='title'
                                // label='Summary'
                                variant='outlined'
                                {...formik.getFieldProps('title')}
                                {...errorHelper(formik, 'title')}
                            />
                        </FormGroup>


                        <Divider sx={{ marginTop: '2rem', marginBottom: '2rem' }} />

                        <Typography className="defectSubHeader">Description:  </Typography>
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

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                            <Typography className='defectSubHeader' flexBasis={'100%'} mb={1}>Additonal Information: </Typography>

                            {assignee ?
                                <FormikProvider value={formik}>
                                    <FieldArray
                                        name="assignee"
                                        render={arrayHelpers => (
                                            <FormControl
                                                id="createDefectAssignee"
                                                sx={{ mt: '1rem', mr: '1rem', flexBasis: '35%' }}>
                                                <InputLabel className='defectDetailsSelectLabel'>Assignee</InputLabel>
                                                <Select
                                                    multiple
                                                    name='assignee'
                                                    label='Assignee'
                                                    value={assignee}
                                                    onChange={
                                                        (e) => {

                                                            if (e.target.value.length) {
                                                                const value = e.target.value
                                                                const clickedEmail = value[value.length - 1].email

                                                                let count = 0;
                                                                value.map((item) => {
                                                                    if (item.email === clickedEmail) {
                                                                        count++
                                                                    }
                                                                })

                                                                if (count >= 2) {
                                                                    const removed = value.filter(e => e.email !== clickedEmail)
                                                                    console.log(removed)
                                                                    setAssignee([...removed])
                                                                } else {
                                                                    setAssignee(value)
                                                                }

                                                            } else {
                                                                if (e.length) {
                                                                    setAssignee(e)
                                                                } else {
                                                                    setAssignee([])
                                                                }
                                                            }
                                                        }}
                                                    onClose={() => {
                                                        setAssigneeSelectTouched(true);
                                                        // formik.values.assignee = assignee
                                                        formik.setFieldValue('assignee', [...assignee])
                                                    }}


                                                    required
                                                    renderValue={(selected) => (
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {selected.map((value, index) => (
                                                                <Chip
                                                                    avatar={<Avatar alt={value.username} src={value.photoURL} />}
                                                                    key={`${value.username}-${index}`}
                                                                    label={value.username}
                                                                    color="primary"
                                                                    variant='outlined'
                                                                    sx={{ ml: 2 }} />
                                                            ))}
                                                        </Box>
                                                    )}
                                                >

                                                    {defect.assignee ? defect.assignee.map((item) => (
                                                        <MenuItem
                                                            key={item.email}
                                                            value={item}
                                                        >
                                                            <Checkbox
                                                                checked={assignee.filter(e => e.email === item.email).length > 0}
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

                                                    ))
                                                        : null}

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
                                :
                                null
                            }

                            <FormControl
                                id="createDefectComponents"
                                sx={{ mt: '1rem', mr: '1rem', flexBasis: '35%' }}>

                                <InputLabel className='defectDetailsSelectLabel'>Components</InputLabel>

                                <Select
                                    name='components'
                                    label='components'
                                    value={selectedComponents}
                                    {...formik.getFieldProps('components')}
                                >

                                    {defect.components ? defect.components.map((item) => (
                                        <MenuItem
                                            key={item}
                                            value={item}
                                        >{item}</MenuItem>
                                    )) : null
                                    }
                                </Select>

                                {errorHelperSelect(formik, 'components')}
                            </FormControl>



                            <br></br>

                            <FormControl
                                id="createDefectServer"
                                sx={{ mt: '1rem', mr: '1rem', flexBasis: '35%' }}>

                                <InputLabel className='defectDetailsSelectLabel'>Server</InputLabel>
                                <Select
                                    name='server'
                                    label='Server'
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
                                id="createDefectIssueType"
                                sx={{ mt: '1rem', mr: '1rem', flexBasis: '35%' }}>

                                <InputLabel className='defectDetailsSelectLabel'>Issue Type</InputLabel>
                                <Select
                                    name='issuetype'
                                    label='Issue Type'
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
                                id="createDefectSeverity"
                                sx={{ mt: '1rem', mr: '1rem', flexBasis: '35%' }}>


                                <InputLabel className='defectDetailsSelectLabel'>Severity</InputLabel>
                                <Select
                                    name='severity'
                                    label='severity'
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
                        </Box>

                        <Box>
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
                        </Box>

                    </Box>
                    :
                    null
                }


            </form>
        </>
    )
}

export default EditDefect;