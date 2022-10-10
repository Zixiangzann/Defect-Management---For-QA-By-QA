//lib
import Moment from 'react-moment'
import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//comp
import { deleteDefect, filterDefect } from '../../store/actions/defects';
import { setOrder, setSearch, setSortBy, resetFilterState } from '../../store/reducers/defects';
import ModalComponent from '../../utils/modal/modal';
import { StatusColorCode, SeverityColorCode } from '../../utils/tools';
import { Loader } from '../../utils/tools';

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
import { Avatar, Chip } from '@mui/material';


const PaginateComponent = ({
    defects,
    filter,
    sort
}) => {

    const users = useSelector(state => state.users)
    const showColumn = useSelector(state => state.defects.filter.showColumn)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [toRemove, setToRemove] = useState(null);
    const [searchField, setSearchField] = useState('');

    const [page, setPage] = useState(0);

    const [loading, setLoading] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)

    //Table
    const tableHeader = [
        'defectid',
        'title',
        'project',
        'components',
        'severity',
        'status',
        'server',
        'assigneeDetails',
        'reporter',
        'createdDate',
        'lastUpdatedDate'
    ]

    const changeHeaderText = (header) => {
        if (header === "defectid") {
            return "Defect ID"
        } else if (header === "title") {
            return "Summary"
        } else if (header === "assigneeDetails") {
            return "Assignee"
        }
        else if (header === "createdDate") {
            return "Created Date"
        } else if (header === "lastUpdatedDate") {
            return "Updated Date"
        } else {
            return header.charAt(0).toUpperCase() + header.slice(1);
        }

    }

    //Table sorting

    //For table header sorting state
    const [orderActive, setOrderActive] = useState('desc');
    const [sortActive, setSortActive] = useState('lastUpdatedDate');

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
        setSearchField(event.target.value)
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

    const EditMenuComponent = ({ defect }) => {


        if ((users.data.permission[0].editOwnDefect && defect.reporter === users.data.email) || users.data.permission[0].editAllDefect) {
            return (
                <MenuItem
                    onClick={() => handleEdit(defect.defectid)}>
                    <Tooltip title="Edit">
                        <Button
                            sx={{ minHeight: 0, minWidth: 0, padding: 0.5, color: 'darkorange', mr: 1 }}

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

    const DeleteMenuComponent = ({ defect }) => {
        if (users.data.permission[0].deleteAllDefect) {
            return (
                <MenuItem
                    onClick={() => {
                        setOpenModal(true)
                        //close menu item
                        setShowMenu(false)
                        setToRemove(defect.defectid)
                    }}>
                    <Tooltip title="Delete">
                        <Button
                            sx={{ minHeight: 0, minWidth: 0, padding: 0.5, mr: 1 }}

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
                                sx={{ minHeight: 0, minWidth: 0, padding: 0.5, mr: 1 }}

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

    // useEffect(() => {
    //     dispatch(setSortBy(sortActive));
    //     orderActive === 'asc' ? dispatch(setOrder(1)) : dispatch(setOrder(-1))
    // }, [sortActive, orderActive])


    useEffect(() => {

        if (firstLoad) {
            setLoading(true)
        }

        if(!filter.filtering && !loading){
        dispatch(filterDefect({
            page: page + 1,
            limit: rowsPerPage,
            project: filter.field.project,
            components: filter.field.components,
            assignee: filter.field.assignee,
            reporter: filter.field.reporter,
            server: filter.field.server,
            severity: filter.field.severity,
            status: filter.field.status,
            sortby: sort.sortby,
            order: sort.order,
            search: filter.field.search
        }))
            .unwrap()
            .then(() => {
                if (firstLoad) {
                    setLoading(false)
                    setFirstLoad(false)
                }
            })
        }
        
    }, [page, rowsPerPage, toRemove, sort.order, sort.sortby, filter.field]);

    // useEffect(() => {
    //     //reset filter state on load
    //     // dispatch(resetFilterState())
    //     setSearchField(filter.field.search)
    // }, [])

    useEffect(() => {
        if (searchField) {
            dispatch(setSearch(searchField));
        }
    }, [searchField])


    return (
        <>


            <Loader
                loading={loading}
            />

            {defects && defects.docs ?
                <Paper sx={{ width: '100%', mb: 2, mt: 2 }}>
                    <TextField
                        id="search-by-title"
                        label="Search by title"
                        type="search"
                        value={searchField}
                        variant="standard"
                        onChange={(e) => handleSearch(e)}
                        sx={{ float: 'right', mb: 3, mt: 1, mr: 1, overflow: 'hidden' }}
                    />
                    <TableContainer
                        className='defectListTableContainer'
                        sx={{ mt: 2, minWidth: '100%', maxHeight: 750 }}

                    >
                        <Table
                            className='defect-table'
                            size='small'
                            stickyHeader
                        >

                            <TableHead sx={{ whiteSpace: 'nowrap' }}>
                                <TableRow key={'header'}>

                                    {showColumn.menu ?
                                        <TableCell>Menu</TableCell>
                                        :
                                        null
                                    }

                                    {tableHeader.map((header, index) => (
                                        <Fragment key={`table-${header}-$`}>
                                            {showColumn[header] ?
                                                <TableCell
                                                    key={`table-${header}-$`}
                                                    sx={{ textAlign: 'center' }}

                                                >
                                                    <TableSortLabel
                                                        active={sortActive === header}
                                                        direction={sortActive === header ? orderActive : 'desc'}
                                                        onClick={() => {
                                                            handleOrder()
                                                            handleSort(header)
                                                        }}
                                                    >{changeHeaderText(header)}
                                                        {sortActive === header ? (
                                                            <Box component="span" sx={visuallyHidden}>
                                                                {orderActive === -1 ? 'sorted descending' : 'sorted ascending'}
                                                            </Box>
                                                        ) : null}
                                                    </TableSortLabel>
                                                </TableCell>
                                                :
                                                null
                                            }
                                        </Fragment>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody
                            >
                                {defects.docs.map((item, index) => (
                                    <TableRow key={item._id}
                                    >
                                        {showColumn.menu ?
                                            <TableCell
                                                key={`menu-${index}`}
                                                sx={{ textAlign: 'center', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    setDefectItem(item)
                                                    setShowMenu(true)
                                                    setAnchorEl(e.currentTarget)
                                                }}
                                            >
                                                <MenuIcon color='secondary' sx={{ '&:hover': { color: '#ce32e7' } }} /></TableCell>
                                            :
                                            null
                                        }


                                        {showColumn.defectid ?
                                            <TableCell key={`${item.defectid}-${index}`} sx={{ minWidth: '50px', textAlign: 'center' }}>
                                                <Typography
                                                    key={`${item.defectid}-${index}-typography`}
                                                    variant='body'
                                                    onClick={() => navigate(`/defect/view/${item.defectid}`)}
                                                    sx={{ color: 'blue', cursor: 'pointer' }}>{item.defectid}</Typography>
                                            </TableCell>
                                            :
                                            null
                                        }

                                        {showColumn.title ?
                                            <TableCell key={`${item.title}-${index}`} sx={{ minWidth: '350px', textAlign: 'center', overflowWrap: 'anywhere', textOverflow: 'ellipsis' }}>{item.title}</TableCell>
                                            :
                                            null
                                        }

                                        {showColumn.project ?
                                            <TableCell key={`${item.project}-${index}`} sx={{ minWidth: '150px', textAlign: 'center' }}>{item.project}</TableCell>
                                            :
                                            null
                                        }


                                        {showColumn.components ?
                                            <TableCell key={`${item.components}-${index}`} sx={{ minWidth: '150px', textAlign: 'center' }}>{item.components}</TableCell>
                                            :
                                            null
                                        }

                                        {showColumn.severity ?
                                            <TableCell key={`${item.severity}-${index}`} sx={{ width: '20px', textAlign: 'center' }}>
                                                <Box
                                                    key={`${item.severity}-${index}-box`}
                                                    sx={{ flexBasis: '100%', display: 'flex', justifyContent: 'center' }}>
                                                    {SeverityColorCode({ severity: item.severity, textWidth: '9rem' })}
                                                </Box>
                                            </TableCell>
                                            :
                                            null
                                        }
                                        {showColumn.status ?
                                            <TableCell key={`${item.status}-${index}`} sx={{ width: '20px', textAlign: 'center' }}>
                                                <Box
                                                    key={`${item.status}-${index}-box`}
                                                    sx={{ flexBasis: '100%', display: 'flex', justifyContent: 'center' }}>
                                                    {StatusColorCode({ status: item.status, textWidth: '6rem' })}
                                                </Box>
                                            </TableCell>
                                            :
                                            null
                                        }
                                        {showColumn.server ?
                                            <TableCell key={`${item.server}-${index}`} sx={{ minWidth: '50px', textAlign: 'center' }}>{item.server}</TableCell>
                                            :
                                            null
                                        }

                                        {showColumn.assigneeDetails && item.assigneeDetails ?

                                            <TableCell key={`${item.assigneeDetails.username}-${index}`} sx={{ minWidth: '150px', textAlign: 'center' }}>
                                                {item.assigneeDetails.map((user, index) => (
                                                    <Box key={`${user}-${index}`}>
                                                        <Chip
                                                            avatar={<Avatar alt={user.username} src={user.photoURL} />}
                                                            label={user.username}
                                                            variant="outlined"
                                                            sx={{ width: '100%', justifyContent: 'flex-start', m: 0.2 }}
                                                        />
                                                    </Box>
                                                ))}

                                            </TableCell>

                                            :
                                            null
                                        }

                                        {showColumn.reporter ?
                                            <TableCell key={`${item.reporter.username}-${index}`} sx={{ minWidth: '50px', textAlign: 'center', overflowWrap: 'break-word' }}>
                                                <Chip
                                                    key={`${item.reporter.username}-${index}-chip`}
                                                    avatar={<Avatar alt={item.reporter.username} src={item.reporter.photoURL} />}
                                                    label={item.reporter.username}
                                                    variant="outlined"
                                                    sx={{ width: '100%', justifyContent: 'flex-start', m: 0.2 }}
                                                />
                                            </TableCell>
                                            :
                                            null
                                        }
                                        {showColumn.createdDate ?
                                            <TableCell key={`${item.createdDate}-${index}`} sx={{ minWidth: '50px', textAlign: 'center' }}><Moment format="DD/MMM/YYYY">{item.createdDate}</Moment></TableCell>
                                            :
                                            null
                                        }
                                        {showColumn.lastUpdatedDate ?
                                            <TableCell key={`${item.lastUpdatedDate}-${index}`} sx={{ minWidth: '50px', textAlign: 'center' }}><Moment format="DD/MMM/YYYY">{item.lastUpdatedDate}</Moment></TableCell>
                                            :
                                            null
                                        }
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