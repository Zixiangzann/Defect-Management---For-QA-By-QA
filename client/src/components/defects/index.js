//lib
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//comp
import { resetDataState, resetFilterState } from '../../store/reducers/defects';
import ColumnFilter from './columnFilter';


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
import ViewWeekRoundedIcon from '@mui/icons-material/ViewWeekRounded';



const Defect = () => {
    const defects = useSelector(state => state.defects)
    const users = useSelector(state => state.users)
    const navigate = useNavigate();

    const [columnFilterAnchor, setColumnFilterAnchor] = useState()
    const [defectFilterAnchor, setDefectFilterAnchor] = useState()

    const handleColumnFilter = (event) => {
        setColumnFilterAnchor(columnFilterAnchor ? null : event.currentTarget);
    }

    const handleDefectFilter = (event) => {
        setDefectFilterAnchor(defectFilterAnchor ? null : event.currentTarget);
    }

    return (


        <Box
            mt={5}
        >

            <Typography variant='h4'>Defects List</Typography>
            <Divider sx={{ marginTop: '15px', marginBottom: '15px', width: '250px' }}></Divider>

            <Box className="defectListContainer" display={'flex'} justifyContent={'flex-end'} flexDirection={'row'} flexWrap={'wrap'}>



                <Box className='defectListActionContainer' sx={{ display: 'flex', flexBasis: '100%', justifyContent: 'flex-end', flexDirection: 'row', flexWrap: 'wrap' }}>


                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexBasis: '100%' }}>
                        <Button
                            className='createNewDefectBtn'
                            variant="contained"
                            onClick={() => navigate('/defect/create')}
                            sx={{backgroundColor: '#574C9A'
                            , color: 'cornsilk'
                            , marginBottom: '5px'
                            , flexBasis: '20%'
                            , '&:hover':{backgroundColor:'#5E4DC2',color:'white'} }}
                            disabled={!users.data.permission[0].addDefect}
                        >
                            Create New Defect
                        </Button>
                    </Box>

                    <div className='break' style={{ flexBasis: '100%' }}></div>

                    <Button
                        className='columnFilterBtn'
                        startIcon={<ViewWeekRoundedIcon />}
                        variant={'outlined'}
                        sx={{ mr: '0.5rem' }}
                        onClick={handleColumnFilter}
                    >
                        Columns
                    </Button>




                    <Button
                        className='defectFilterBtn'
                        variant='outlined'
                        startIcon={<FilterListIcon />}
                        onClick={handleDefectFilter}
                    >
                        Filter
                    </Button>


                    <div className='break' style={{ flexBasis: '100%' }}></div>



                </Box>

</Box>



            <DefectFilter
                defectFilterAnchor={defectFilterAnchor}
                setDefectFilterAnchor={setDefectFilterAnchor}
            />

            <ColumnFilter
                columnFilterAnchor={columnFilterAnchor}
                setColumnFilterAnchor={setColumnFilterAnchor}

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