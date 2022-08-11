//Lib
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Loader, htmlDecode } from '../../../utils/tools';
import { useDispatch, useSelector } from 'react-redux'
import Moment from 'react-moment'

//Comp
import { getDefectById } from '../../../store/actions/defects';
import { addComment, getCommentByDefectIdPaginate } from '../../../store/actions/comments';
import { saveAs } from "file-saver";

//MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import ExtensionIcon from '@mui/icons-material/Extension';
import TimelineIcon from '@mui/icons-material/Timeline';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button'
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination';
import { Tab, TableBody, TableFooter, TextField } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IconButton from '@mui/material/IconButton'

const ViewDefect = () => {

    const viewTitleStyle = {
        display: 'inline-block',
        marginLeft: '2rem'
    }

    const viewValueStyle = {
        display: 'inline-block',
        marginLeft: '2rem',
        fontWeight: '600',
        overflowWrap: 'anywhere'
    }

    const boxDescription = {
        border: '1px solid black',
        margin: '2rem',
        minWidth: '200px',
        minHeight: '300px',
        maxHeight: '500px',
        overflow: 'auto'
    }

    //paginate
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [commentTextArea, setCommentTextArea] = useState('')
    const [commented, setCommented] = useState(false)


    const defects = useSelector(state => state.defects)
    const comments = useSelector(state => state.comments)
    const dispatch = useDispatch();
    const { defectId } = useParams();


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const handleCommentTextArea = (event) => {
        setCommentTextArea(event.target.value);
    }

    const handleDownload = async(downloadURL) => {
        saveAs(downloadURL)
      }


    useEffect(() => {
        dispatch(getCommentByDefectIdPaginate({ defectId: defectId }))
        dispatch(getDefectById(defectId))
    }, [defectId, dispatch])

    useEffect(() => {
        dispatch(getCommentByDefectIdPaginate({ page: page + 1, limit: rowsPerPage, defectId: defectId }))
        setCommented(false)
    }, [page, rowsPerPage, commented])

    return (
        <Box>
            {defects && defects.current ?
                <Box className='defect_container' mt={5} >

                    <Typography className='view-title' sx={viewTitleStyle}>Title:</Typography>
                    <Typography className='view-value' sx={viewValueStyle}>{defects.current.title}</Typography>
                    <Divider></Divider>

                    <Typography className='view-title' sx={viewTitleStyle}>Defect ID:</Typography>
                    <Typography className='view-value' sx={viewValueStyle}>{defects.current.defectid}</Typography>
                    <Divider></Divider>
                    <Typography className='view-title' sx={viewTitleStyle}>Status:</Typography>
                    <Typography className='view-value' sx={viewValueStyle}>{defects.current.status}</Typography>

                    <Divider></Divider>
                    <Typography className='view-title' sx={viewTitleStyle}>Project:</Typography>
                    <Typography className='view-value' sx={viewValueStyle}>{defects.current.project}</Typography>
                    <Divider></Divider>

                    <Typography className='view-title' sx={viewTitleStyle}>Components:</Typography>

                    <Tooltip title={defects.current.components}>
                        <Typography className='view-value' sx={viewValueStyle}>{defects.current.components}</Typography>
                    </Tooltip>

                    <Divider></Divider>

                    <Typography className='view-title' sx={viewTitleStyle}>Server:</Typography>
                    <Typography className='view-value' sx={viewValueStyle}>{defects.current.server}</Typography>

                    <Divider></Divider>
                    <Typography className='view-title' sx={viewTitleStyle}>Issue Type:</Typography>
                    <Typography className='view-value' sx={viewValueStyle}>{defects.current.issuetype}</Typography>
                    <Divider></Divider>

                    <Typography className='view-title' sx={viewTitleStyle}>Severity:</Typography>
                    <Typography className='view-value' sx={viewValueStyle}>{defects.current.severity}</Typography>


                    <Box sx={boxDescription}>
                        <Typography>Description: </Typography>
                        <div className='defect-description' style={{ margin: '2rem' }}>
                            <div dangerouslySetInnerHTML={
                                { __html: htmlDecode(defects.current.description) }
                            }>
                            </div>
                        </div>
                    </Box>

                    <Typography className='view-title' sx={viewTitleStyle}>Created on:</Typography>
                    <Typography className='view-value' sx={viewValueStyle}><Moment format="DD/MMM/YYYY HH:MMA">{defects.current.date}</Moment></Typography>


                    <Typography className='view-title' sx={viewTitleStyle}>Created by:</Typography>
                    <Typography className='view-value' sx={viewValueStyle}>{defects.current.reporter}</Typography>


                    <List className='card' sx={{ ml: 3, mt: 2 }}>

                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <Typography>Assignee:</Typography>
                            <div>
                                {defects.current.assignee.map((item, index) => (
                                    <Chip
                                        key={`${item + index}`}
                                        item={item}
                                        label={item}
                                        color="primary"
                                        className='chip'
                                        sx={{ m: 0.5 }}
                                    />
                                ))}
                            </div>
                        </ListItem>
                    </List>

                    <Box sx={{ display: 'flex', maxHeight: '250px', overflow: 'auto' }}>
                        <List
                            className='attachment' sx={{ ml: 3, mt: 2 }}>
                            <Typography>Attachment: </Typography>
                            {defects.current.attachment.map((item, index) => (
                                <ListItem
                                    key={`${item.name}_${item.lastModified}`}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            color='primary'
                                            onClick={() => handleDownload(item.downloadURL)}
                                        >
                                            <FileDownloadIcon primary />
                                        </IconButton>}
                                >
                                    <ListItemIcon>
                                        <InsertDriveFileIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.name}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    <Typography mt={3} ml={3}>Comment:</Typography>
                    <Paper sx={{ width: '100%', overflow: 'hidden', mt: 3, ml: 3 }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Comment</TableCell>
                                        <TableCell>Commented on</TableCell>

                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {comments.comments.docs.map((item, index) => (
                                        <TableRow key={'comment' + index}>
                                            <TableCell key={item.user} sx={{ wordWrap: 'break-word', overflow: 'auto', maxWidth: '200px' }}>{item.user}</TableCell>
                                            <TableCell key={item.comment} sx={{ wordWrap: 'break-word', overflow: 'auto', maxWidth: '200px' }}>{item.comment}</TableCell>
                                            <TableCell key={item.date}><Moment format="DD/MMM/YYYY , HH:MM:SS">{item.date}</Moment></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[3, 10]}
                                            rowsPerPage={rowsPerPage}
                                            colSpan={3}
                                            count={comments.comments.totalDocs}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Paper>

                    <Box
                        className='addComment'
                        component="form"
                        noValidate
                        autoComplete='off'
                        autoCorrect="true"
                        mt={5}

                    >
                        <TextField className='commentTextArea'
                            placeholder='Add a comment'
                            value={commentTextArea}
                            label="Comment"
                            multiline
                            rows={2}
                            sx={{ width: '100%' }}
                            onChange={(e) => handleCommentTextArea(e)}
                        >

                        </TextField>

                        <Button
                            variant='outlined'
                            sx={{ float: 'right', width: '10rem', mt: 1 }}
                            onClick={() => {
                                dispatch(addComment({ defectId, comment: commentTextArea }))
                                    .unwrap()
                                    .then(setCommented(true))
                                setCommentTextArea('')
                            }}
                        >Add</Button>

                    </Box>

                </Box>
                : null}



        </Box>
    )
}

export default ViewDefect