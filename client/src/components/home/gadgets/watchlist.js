//lib
import { useState, useEffect, Fragment } from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'react-moment'

//comp
import { StatusColorCode, SeverityColorCode } from '../../../utils/tools';
import { getWatchlistDefectList, updateFieldFilter } from "../../../store/actions/watchlist";
import WatchlistColumnFilter from "./watchlistColumnFilter";
import { deleteDefect } from "../../../store/actions/defects";
import ModalComponent from "../../../utils/modal/modal";
import { setOrder, setSearch, setSortBy } from "../../../store/reducers/watchlist";

//mui
import Box from "@mui/material/Box"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from "@mui/material/IconButton";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ViewWeekRoundedIcon from '@mui/icons-material/ViewWeekRounded';
import FilterListIcon from '@mui/icons-material/FilterList';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MenuIcon from '@mui/icons-material/Menu';
import WatchlistDefectFilter from "./watchlistDefectFilter";

const Watchlist = ({

}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [settingAnchorEl, setSettingAnchorEl] = useState(null);
    const [columnFilterAnchor, setColumnFilterAnchor] = useState()
    const [defectFilterAnchor, setDefectFilterAnchor] = useState()
    const settingMenuOpen = Boolean(settingAnchorEl);

    const users = useSelector(state => state.users)
    const defectList = useSelector(state => state.watchlist.defectList.data)
    const showColumn = useSelector(state => state.watchlist.defectList.filter.showColumn)
    const filter = useSelector(state => state.watchlist.defectList.filter)
    const sort = useSelector(state => state.watchlist.defectList.filter.sort)

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
            dispatch(setOrder(1));
        } else if (orderActive === 'asc') {
            setOrderActive('desc');
            dispatch(setOrder(-1));
        }
    }

    const handleSort = (header) => {
        setSortActive(header);
        dispatch(setSortBy(header));
    }

    const handleSearch = (event) => {
        setSearchField(event.target.value)
        dispatch(setSearch(event.target.value))
    }

    //table pagination
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



    //Defect Menu
    const [defectItem, setDefectItem] = useState({})
    const [showMenu, setShowMenu] = useState(false)
    const [defectMenuAnchorEl, setDefectMenuAnchorEl] = useState(null);

    const DefectMenu = ({
        defect
    }) => {
        return (
            <>
                <Menu
                    id="defect-menu"
                    open={showMenu}
                    onClose={() => setShowMenu(false)}
                    anchorEl={defectMenuAnchorEl}
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


    //modal
    const [openModal, setOpenModal] = useState(false);

    const handleModalConfirm = (toRemove) => {
        dispatch(deleteDefect({ defectId: toRemove }))
        setToRemove(null)
    }

    //watchlist
    //show/hide settings

    const handleColumnFilter = (event) => {
        setColumnFilterAnchor(columnFilterAnchor ? null : event.currentTarget);
    }

    const handleDefectFilter = (event) => {
        setDefectFilterAnchor(defectFilterAnchor ? null : event.currentTarget);
    }

    const handleSettingClick = (event) => {
        setSettingAnchorEl(event.currentTarget)
    }

    const handleSettingClose = () => {
        setSettingAnchorEl(null)
    }

    // useEffect(() => {
    //     dispatch(getWatchlistDefectList({ watchlist: users.email }))
    // }, [])

    useEffect(() => {

        if (firstLoad) {
            setLoading(true)
        }

        if(!filter.filtering && !loading){
        dispatch(getWatchlistDefectList({
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
            search: filter.field.search,
            watchlist: users.email
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

   
    useEffect(() => {
        if (searchField) {
            dispatch(setSearch(searchField));
        }
    }, [searchField])


 


    return (



        <Box sx={{ height: '100%' }}>



            <Box className="widget-header" mt={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>

                < Typography mb={1} sx={{ textAlign: 'left', flexBasis: '95%', alignSelf: 'flex-end', color: '#00008b', fontSize: '150%' }}> Watchlist </Typography >

                <IconButton
                    id="setting-button"
                    onClick={handleSettingClick}
                    sx={{ flexBasis: '5%' }}
                >
                    <SettingsIcon color="b"/>
                </IconButton>
                <Menu
                    id="setting-menu"
                    anchorEl={settingAnchorEl}
                    open={settingMenuOpen}
                    onClose={handleSettingClose}
                >

                    <MenuItem
                    onClick={handleDefectFilter}>
                        <ListItemIcon>
                            <FilterListIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Filter</ListItemText>
                    </MenuItem>

                    <MenuItem
                        onClick={handleColumnFilter}>
                        <ListItemIcon>
                            <ViewWeekRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Column</ListItemText>
                    </MenuItem>

                </Menu>

            </Box>

            {defectList.docs ?
                <Paper sx={{ width: '100%', mb: 2, mt: 2, height: "calc(100% - 100px)" }}>
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
                        sx={{ mt: 2, minWidth: '100%', height: 'calc(100% - 150px)' }}

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
                                {defectList.docs.map((item, index) => (
                                    <TableRow key={item._id}
                                    >
                                        {showColumn.menu ?
                                            <TableCell
                                                key={`menu-${index}`}
                                                sx={{ textAlign: 'center', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    setDefectItem(item)
                                                    setShowMenu(true)
                                                    setDefectMenuAnchorEl(e.currentTarget)
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
                        count={defectList.totalDocs}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                </Paper>
                :
                <Typography>There is no defect in your watchlist</Typography>
            }

            <WatchlistDefectFilter
                defectFilterAnchor={defectFilterAnchor}
                setDefectFilterAnchor={setDefectFilterAnchor}
            >

            </WatchlistDefectFilter>

            <WatchlistColumnFilter
                columnFilterAnchor={columnFilterAnchor}
                setColumnFilterAnchor={setColumnFilterAnchor}

            />

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

        </Box >



    )

}

export default Watchlist