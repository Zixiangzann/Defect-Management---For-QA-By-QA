//lib
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom'
import Moment from 'react-moment'
import { htmlDecode } from '../../utils/tools';

//function
import { calcuDateDiff } from '../../../src/utils/tools'


//mui
import Box from "@mui/material/Box"
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import HistoryIcon from '@mui/icons-material/History';
import Tooltip from '@mui/material/Tooltip';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

//Datepicker
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import moment from "moment";
import { getHistoryByDefectIdAndDate, getDefectEditDate } from "../../store/actions/history";
import { maxHeight } from "@mui/system";



const Activity = () => {

    const [showIssueHistory, setShowIssueHistory] = useState(false);

    let { defectId } = useParams();
    const dispatch = useDispatch();

    //redux
    const defectHistory = useSelector(state => state.history.defectHistory)
    const defectEditDate = useSelector(state => state.history.defectEditDate)

    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')

    const handleFromDate = (value) => {
        setFromDate(value)
    }

    const handleToDate = (value) => {
        setToDate(value)
    }

    const tableCellStyle = () => {
        return (
            {
                width: 'min-content',
                whiteSpace: 'nowrap'
                // p:'0.6rem'
            }
        )
    }

    useEffect(() => {
        dispatch(getDefectEditDate({ defectId }))
    }, [])

    useEffect(() => {
        setFromDate(defectEditDate[0])
        setToDate(defectEditDate[defectEditDate.length - 1])
    }, [defectEditDate])

    useEffect(() => {

        if (fromDate && toDate) {
            dispatch(getHistoryByDefectIdAndDate({
                defectId,
                editDateFrom: fromDate,
                editDateTo: toDate,
            }))
        }

    }, [toDate, fromDate]);



    return (
        <Box className="history" sx={{ m: '1rem', mt: '2rem', display: 'flex', flexWrap: 'wrap', flexBasis: '100%', overflow: 'auto' }}>

            <Typography className="defectSubHeader" m={1} flexBasis={'100%'} display={'inline'}>
                {showIssueHistory ?
                    <Tooltip title="Hide defect details">
                        <ArrowCircleDownIcon
                            onClick={() => setShowIssueHistory(false)}
                            sx={{ marginTop: '1rem', marginRight: '1rem' }} />
                    </Tooltip>
                    :
                    <Tooltip title="Show defect details">
                        <ArrowCircleUpIcon
                            onClick={() => setShowIssueHistory(true)}
                            sx={{ marginTop: '1rem', marginRight: '1rem' }} />
                    </Tooltip>
                }
                Activity:
            </Typography>

            {/* <Typography sx={{ display: 'inline' }} fontWeight={'600'} mb={5} className="defectSubHeader">Issue History:</Typography> */}


            {/* <HistoryIcon sx={{ display: 'inline', color: 'darkkhaki'}} /> */}

            {showIssueHistory ?
                <Box className="dateRange" display={'block'} flexBasis={'100%'} mt={5} >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date From: "
                            inputFormat="YYYY-MM-DD"
                            value={fromDate}
                            onChange={handleFromDate}
                            renderInput={(params) => <TextField {...params} sx={{ label: { color: '#0000cd' } }} />}
                        />
                    </LocalizationProvider>

                    <Typography display={'inline'} m={3} textAlign={'center'} fontSize={'2rem'}>-</Typography>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date To: "
                            inputFormat="YYYY-MM-DD"
                            value={toDate}
                            onChange={handleToDate}
                            renderInput={(params) => <TextField {...params} sx={{ label: { color: '#0000cd' } }} />}
                        />
                    </LocalizationProvider>


                    {defectHistory.length ?
                        <Box className="historyTable" mt={'2rem'} maxHeight={'500px'} overflow={'auto'} display={'flex'}>

                            <Paper sx={{ overflow: 'auto', flexBasis: '100%' }} >
                                <TableContainer component={Paper}>
                                    <Table sx={{ border: '1px dotted grey' }} size="small">
                                        <TableHead >
                                            <TableRow >
                                                {/* <TableCell sx={tableCellStyle}>Date: </TableCell>
                                                <TableCell sx={tableCellStyle}>Changed by: </TableCell>
                                                <TableCell sx={tableCellStyle}>Action: </TableCell>
                                                <TableCell sx={tableCellStyle}>Changes: </TableCell> */}

                                            </TableRow>
                                        </TableHead>
                                        <TableBody >
                                            {defectHistory.map((item, index) => (
                                                <TableRow >
                                                    <TableCell sx={tableCellStyle}>

                                                        {calcuDateDiff(item.editdate)}, 
                                                        
                                                        <Typography sx={{fontWeight:'600',display:'inline'}}>&nbsp;  {item.user[0].username}</Typography>
                                                        {(() => {
                                                            if (item.field === "description" || item.field === "assignee" || item.field === "status") {
                                                                return (
                                                                    <Typography display={'inline'}>
                                                                         &nbsp; changed 
                                                                         <Typography sx={{fontWeight:'600',display:'inline'}}>&nbsp; {item.field}</Typography>
                                                                        
                                                                    </Typography>     
                                                                )
                                                            } else if (item.field === "title") {
                                                                return (
                                                                    <Typography display={'inline'}>
                                                                         &nbsp; changed 
                                                                         <Typography sx={{fontWeight:'600',display:'inline'}}>&nbsp; summary</Typography>
                                                                       
                                                                    </Typography>
                                                                )

                                                            } else {
                                                                return (
                                                                    <Typography display={'inline'}>
                                                                    &nbsp; updated 
                                                                    <Typography sx={{fontWeight:'600',display:'inline'}}>&nbsp; {item.field}</Typography>
                                                                   
                                                               </Typography>
                                                                )
                                                            }
                                                        }
                                                        )()}

</TableCell>

                                                        {item.field === 'description' ?
                                                           <TableCell>

                                                                {/* <Typography sx={{ textAlign: 'center',color: '#fc7276', textDecoration: 'line-through' }}>
                                                                <Box overflow={'auto'}>
                                                                    <div className='defect-description' style={{ margin: '2rem' }}>
                                                                        <div dangerouslySetInnerHTML={{ __html: htmlDecode(item.from) }}>
                                                                        </div>
                                                                    </div>
                                                                </Box>
                                                            </Typography> */}

                                                                <Typography sx={{ textAlign: 'left' }}>
                                                                    <Box overflow={'auto'}>
                                                                        <div className='defect-description' style={{ margin: '2rem' }}>
                                                                            <div dangerouslySetInnerHTML={{ __html: htmlDecode(item.to) }}>
                                                                            </div>
                                                                        </div>
                                                                    </Box>
                                                                </Typography>



                                                                </TableCell>
                                                            :
                                                            <TableCell>
                                                                {Array.isArray(item.from) ?
                                                                    [
                                                                        //added item
                                                                        item.to.filter(x => !item.from.includes(x)).map((item) => (
                                                                            <Box>
                                                                                <Typography sx={{ fontWeight: '600', color: '#1ae155', textAlign: 'left', textAlign: 'left', p: '0.2rem' }}>- {item}</Typography>
                                                                            </Box>
                                                                        ))
                                                                        ,
                                                                        //no changes item
                                                                        item.to.filter(x => item.from.includes(x)).map((item) => (
                                                                            <Box >
                                                                                <Typography sx={{ color: 'black', textAlign: 'left', textAlign: 'left', p: '0.2rem' }}>- {item}</Typography>
                                                                            </Box>
                                                                        ))
                                                                        ,
                                                                        //removed item
                                                                        item.from.filter(x => !item.to.includes(x)).map((item) => (
                                                                            <Box>
                                                                                <Typography sx={{ color: '#fc7276', textAlign: 'left', textAlign: 'left', p: '0.2rem', textDecoration: 'line-through' }}>- {item}</Typography>
                                                                            </Box>
                                                                        ))
                                                                    ]
                                                                    :

                                                                    <>
                                                                        <Typography sx={{ color: '#fc7276', textAlign: 'left', textDecoration: 'line-through' }}>{item.from}</Typography>
                                                                        <Typography sx={{ fontWeight: '600', color: '#1ae155', textAlign: 'left' }}>{item.to}</Typography>
                                                                    </>


                                                                }
                                                               </TableCell>
                                                            
                                                        }
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </Paper>
                        </Box>
                        :
                        null
                    }
                </Box>
                :
                null
            }
        </Box>




    )
}

export default Activity