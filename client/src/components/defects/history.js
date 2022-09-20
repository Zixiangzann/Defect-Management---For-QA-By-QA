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



const History = () => {

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
                width: '200px',
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
        <Box className="history" sx={{ width: '100%', m: '1rem', mt: '2rem' }}>

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
                Issue History:
            </Typography>

            {/* <Typography sx={{ display: 'inline' }} fontWeight={'600'} mb={5} className="defectSubHeader">Issue History:</Typography> */}


            {/* <HistoryIcon sx={{ display: 'inline', color: 'darkkhaki'}} /> */}

            {showIssueHistory ?
                <Box className="dateRange" display={'block'} mt={5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date From: "
                            inputFormat="YYYY-MM-DD"
                            value={fromDate}
                            onChange={handleFromDate}
                            renderInput={(params) => <TextField {...params} sx={{label:{color:'#0000cd'}}}/>}
                        />
                    </LocalizationProvider>

                    <Typography display={'inline'} m={3} textAlign={'center'} fontSize={'2rem'}>-</Typography>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date To: "
                            inputFormat="YYYY-MM-DD"
                            value={toDate}
                            onChange={handleToDate}
                            renderInput={(params) => <TextField {...params} sx={{label:{color:'#0000cd'}}}/>}
                        />
                    </LocalizationProvider>


                    {defectHistory.length ?
                        <Box className="historyTable" mt={'2rem'} maxHeight={'500px'} overflow={'auto'}>

                            <Paper >
                                <TableContainer component={Paper}>
                                    <Table  sx={{ minWidth: '100%', border: '1px dotted grey' }} size="small">
                                        <TableHead >
                                            <TableRow >
                                                <TableCell sx={tableCellStyle}>Date: </TableCell>
                                                {/* <TableCell sx={tableCellStyle}>Defect ID: </TableCell> */}
                                                <TableCell sx={tableCellStyle}>Changed by: </TableCell>
                                                <TableCell sx={tableCellStyle}>Action: </TableCell>
                                                <TableCell sx={tableCellStyle}>Changes: </TableCell>
                                                {/* <TableCell sx={tableCellStyle}>After: </TableCell> */}

                                            </TableRow>
                                        </TableHead>
                                        <TableBody >
                                            {defectHistory.map((item, index) => (
                                                <TableRow >
                                                    <TableCell sx={tableCellStyle}>{calcuDateDiff(item.editdate)}</TableCell>
                                                    <TableCell sx={tableCellStyle}>{item.user[0].username}</TableCell>
                                                    <TableCell sx={tableCellStyle}>
                                                        {(()=>{
                                                            if(item.field === "description" || item.field === "assignee" || item.field === "status"){
                                                                return(
                                                                    `changed ${item.field} to`
                                                                    )
                                                            }else if(item.field === "title"){
                                                                return(
                                                                    `changed defect summary to`
                                                                )

                                                            }else{
                                                                return(
                                                                `updated ${item.field} to`
                                                                )
                                                            }
                                                        }
                                                        )()}
                                                    
                                                    
                                                    </TableCell>

                                                    {item.field === 'description' ?
                                                        <TableCell sx={tableCellStyle}>
                                                            <Typography sx={{ textAlign: 'center', width: '350px' }}>
                                                                <Box overflow={'auto'}>
                                                                    <div className='defect-description' style={{ margin: '2rem'}}>
                                                                        <div dangerouslySetInnerHTML={{ __html: htmlDecode(item.to) }}>
                                                                        </div>
                                                                    </div>
                                                                </Box>
                                                            </Typography>
                                                           
                                                        </TableCell>
                                                        :
                                                        <TableCell sx={tableCellStyle}>
                                                            {Array.isArray(item.from) ?
                                                                [
                                                                    item.to.filter(x => !item.from.includes(x)).map((item)=>(
                                                                        <Box backgroundColor={'#52f78c'}>
                                                                        <Typography sx={{  fontWeight: '600', textAlign: 'left',width:'250px',textAlign:'left', p:'0.2rem'}}>- {item}</Typography>
                                                                        </Box>
                                                                    ))
                                                                    ,
                                                                    item.to.filter(x => item.from.includes(x)).map((item)=>(
                                                                        <Box backgroundColor={'mintcream'}>
                                                                        <Typography sx={{  fontWeight: '600', textAlign: 'left',width:'250px',textAlign:'left', p:'0.2rem'}}>- {item}</Typography>
                                                                        </Box>
                                                                    ))
                                                                    ,
                                                                    item.from.filter(x => !item.to.includes(x)).map((item)=>(
                                                                        <Box backgroundColor={'#fc7276'}>
                                                                        <Typography sx={{  fontWeight: '600', textAlign: 'left',width:'250px',textAlign:'left', p:'0.2rem', textDecoration:'line-through'}}>- {item}</Typography>
                                                                        </Box>
                                                                    ))               
                                                                    ]
                                                                :
                                                                <Typography sx={{  textAlign: 'left', width: '250px' }}>{item.to}</Typography>
                                                            }
                                                        </TableCell>
                                                    }
                                                    {/* {item.field === 'description' ?
                                                        <TableCell sx={tableCellStyle}>
                                                            <Typography sx={{ backgroundColor: '#52f78c', textAlign: 'center', width: '250px' }}>
                                                                <Box overflow={'auto'}>
                                                                    <div className='defect-description' style={{ margin: '2rem' ,maxHeight:'250px'}}>
                                                                        <div dangerouslySetInnerHTML={{ __html: htmlDecode(item.to) }}>
                                                                        </div>
                                                                    </div>
                                                                </Box>
                                                            </Typography>
                                                        </TableCell>
                                                        :

                                                        <TableCell sx={tableCellStyle}>
                                                            {Array.isArray(item.to) ?
                                                                // <Typography sx={{ backgroundColor: '#52f78c', fontWeight: '600', textAlign: 'center', width: '250px' }}>{(item.to).join(',')}</Typography>
                                                                
                                                                (item.to).map((item,index)=>(
                                                                    <Box backgroundColor={'#52f78c'}>
                                                                    <Typography sx={{  fontWeight: '600', textAlign: 'left',width:'250px',textAlign:'left', p:'0.2rem'}}>{index+1}. {item}</Typography>
                                                                    </Box>
                                                                ))
                                                                :
                                                                <Typography sx={{ backgroundColor: '#52f78c', fontWeight: '600', textAlign: 'left'}}>{item.to}</Typography>
                                                            }
                                                        </TableCell>
                                                    } */}
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

export default History