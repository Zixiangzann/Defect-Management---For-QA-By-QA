//lib
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//mui
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { setShowColumn } from '../../../store/reducers/watchlist'


const WatchlistColumnFilter = ({
    columnFilterAnchor,
    setColumnFilterAnchor
}) => {

    const open = Boolean(columnFilterAnchor)
    const dispatch = useDispatch();
    const showColumn = useSelector(state => state.watchlist.defectList.filter.showColumn)

    const [state, setState] = useState({
        menu: true,
        defectid: true,
        title: true,
        project: true,
        components: true,
        severity: true,
        status: true,
        server: false,
        reporter: false,
        createdDate: false,
        lastUpdatedDate: false,
    });

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    }

    useEffect(() => {
        dispatch(setShowColumn(state))
    }, [state]);

    useEffect(() => {
        setState(showColumn)
    }, [])

    return (

        <Menu
            open={open}
            anchorEl={columnFilterAnchor}
            onClose={() => setColumnFilterAnchor(null)}
            sx={{ '& .MuiPaper-root': { border: '2px dotted lightblue' } }}
        >
            <Box sx={{ p: 1 }}>
                <FormGroup>
                    <FormControlLabel
                        name="menu"
                        control={
                            <Checkbox
                                checked={state.menu}
                            />
                        }
                        label={'Menu'}
                        onClick={handleChange}

                    />
                    <FormControlLabel
                        name="defectid"
                        control={
                            <Checkbox
                                checked={state.defectid}
                            />
                        }
                        label={'Defect ID'}
                        onClick={handleChange}
                    />

                    <FormControlLabel
                        name="title"
                        control={
                            <Checkbox
                                checked={state.title}
                            />
                        }
                        label={'Summary'}
                        onClick={handleChange}
                    />

                    <FormControlLabel
                        name="project"
                        control={
                            <Checkbox
                                checked={state.project}
                            />}
                        label={'Project'}
                        onClick={handleChange}
                    />


                    <FormControlLabel
                        name="components"
                        control={
                            <Checkbox
                                checked={state.components}
                            />}
                        onClick={handleChange}
                        label={'Components'} />


                    <FormControlLabel
                        name="severity"
                        control={
                            <Checkbox
                                checked={state.severity}
                            />}
                        onClick={handleChange}
                        label={'Severity'} />


                    <FormControlLabel
                        name="status"
                        control={
                            <Checkbox
                                checked={state.status}
                            />}
                        onClick={handleChange}
                        label={'Status'} />


                    <FormControlLabel
                        name="server"
                        control={
                            <Checkbox
                                checked={state.server}
                            />}
                        onClick={handleChange}
                        label={'Server'} />

                    <FormControlLabel
                        name="assigneeDetails"
                        control={
                            <Checkbox
                                checked={state.assigneeDetails}
                            />}
                        label={'Assignee'}
                        onClick={handleChange}
                    />


                    <FormControlLabel
                        name="reporter"
                        control={
                            <Checkbox
                                checked={state.reporter}
                            />}
                        onClick={handleChange}
                        label={'Reporter'} />


                    <FormControlLabel
                        name="createdDate"
                        control={
                            <Checkbox
                                checked={state.createdDate}
                            />}
                        onClick={handleChange}
                        label={'Created Date'} />

                    <FormControlLabel
                        name="lastUpdatedDate"
                        control={
                            <Checkbox
                                checked={state.lastUpdatedDate}
                            />}
                        onClick={handleChange}
                        label={'Updated Date'} />


                </FormGroup>
            </Box>
        </Menu>
    )
}

export default WatchlistColumnFilter