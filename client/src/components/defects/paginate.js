//lib
import Moment from 'react-moment'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//comp
import { getAllDefectPaginate, deleteDefect, filterDefect } from '../../store/actions/defects';
import { setOrder, setSearch, setSortBy,resetFilterState } from '../../store/reducers/defects';
import ModalComponent from '../../utils/modal/modal';
import { StatusColorCode,SeverityColorCode } from '../../utils/tools';

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
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';


const PaginateComponent = ({
    defects,
    filter,
    sort
}) => {

    const users = useSelector(state => state.users)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [toRemove, setToRemove] = useState(null);

    const [page, setPage] = useState(0);

    //Table
    const tableHeader = [
        'Defect ID',
        'Title',
        'Project',
        'Components',
        'Severity',
        'Status',
        'Server',
        'Reporter',
        'Created Date'
    ]

    //Table sorting

    //For table header sorting state
    const [orderActive, setOrderActive] = useState('desc');
    const [sortActive, setSortActive] = useState('defectid');

    //toggle order
    const handleOrder = () => {
        if (orderActive === 'desc') {
            setOrderActive('asc');
        } else if (orderActive === 'asc') {
            setOrderActive('desc');
        }
    }

    const handleSort = (header) => {
        setSortActive(header);
    }

    const handleSearch = (event) => {
        dispatch(setSearch(event.target.value));
    }

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

    const EditMenuComponent = ({defect}) => {


        if((users.data.permission[0].editOwnDefect && defect.reporter === users.data.email) || users.data.permission[0].editAllDefect){
            return(
                <MenuItem
                onClick={() => handleEdit(defect.defectid)}>
                    <Tooltip title="Edit">
                        <Button
                            sx={{ minHeight: 0, minWidth: 0, padding: 0.5, color: 'darkorange',mr:1  }}
                            
                        >
                            <ModeEditIcon />
                        </Button>
                    </Tooltip>
                    Edit
                </MenuItem>
            )
        }
 
        return null
    }

    const DeleteMenuComponent = ({defect}) =>{
        if(users.data.permission[0].deleteAllDefect){
            return(
            <MenuItem
            onClick={() => {
                setOpenModal(true)
                //close menu item
                setShowMenu(false)
                setToRemove(defect.defectid)
            }}>
                <Tooltip title="Delete">
                    <Button
                        sx={{ minHeight: 0, minWidth: 0, padding: 0.5,mr:1  }}

                    >
                        <DeleteForeverIcon color='error' />
                    </Button>
                </Tooltip>
                Delete
            </MenuItem>
            )
        }
        return null
    }

//Defect Menu

    const [defectItem, setDefectItem] = useState({})
    const [showMenu, setShowMenu] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);

    const DefectMenu = ({
        defect
    }) => {
        return (
            <>
                <Menu
                    id="defect-menu"
                    open={showMenu}
                    onClose={() => setShowMenu(false)}
                    anchorEl={anchorEl}
                    >
                    <MenuItem
                    onClick={() => handleView(defect.defectid)}>
                        <Tooltip title="View">
                            <Button
                                sx={{ minHeight: 0, minWidth: 0, padding: 0.5,mr:1 }}
                                
                            >
                                <OpenInNewIcon />
                            </Button>
                        </Tooltip>
                        View</MenuItem>

                        <EditMenuComponent 
                        defect={defect}
                        />

                        <DeleteMenuComponent
                        defect={defect}
                        />

                </Menu>
            </>
        )

    }

    const handleModalConfirm = (toRemove) => {
        dispatch(deleteDefect({ defectId: toRemove }))
        setToRemove(null)
    }

    useEffect(() => {
        switch (sortActive) {
            case "Defect ID":
                dispatch(setSortBy('defectid'));
                break;
            case "Created Date":
                dispatch(setSortBy('date'));
                break;
            default:
                dispatch(setSortBy(sortActive.toLocaleLowerCase()));
                break;
        }

        orderActive === 'asc' ? dispatch(setOrder(1)) : dispatch(setOrder(-1))

    }, [sortActive, orderActive])


    useEffect(() => {

        if (filter.filtered === false) {
            dispatch(getAllDefectPaginate({
                page: page + 1,
                limit: rowsPerPage,
                sortby: sort.sortby,
                order: sort.order,
                search: filter.search
            }))
        } else {
            dispatch(filterDefect({
                page: page + 1,
                limit: rowsPerPage,
                project: filter.project,
                components: filter.components,
                server: filter.server,
                severity: filter.severity,
                status: filter.status,
                sortby: sort.sortby,
                order: sort.order,
                search: filter.search
            }))
        }
    }, [page, rowsPerPage, toRemove, sort.order, sort.sortby, filter.search]);

    useEffect(()=>{
        //reset filter state on load
        dispatch(resetFilterState())
    },[])



    return (
        <>
            {defects && defects.docs ?
                <Paper sx={{ width: '100%', mb: 2, mt: 2 }}>
                    <TextField
                        id="search-by-title"
                        label="Search by title"
                        type="search"
                        variant="standard"
                        onChange={(e) => handleSearch(e)}
                        sx={{ float: 'right', mb: 3, mt: 1, mr: 1, overflow: 'hidden' }}
                    />
                    <TableContainer
                        sx={{ mt: 2, minWidth: 650, maxHeight: 750 }}

                    >
                        <Table
                            className='defect-table'
                            size='small'
                            stickyHeader
                        >

                            <TableHead sx={{ whiteSpace: 'nowrap' }}>
                                <TableRow key={'header'}>
                                    <TableCell>Menu</TableCell>
                                    {tableHeader.map((header) => (
                                        <TableCell
                                            key={`table-${header}`}
                                            
                                            >
                                            <TableSortLabel
                                                active={sortActive === header}
                                                direction={sortActive === header ? orderActive : 'desc'}
                                                onClick={() => {
                                                    handleOrder()
                                                    handleSort(header)
                                                }}
                                            >{header}
                                                {sortActive === header ? (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {orderActive === -1 ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody
                            >
                                {defects.docs.map((item, index) => (
                                    <TableRow key={item._id}
                                    >
                                        
                                        <TableCell 
                                        key={`menu-${index}`} 
                                        sx={{textAlign:'center',cursor: 'pointer'}}
                                        onClick={(e)=>{
                                            setDefectItem(item)
                                            setShowMenu(true)
                                            setAnchorEl(e.currentTarget)
                                        }}
                                        >
                                        <MenuIcon color='secondary'/></TableCell>
                                      
                                        <TableCell key={`${item.defectid}-${index}`} sx={{ minWidth: '50px',textAlign:'center'}}>{item.defectid}</TableCell>
                                        <TableCell key={`${item.title}-${index}`} sx={{ minWidth: '350px', overflowWrap: 'break-word', textOverflow: 'ellipsis' }}>{item.title}</TableCell>
                                        <TableCell key={`${item.project}-${index}`} sx={{ minWidth: '150px' }}>{item.project}</TableCell>
                                        <TableCell key={`${item.components}-${index}`} sx={{ minWidth: '150px'}}>{item.components}</TableCell>
                                        <TableCell key={`${item.severity}-${index}`} sx={{ minWidth: '150px' }}>{SeverityColorCode({severity: item.severity,textWidth:'9rem'})}</TableCell>
                                        <TableCell key={`${item.status}-${index}`} sx={{ minWidth: '50px' }}>
                                            {StatusColorCode({status: item.status,textWidth:'6rem'})}
                                            </TableCell>
                                        <TableCell key={`${item.server}-${index}`} sx={{ minWidth: '50px' }}>{item.server}</TableCell>
                                        <TableCell key={`${item.reporter}-${index}`} sx={{ minWidth: '50px', overflowWrap: 'break-word' }}>{item.reporter}</TableCell>
                                        <TableCell key={`${item.createdDate}-${index}`} sx={{ minWidth: '50px' }}><Moment format="DD/MMM/YYYY">{item.createdDate}</Moment></TableCell>
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 15, 25]}
                        component="div"
                        rowsPerPage={rowsPerPage}
                        colSpan={3}
                        count={defects.totalDocs}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                </Paper>
                :
                null
            }
            <ModalComponent
                open={openModal}
                setOpenModal={setOpenModal}
                title="Warning"
                description={`You are about to permanently delete Defect ID: ${toRemove}`}
                warn={"Are you sure you want to continue?"}
                handleModalConfirm={() => handleModalConfirm(toRemove)}
                button1="Confirm"
                button2="Cancel"
                titleColor="darkred"
            >
            </ModalComponent>

            <DefectMenu
                defect={defectItem}
            >
            </DefectMenu>


        </>
    )
}

export default PaginateComponent;