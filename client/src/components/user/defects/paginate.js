//lib
import Moment from 'react-moment'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//comp
import { getAllDefectPaginate,deleteDefect, filterDefect } from '../../../store/actions/defects';
import ModalComponent from '../../../utils/modal/modal';

//MUI
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'

const PaginateComponent = ({
    defects,
    filter
}) => {

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [toRemove,setToRemove] = useState(null);

    const [page, setPage] = useState(0);

    //Modal
    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const handleEdit = (id) => {
        navigate(`/defect/edit/${id}`)
    }

    const handleView = (id) => {
        navigate(`/defect/view/${id}`)
    }

    const handleModalConfirm = (toRemove) => {
        dispatch(deleteDefect({defectId:toRemove}))
        setToRemove(null)
    }


    useEffect(() => {
        if(filter.filtered === false){
        dispatch(getAllDefectPaginate({ page: page + 1, limit: rowsPerPage }))
    }else{
        dispatch(filterDefect({
            page: page + 1,
            limit: rowsPerPage,
            project: filter.project,
            components: filter.components,
            severity: filter.severity,
            status: filter.status
        }))
    }
    }, [page, rowsPerPage,toRemove]);

    return (
        <>
            {defects && defects.docs ?
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <TableContainer>
                            <Table className='defect-table' size='small' sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ textAlign: 'center' }}>Defect ID</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Project</TableCell>
                                        <TableCell>Components</TableCell>
                                        <TableCell>Severity</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Server</TableCell>
                                        <TableCell>Reporter</TableCell>
                                        <TableCell>Created Date</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody
                                >
                                    {defects.docs.map((item) => (
                                        <TableRow key={item._id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell sx={{ maxWidth: '50px', textAlign: 'center' }}>{item.defectid}</TableCell>
                                            <TableCell sx={{ maxWidth: '200px', overflowWrap: 'break-word' }}>{item.title}</TableCell>
                                            <TableCell sx={{ maxWidth: '50px' }}>{item.project}</TableCell>
                                            <TableCell sx={{ maxWidth: '50px' }}>{item.components}</TableCell>
                                            <TableCell sx={{ maxWidth: '20px' }}>{item.severity}</TableCell>
                                            <TableCell sx={{ maxWidth: '20px' }}>{item.status}</TableCell>
                                            <TableCell sx={{ maxWidth: '20px' }}>{item.server}</TableCell>
                                            <TableCell sx={{ maxWidth: '200px', overflowWrap: 'break-word' }}>{item.reporter}</TableCell>
                                            <TableCell sx={{ maxWidth: '20px' }}><Moment format="DD/MMM/YYYY">{item.date}</Moment></TableCell>
                                            <TableCell sx={{ maxWidth: '150px' }}>
                                                <Tooltip title="View">
                                                <Button
                                                sx={{ minHeight: 0, minWidth: 0, padding: 1}}
                                                onClick={()=>handleView(item.defectid)}
                                                >
                                                    <OpenInNewIcon />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                <Button
                                                sx={{ minHeight: 0, minWidth: 0, padding: 1 ,color:'darkorange' }}
                                                onClick={()=>handleEdit(item.defectid)}
                                                >
                                                    <ModeEditIcon />
                                                </Button>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                <Button
                                                onClick={()=>{
                                                    setOpenModal(true)
                                                    setToRemove(item.defectid)
                                                }}
                                                sx={{ minHeight: 0, minWidth: 0, padding: 1 }}
                                                
                                                >
                                                    <DeleteForeverIcon color='error'/>
                                                    </Button>
                                                    </Tooltip>
                                            </TableCell>
                                        </TableRow>

                                    ))}
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[10, 15, 25]}
                                            rowsPerPage={rowsPerPage}
                                            colSpan={3}
                                            count={defects.totalDocs}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </TableRow>
                                </TableBody>



                            </Table>
                        </TableContainer>


                        <ModalComponent
                            open={openModal}
                            setOpenModal={setOpenModal}
                            title="Warning"
                            description={`You are about to permanently delete Defect ID: ${toRemove}`}
                            warn={"Are you sure you want to continue?"}
                            handleModalConfirm={()=>handleModalConfirm(toRemove)}
                            button1="Confirm"
                            button2="Cancel"
                            titleColor="darkred"
                        >
                        </ModalComponent>

                    </Paper>
                </Box>
                :
                null
            }
        </>
    )
}

export default PaginateComponent;