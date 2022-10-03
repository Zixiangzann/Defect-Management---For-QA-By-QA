//lib
import { useNavigate } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";


//comp
import { getAllDefectPaginate } from '../../store/actions/defects';
import { resetDataState, setFilterState, resetFilterState } from '../../store/reducers/defects';
import { getAllAssignee, getAllComponents, getAllProjects, filterDefect } from '../../store/actions/defects';
import { StatusColorCode, SeverityColorCode } from '../../utils/tools';

//MUI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button"
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Popper from '@mui/material/Popper';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import { boolean } from 'yup';


const DefectFilter = ({
    defectFilterAnchor,
    setDefectFilterAnchor
}) => {

    const open = Boolean(defectFilterAnchor)

    const defects = useSelector(state => state.defects);
    const dispatch = useDispatch();

    const [state, setState] = useState({
        project: "",
        components: "",
        severity: "",
        status: "",
        server: ""
    })


    const handleChange = (event) => {
        const value = event.target.value;
        setState({
            ...state,
            [event.target.name]: value
        });
    }

    useEffect(()=>{
        setState({
            project: defects.filter.field.project,
            components: defects.filter.field.components,
            severity:defects.filter.field.severity,
            status:defects.filter.field.status,
            server: defects.filter.field.server,
        })
    },[])

    useEffect(()=>{
        dispatch(setFilterState({
            project: state.project,
            components: state.components,
            status: state.status,
            severity: state.severity,
            server: state.server,
            order: defects.sort.order,
            sortby: defects.sort.sortby,
            search: defects.filter.field.search
        }))
    },[state])

    useEffect(() => {
        dispatch(filterDefect(
            {
                project: state.project,
                components: state.components,
                status: state.status,
                severity: state.severity,
                server: state.server,
                order: defects.sort.order,
                sortby: defects.sort.sortby,
                search: defects.filter.field.search
            }))
    }, [state])

    useEffect(() => {
        // setState({})
        if (open) {
            dispatch(getAllProjects())
        }
    }, [open]);



    return (
        <Container>
            <Box className="filterContainer" sx={{ display: 'flex' }}>

                <Menu
                    open={open}
                    anchorEl={defectFilterAnchor}
                    onClose={() => setDefectFilterAnchor(null)}
                    sx={{ '& .MuiPaper-root': { border: '2px dotted lightblue' } }}
                >

                    <Box sx={{ width: '300px', display: 'flex', flexWrap: 'wrap', p: 1 }}>


                        <Box className="resetFilterBtn" sx={{ flexBasis: '100%', display: 'flex', justifyContent: 'flex-end' }}>

                            {defects.filter.filtered ?
                                <Tooltip title="Reset Filter">
                                    <Button
                                        onClick={() => {
                                            //clear state
                                            setState({})
                                            //clear search input field
                                            // document.getElementById('search-by-title').value = ''
                                            dispatch(resetFilterState());
                                            dispatch(getAllDefectPaginate({
                                                order: defects.sort.order,
                                                sortby: defects.sort.sortby

                                            }))
                                        }}
                                    >
                                        <RestartAltIcon />
                                    </Button>
                                </Tooltip>
                                :
                                null}
                        </Box>

                        <Box className='filterSelectionContainer' sx={{ display: 'flex', flexBasis: '100%', flexDirection: 'column' }}>

                            <FormControl
                                sx={{ margin: '0.5rem', flexBasis: '100%' }}>


                                <InputLabel>Project</InputLabel>
                                <Select
                                    name='project'
                                    label='Project'
                                    value={state.project ?? ""}
                                    onChange={handleChange}
                                    defaultValue=""
                                >

                                    {/* <MenuItem key="allProject" value="">All</MenuItem> */}
                                    {defects.data.project ? defects.data.project.map((item, index) => (
                                        <MenuItem
                                            key={`${item.title}-${index}`}
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
                                    sx={{ margin: '0.5rem', flexBasis: '100%' }}>

                                    <InputLabel>Components</InputLabel>

                                    <Select
                                        name='components'
                                        label='components'
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
                                : null}

                            <FormControl
                                sx={{ margin: '0.5rem', flexBasis: '100%' }}>

                                <InputLabel>Severity</InputLabel>
                                <Select
                                    name='severity'
                                    label='Severity'
                                    value={state.severity ?? ""}
                                    onChange={handleChange}
                                >

                                    <MenuItem key="Low" value="Low">{SeverityColorCode({ severity: "Low", textWidth: '10rem' })}</MenuItem>
                                    <MenuItem key="Medium" value="Medium">{SeverityColorCode({ severity: "Medium", textWidth: '10rem' })}</MenuItem>
                                    <MenuItem key="High" value="High">{SeverityColorCode({ severity: "High", textWidth: '10rem' })}</MenuItem>
                                    <MenuItem key="Showstopper" value="Showstopper">{SeverityColorCode({ severity: "Showstopper", textWidth: '10rem' })}</MenuItem>
                                </Select>
                            </FormControl>
                            <br></br>

                            <FormControl
                                sx={{ margin: '0.5rem', flexBasis: '100%' }}>

                                <InputLabel>Server</InputLabel>
                                <Select
                                    name='server'
                                    label='Server'
                                    value={state.server ?? ""}
                                    onChange={handleChange}
                                >

                                    <MenuItem key="Local" value="Local">Local</MenuItem>
                                    <MenuItem key="Development" value="Development">Development</MenuItem>
                                    <MenuItem key="QA" value="QA">QA</MenuItem>
                                    <MenuItem key="Production" value="Production">Production</MenuItem>
                                </Select>
                            </FormControl>
                            <br></br>


                            <FormControl
                                sx={{ margin: '0.5rem', flexBasis: '100%' }}>

                                <InputLabel>Status</InputLabel>
                                <Select
                                    name='status'
                                    label='Status'
                                    value={state.status ?? ""}
                                    onChange={handleChange}
                                >

                                    <MenuItem key="New" value="New">{StatusColorCode({ status: "New", textWidth: '10rem' })}</MenuItem>
                                    <MenuItem key="Open" value="Open">{StatusColorCode({ status: "Open", textWidth: '10rem' })}</MenuItem>
                                    <MenuItem key="Fixed" value="Fixed">{StatusColorCode({ status: "Fixed", textWidth: '10rem' })}</MenuItem>
                                    <MenuItem key="Pending Retest" value="Pending Retest">{StatusColorCode({ status: "Pending Retest", textWidth: '10rem' })}</MenuItem>
                                    <MenuItem key="Verified" value="Verified">{StatusColorCode({ status: "Verified", textWidth: '10rem' })}</MenuItem>
                                    <MenuItem key="Closed" value="Closed">{StatusColorCode({ status: "Closed", textWidth: '10rem' })}</MenuItem>
                                    <MenuItem key="Deferred" value="Deferred">{StatusColorCode({ status: "Deferred", textWidth: '10rem' })}</MenuItem>
                                    <MenuItem key="Duplicated" value="Duplicated">{StatusColorCode({ status: "Duplicated", textWidth: '10rem' })}</MenuItem>
                                    <MenuItem key="Not a bug" value="Not a bug">{StatusColorCode({ status: "Not a bug", textWidth: '10rem' })}</MenuItem>

                                </Select>
                            </FormControl>
                        </Box>

                    </Box>
                </Menu>


            </Box>
        </Container>
    )
}

export default DefectFilter;