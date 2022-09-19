//lib
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom'
import Moment from 'react-moment'


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

//Datepicker
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import moment from "moment";
import { getHistoryByDefectIdAndDate,getDefectEditDate } from "../../store/actions/history";



const History = () => {

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

    useEffect(()=>{
        dispatch(getDefectEditDate({defectId}))
        setFromDate(defectEditDate[0])
        setToDate(defectEditDate[defectEditDate.length-1])

        dispatch(getHistoryByDefectIdAndDate({
            defectId,
            editDateFrom: moment(fromDate.$d).format('YYYY-MM-DD'),
            editDateTo: moment(toDate.$d).format('YYYY-MM-DD'),
        }))

    },[])

    useEffect(() => {

        if (fromDate) {
            console.log(moment(fromDate.$d).format('YYYY-MM-DD'))
        }
        if (toDate) {
            console.log(moment(toDate.$d).format('YYYY-MM-DD'))
        }

        if (fromDate && toDate) {
            dispatch(getHistoryByDefectIdAndDate({
                defectId,
                editDateFrom: moment(fromDate.$d).format('YYYY-MM-DD'),
                editDateTo: moment(toDate.$d).format('YYYY-MM-DD'),
            }))
        }

    }, [toDate, fromDate]);



    return (
        <Box className="history" sx={{ width: '100%' ,m:'1rem',mt:'2rem'}}>
            <Typography sx={{display:'inline'}} fontWeight={'600'} mb={5} className="defectSubHeader">Issue History:</Typography>
            <HistoryIcon sx={{display:'inline' , color:'darkkhaki',ml:'1rem'}}/>
            <Box className="dateRange" display={'block'} mt={5}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        label="Date From: "
                        inputFormat="YYYY-MM-DD"
                        value={fromDate}
                        onChange={handleFromDate}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>

                <Typography display={'inline'} m={3} textAlign={'center'} fontSize={'2rem'}>-</Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        label="Date To: "
                        inputFormat="YYYY-MM-DD"
                        value={toDate}
                        onChange={handleToDate}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>


                {defectHistory.length ?
                    <Box className="historyTable" mt={'2rem'} height={'500px'} overflow={'auto'}>

                        <Paper >
                            <TableContainer component={Paper} >
                                <Table sx={{ minWidth: '100%', border: '1px dotted grey' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={'20%'}>Date: </TableCell>
                                            {/* <TableCell width={'20%'}>Defect ID: </TableCell> */}
                                            <TableCell width={'20%'}>Changed by: </TableCell>
                                            <TableCell width={'20%'}>Field: </TableCell>
                                            <TableCell width={'20%'}>Changes: </TableCell>


                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {defectHistory.map((item, index) => (
                                            <TableRow>
                                                <TableCell width={'20%'}><Moment format="DD/MMM/YYYY HH:MMA">{item.editdate}</Moment></TableCell>
                                                {/* <TableCell width={'20%'}>{item.defectid}</TableCell> */}
                                                <TableCell width={'20%'}>{item.user[0].username}</TableCell>
                                                <TableCell width={'20%'}>{item.field}</TableCell>
                                                <TableCell width={'20%'}>
                                                    {Array.isArray(item.from) ?
                                                        <Typography sx={{ textDecoration: 'line-through', backgroundColor: '#fc7276', textAlign: 'center', width: '250px' }}>{(item.from).join(',')}</Typography>
                                                        :
                                                        <Typography sx={{ textDecoration: 'line-through', backgroundColor: '#fc7276', textAlign: 'center', width: '250px' }}>{item.from}</Typography>
                                                    }
                                                    {Array.isArray(item.to) ?
                                                        <Typography sx={{ backgroundColor: '#52f78c', fontWeight: '600', textAlign: 'center', width: '250px' }}>{(item.to).join(',')}</Typography>
                                                        :
                                                        <Typography sx={{ backgroundColor: '#52f78c', fontWeight: '600', textAlign: 'center', width: '250px' }}>{item.to}</Typography>
                                                    }

                                                </TableCell>
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
        </Box>



    )
}

export default History