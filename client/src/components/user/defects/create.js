//lib
import { useState, useEffect, useRef } from 'react'
import { useFormik, FieldArray, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom'

import { storage } from '../../../firebase.js'
import { ref, getDownloadURL, uploadBytes } from "firebase/storage"

//comp
import { errorHelper, errorHelperSelect, Loader } from '../../../utils/tools'
import { validation, formValues } from './validationSchema'
import ModalComponent from '../../../utils/modal/modal';
import WYSIWYG from '../../../utils/form/wysiwyg';

//MUI
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import AttachmentIcon from '@mui/icons-material/Attachment';

//redux
import { useDispatch, useSelector } from "react-redux";
import { getAllAssignee, getAllComponents, getAllProjects, createDefect, updateAttachment } from '../../../store/actions/defects';
import { resetDataState } from '../../../store/reducers/defects';


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
        setFilesArray([...filesArray, e.target.files[0]]);
        console.log(filesArray)
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
                        attachment: filesArray
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
                        <Box sx={{display:'flex',justifyContent:'flex-end',mb:2}}>
                        
                        <FormControl>
                            <Button
                                variant="contained"
                                component="label"
                                onChange={(e) => handleFileArray(e)}
                                startIcon={<AttachmentIcon sx={{transform: 'rotate(265deg)'}}/>}
                            >
                                Upload
                                <input hidden accept=".csv, .xlsx , .xls , image/* , .pdf , text/plain , video/*" multiple type="file" />
                            </Button>
                        </FormControl>
                        </Box>

                        <Box sx={{display:'flex',maxHeight:'150px',overflow:'auto'}}>

                            <List>
                                {filesArray.map((item)=>(
                                <ListItem
                                    key={`${item.name}_${item.lastModified}`}
                                    secondaryAction={
                                        <IconButton 
                                        edge="end" 
                                        aria-label="delete"
                                        onClick={()=>handleRemoveFileArray(item)}
                                        >
                                            <DeleteIcon sx={{color:'red'}}/>
                                        </IconButton>}
                                >
                                    <ListItemIcon>
                                            <InsertDriveFileIcon />
                                    </ListItemIcon>
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
                            Create
                        </Button>

                    </>
                }

            </form>
        </>
    )
}

export default CreateDefect;