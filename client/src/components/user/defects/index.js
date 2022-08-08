//lib
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//comp
import { getAllDefectPaginate } from '../../../store/actions/defects';



//MUI
import Button from "@mui/material/Button"
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { AppBar, Divider, Toolbar, Tooltip, Typography } from '@mui/material';
import PaginateComponent from './paginate';
import DefectFilter from './filter';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { resetDataState, resetFilterState } from '../../../store/reducers/defects';


const Defect = () => {
    const defects = useSelector(state => state.defects)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [drawerState, setDrawerState] = useState(false)

    return (


        <Box
            mt={5}
        >

            <Typography variant='h4'>Defects</Typography>
            <Divider sx={{ marginTop: '15px', marginBottom: '15px', width: '250px' }}></Divider>

            <Box display={'flex'} justifyContent={'flex-end'} flexDirection={'row'} flexWrap={'wrap'}>


                <Button
                    variant="contained"
                    onClick={() => navigate('/defect/create')}
                    sx={{ backgroundColor: 'darkslateblue', color: 'cornsilk', marginBottom: '5px' }}
                >
                    Create New Defect
                </Button>
                <div className='break' style={{ flexBasis: '100%' }}></div>

                <Button
                    variant='outlined'
                    startIcon={<FilterListIcon />}
                    onClick={() => setDrawerState(true)}
                    sx={{}}
                >
                    Filter
                </Button>

                {defects.filter.filtered ?
                    <Tooltip title="Reset Filter">
                        <Button
                            onClick={() => {
                                //clear search input field
                                document.getElementById('search-by-title').value = ''
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




            <DefectFilter
                drawerState={drawerState}
                setDrawerState={setDrawerState}
            />

            <PaginateComponent
                defects={defects.defectLists}
                filter={defects.filter}
                sort={defects.sort}
            ></PaginateComponent>

        </Box>
    )
}

export default Defect