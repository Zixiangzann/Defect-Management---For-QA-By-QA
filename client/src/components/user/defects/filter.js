//lib
import { useNavigate } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { resetDataState, setFilterState } from '../../../store/reducers/defects';

//comp
import { getAllAssignee, getAllComponents, getAllProjects,filterDefect } from '../../../store/actions/defects';

//MUI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Button from "@mui/material/Button"
import Link from '@mui/material/Link';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText';
import FilterListIcon from '@mui/icons-material/FilterList';


const DefectFilter = ({
    drawerState,
    setDrawerState
}) => {

    const defects = useSelector(state => state.defects);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [state,setState] = useState({
        project:"",
        components:"",
        severity:"",
        status:"",
        server:""
    })

    useEffect(() => {
        setState({})
        if(drawerState) {
            dispatch(getAllProjects())
        }
        console.log(defects.data.components)
    }, [drawerState]);

    const handleChange = (event) =>{
        const value = event.target.value;
        setState({
            ...state,
            [event.target.name] : value
        });
    }

    return (
        <Container className={`defectContainer`}>
            <Box>
                <CssBaseline />


                
                <Drawer
                    sx={{
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: '350px',
                            // boxSizing: 'border-box',
                            top: '65px',
                            bgcolor: 'lightsteelblue',
                            position: 'absolute',
                            height: 'max-content',
                            borderRadius: '5px'
                        },
                    }}
                    open={drawerState}
                    anchor="left"
                    onClose={()=>{
                        setDrawerState(false)
                        dispatch(resetDataState());
                    }
                    }
                >

                    <List>
                    
                        <Typography variant='h6' textAlign={'left'} fontWeight={600} paddingLeft={2}>Filter</Typography>

                        <FormControl
                            fullWidth
                            sx={{ marginTop: '1rem' }}>
                            


                            <InputLabel>Project</InputLabel>
                            <Select
                                name='project'
                                label='Project'
                                value={state.project ?? ""}
                                onChange={handleChange}
                                sx={{ width: '85%' }}
                            >
                                {defects.data.project ? defects.data.project.map((item) => (
                                    <MenuItem
                                        key={item.title}
                                        value={item.title}
                                        onClick={(e) => {
                                            dispatch(getAllAssignee(e.target.textContent))
                                            dispatch(getAllComponents(e.target.textContent))
                                        }}
                                    >{item.title}</MenuItem>
                                ))
                                    : null}

                            </Select>
                        </FormControl>

                        {defects.data.components && defects.data.components.length !== 0 ? 
                        <FormControl
                        fullWidth
                            sx={{ margin: '1rem 1.5rem 0 0' }}>

                            <InputLabel>Components</InputLabel>

                            <Select
                                name='components'
                                label='components'
                                sx={{ width: '85%' }}
                                value={state.components ?? ""}
                                onChange={handleChange}
                            >

                                {defects.data.components ? defects.data.components.map((item) => (
                                    <MenuItem
                                        key={item}
                                        value={item}
                                    >{item}</MenuItem>
                                )) : null
                                }
                            </Select>

                        </FormControl>
                        :null}

                        <FormControl
                            fullWidth
                            sx={{ marginTop: '1rem'}}>

                            <InputLabel>Severity</InputLabel>
                            <Select
                                name='severity'
                                label='Severity'
                                value={state.severity ?? ""}
                                onChange={handleChange}
                                sx={{ width: '85%' }}
                            >

                                <MenuItem key="Low" value="Low">Low</MenuItem>
                                <MenuItem key="Medium" value="Medium">Medium</MenuItem>
                                <MenuItem key="High" value="High">High</MenuItem>
                                <MenuItem key="Showstopper" value="Showstopper">Showstopper</MenuItem>
                            </Select>
                        </FormControl>
                        <br></br>

                        <FormControl
                            fullWidth
                            sx={{ marginTop: '1rem'}}>

                            <InputLabel>Server</InputLabel>
                            <Select
                                name='server'
                                label='Server'
                                value={state.server ?? ""}
                                onChange={handleChange}
                                sx={{ width: '85%' }}
                            >

                                <MenuItem key="Local" value="Local">Local</MenuItem>
                                <MenuItem key="Development" value="Development">Development</MenuItem>
                                <MenuItem key="QA" value="QA">QA</MenuItem>
                                <MenuItem key="Production" value="Production">Production</MenuItem>
                            </Select>
                        </FormControl>
                        <br></br>


                        <FormControl
                            fullWidth
                            sx={{ margin: '1rem 1.5rem 0 0'}}>

                            <InputLabel>Status</InputLabel>
                            <Select
                                name='status'
                                label='Status'
                                value={state.status ?? ""}
                                onChange={handleChange}
                                sx={{ width: '85%' }}
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
                        </FormControl>

                        <Button variant='contained'
                        sx={{left:'70%',marginTop:'1rem'}}
                        onClick={()=>{
                            dispatch(setFilterState({
                                project:state.project,
                                components:state.components,
                                status:state.status,
                                severity:state.severity,
                                server:state.server
                            }))
                            dispatch(filterDefect(
                                {project:state.project,
                                components:state.components,
                                status:state.status,
                                severity:state.severity,
                                server:state.server,
                        }))
                        setDrawerState(false)
                        dispatch(resetDataState());
                    }
                    }
                        >Search</Button>


                    </List>
                </Drawer>

            </Box>
        </Container>
    )
}

export default DefectFilter;