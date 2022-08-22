//Lib
import { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { htmlDecode } from '../../utils/tools';

//Comp
import { addComment, getCommentByDefectIdPaginate } from '../../store/actions/comments';
import { getDefectById } from '../../store/actions/defects';
import ModalComponent from '../../utils/modal/modal';

//firebase
import { getBlob, getDownloadURL, getStorage, ref } from "firebase/storage";

//MUI
import ArticleIcon from '@mui/icons-material/Article';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PersonIcon from '@mui/icons-material/Person';
import PhotoIcon from '@mui/icons-material/Photo';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PreviewIcon from '@mui/icons-material/Preview';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import { TableBody, TableFooter, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

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

    //Modal
    const [openModal, setOpenModal] = useState(false);

    //Preview
    const [previewTitle, setPreviewTitle] = useState('')

    const [showImage, setShowImage] = useState(false);
    const [previewImageURL, setPreviewImageURL] = useState('');

    const [showVideo, setShowVideo] = useState(false);
    const [previewVideoURL, setPreviewVideoURL] = useState('');

    const [showAudio, setShowAudio] = useState(false);
    const [previewAudioURL, setPreviewAudioURL] = useState('');

    const [showDoc, setShowDoc] = useState(false);
    const [previewDocContent, setPreviewDocContent] = useState('');


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

    const handleDownload = async (downloadURL) => {
        const storage = getStorage();
        const storageRef = ref(storage, downloadURL)
        getDownloadURL(storageRef)
            .then((url) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    const a = document.createElement('a');
                    a.href = window.URL.createObjectURL(xhr.response);
                    a.download = storageRef.name;
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    var blob = xhr.response;
                };
                xhr.open('GET', url);
                xhr.send();

            })
            .catch((error) => {
                console.log(error)
            });

    }

    const handlePreview = async (downloadURL, itemType) => {
        const storage = getStorage();
        const storageRef = ref(storage, downloadURL)
        getDownloadURL(storageRef)
            .then((url) => {
                const xhr = new XMLHttpRequest();
                let blob = ''
                let fileURL = ''
                xhr.responseType = 'blob';
                xhr.onload = async (event) => {

                    switch (itemType) {
                        case 'Image':
                            setPreviewImageURL(url)
                            setPreviewTitle(storageRef.name)
                            setShowImage(true)
                            break;
                        case 'Video':
                            setPreviewVideoURL(url)
                            setPreviewTitle(storageRef.name)
                            setShowVideo(true)
                            break;
                        case 'Audio':
                            setPreviewAudioURL(url)
                            setPreviewTitle(storageRef.name)
                            setShowAudio(true)
                            break;
                        case 'Pdf':
                            blob = getBlob(storageRef)
                            fileURL = URL.createObjectURL(await blob);
                            window.open(fileURL);
                            break;
                        case 'Text':
                            blob = getBlob(storageRef)
                            fileURL = URL.createObjectURL(await blob);
                            const reader = new FileReader();
                            reader.onload = function (event) {
                                setPreviewDocContent(event.target.result)
                                setPreviewTitle(storageRef.name)
                                setShowDoc(true)
                                console.log(event.target.result)

                            }
                            reader.readAsText(new File([await blob], {
                                type: "text/plain",
                            }))



                        default:
                            break;
                    }
                };
                xhr.open('GET', url);
                xhr.send();

            })
            .then(() => {
                //pdf type open in new tab
                if (itemType !== 'Pdf') setOpenModal(true)
            })
            .catch((error) => {
                console.log(error)
            });

    }

    const attachmentIcon = (filetype) => {
        let icon = <InsertDriveFileIcon />

        if (filetype.includes('image')) icon = <PhotoIcon />
        if (filetype.includes('pdf')) icon = <PictureAsPdfIcon />
        if (filetype.includes('audio')) icon = <AudioFileIcon />
        if (filetype.includes('video')) icon = <VideoFileIcon />
        if (filetype.includes('text')) icon = <ArticleIcon />
        if (filetype.includes('zip') || filetype.includes('7z') || filetype.includes('gz')
            || filetype.includes('rar') || filetype.includes('tar')) icon = <FolderZipIcon />


        return (
            <ListItemIcon>
                {icon}
            </ListItemIcon>
        )
    }

    useEffect(() => {

        //clear preview state on modal close
        if (openModal === false) {
            setShowImage(false);
            setPreviewTitle('')
            setPreviewImageURL('');
            setShowVideo(false);
            setPreviewVideoURL('');
            setShowAudio(false);
            setPreviewAudioURL('');
            setShowDoc(false);
            setPreviewDocContent('');
        }
    }, [openModal])

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
                                        <Tooltip title="Download">
                                            <IconButton
                                                edge="end"
                                                aria-label="download"
                                                color='primary'
                                                onClick={() => {
                                                    console.log(item.type)
                                                    handleDownload(item.downloadURL)
                                                }}
                                            >
                                                <FileDownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                >
                                    {attachmentIcon(item.type)}
                                    <ListItemText
                                        primary={item.name}
                                    />

                                    {item.type.includes('image') ?
                                        <Tooltip title="Preview image">
                                            <IconButton
                                                onClick={() => {
                                                    handlePreview(item.downloadURL, 'Image')
                                                }
                                                }
                                                sx={{ color: 'rebeccapurple' }}
                                            >
                                                <PreviewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        :
                                        null
                                    }

                                    {item.type.includes('video') ?
                                        <Tooltip title="Preview video">
                                            <IconButton
                                                onClick={() => {
                                                    handlePreview(item.downloadURL, 'Video')
                                                }
                                                }
                                                sx={{ color: 'rebeccapurple' }}
                                            >
                                                <PreviewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        :
                                        null
                                    }


                                    {item.type.includes('audio') ?
                                        <Tooltip title="Preview audio">
                                            <IconButton
                                                onClick={() => {
                                                    handlePreview(item.downloadURL, 'Audio')
                                                }
                                                }
                                                sx={{ color: 'rebeccapurple' }}
                                            >
                                                <PreviewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        :
                                        null
                                    }

                                    {item.type.includes('pdf') ?
                                        <Tooltip title="Preview document">
                                            <IconButton
                                                onClick={() => {
                                                    handlePreview(item.downloadURL, 'Pdf')
                                                }
                                                }
                                                sx={{ color: 'rebeccapurple' }}
                                            >
                                                <PreviewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        :
                                        null
                                    }

                                    {item.type.includes('text') ?
                                        <Tooltip title="Preview document">
                                            <IconButton
                                                onClick={() => {
                                                    handlePreview(item.downloadURL, 'Text')
                                                }
                                                }
                                                sx={{ color: 'rebeccapurple' }}
                                            >
                                                <PreviewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        :
                                        null
                                    }

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
                                    {!comments.comments.docs ? '' : comments.comments.docs.map((item, index) => (
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

                    <ModalComponent
                        open={openModal}
                        setOpenModal={setOpenModal}
                        title={previewTitle}
                        showImage={showImage}
                        showVideo={showVideo}
                        showAudio={showAudio}
                        showDoc={showDoc}
                        image={previewImageURL}
                        video={previewVideoURL}
                        audio={previewAudioURL}
                        doc={previewDocContent}

                        titleColor="black"
                    >
                    </ModalComponent>

                </Box>
                : null}



        </Box>
    )
}

export default ViewDefect