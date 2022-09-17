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
import { getAuth, onAuthStateChanged } from "firebase/auth";


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
import Grid from '@mui/material/Grid';

const ViewDefect = () => {

    const viewTitleStyle = {
        // display: 'inline-block',
        marginLeft: '2rem',
        width: 'max-content',
        fontWeight: '600',
        color: 'mediumblue'
        // borderBottom: '1px dotted grey'
    }

    const viewValueStyle = {
        // display: 'inline-block',
        marginLeft: '1rem',
        fontWeight: '400',
        overflowWrap: 'anywhere',
        width: 'max-content'
    }

    const boxDescription = {
        border: '1px dotted black',
        margin: '1rem 0rem 2rem 2rem',
        flexBasis: '100%',
        minHeight: '300px',
        maxHeight: '500px',
        overflow: 'auto'
    }




    //paginate
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [commentTextArea, setCommentTextArea] = useState('')
    const [commented, setCommented] = useState(false)

    //Firebase
    const auth = getAuth();

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


    const currentDefect = useSelector(state => state.defects.current.defect)
    const currentAssignee = useSelector(state => state.defects.current.assignee)

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
        onAuthStateChanged(auth, (user) => {
            if (user) {
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
        })
    }


    const attachmentIcon = (filetype) => {
        let icon = <InsertDriveFileIcon />

        if (filetype.includes('image')) icon = <PhotoIcon />
        if (filetype.includes('pdf')) icon = <PictureAsPdfIcon />
        if (filetype.includes('audio')) icon = <AudioFileIcon />
        if (filetype.includes('video')) icon = <VideoFileIcon />
        if (filetype.includes('text')) icon = <ArticleIcon />
        if (filetype.includes('vnd.ms-excel')) icon = <ArticleIcon />
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
    }, [page, rowsPerPage])

    return (
        <Box>
            {currentDefect ?
                <Box className='defect_container' mt={5} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    
                    <Typography className='defect-id' sx={{ ml: '2rem', fontSize: '1.2rem', color: 'darkblue' }}>Defect ID:</Typography>
                    <Typography className='defect-id-value' sx={{ ml: '1rem', fontSize: '1.2rem', color: 'darkblue' }}>{currentDefect.defectid}</Typography>

                    {/* <Typography className='view-title' sx={viewTitleStyle}>Defect Summary:</Typography> */}

                    <Typography variant='h4' className='defect-summary' sx={{ flexBasis: '100%', m: '2rem' }}>{currentDefect.title}</Typography>



                    <Box flexBasis={'100%'}></Box>
                    <Typography m={3} fontWeight={600} fontSize={'1.2rem'} flexBasis={'100%'} sx={{ color: '#339e31' }}>Details: </Typography>

                    <Box flexBasis={'15%'} id="defectDetailsTitleViewLeft">
                        <Typography className='view-title' sx={viewTitleStyle}>Type:</Typography>
                        <Typography className='view-title' sx={viewTitleStyle}>Project:</Typography>
                        <Typography className='view-title' sx={viewTitleStyle}>Components:</Typography>
                    </Box>


                    <Box flexBasis={'25%'} alignContent={'center'} display={'flex'} flexDirection={'column'}
                    id="defectDetailsValueViewLeft"
                    >
                        <Typography className='view-value' sx={viewValueStyle}>{currentDefect.issuetype}</Typography>
                        <Typography className='view-value' sx={viewValueStyle}>{currentDefect.project}</Typography>
                        <Typography className='view-value' sx={viewValueStyle}>{currentDefect.components}</Typography>
                    </Box>
                    <Box flexBasis={'20%'}></Box>

                    <Box flexBasis={'15%'} id="defectDetailsTitleViewRight">
                        <Typography className='view-title' sx={viewTitleStyle}>Status:</Typography>
                        <Typography className='view-title' sx={viewTitleStyle}>Server:</Typography>
                        <Typography className='view-title' sx={viewTitleStyle}>Severity:</Typography>
                    </Box>


                    <Box flexBasis={'25%'} alignContent={'center'} display={'flex'} flexDirection={'column'}
                     id="defectDetailsValueViewRight"
                    >
                        <Typography className='view-value' sx={viewValueStyle}>{currentDefect.status}</Typography>
                        <Typography className='view-value' sx={viewValueStyle}>{currentDefect.server}</Typography>
                        <Typography className='view-value' sx={viewValueStyle}>{currentDefect.severity}</Typography>
                    </Box>



                    <Box flexBasis={'100%'}></Box>

                    <Typography mt={8} ml={3} fontWeight={600} fontSize={'1.2rem'} sx={{ color: '#339e31' }}>Description: </Typography>
                    <Box sx={boxDescription}>

                        <div className='defect-description' style={{ margin: '2rem' }}>
                            <div dangerouslySetInnerHTML={
                                { __html: htmlDecode(currentDefect.description) }
                            }>
                            </div>
                        </div>
                    </Box>

                    <Box flexBasis={'100%'}></Box>

                    <List className='card' sx={{ ml: 3, mb: 3, flexBasis: '100%' }}>

                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <Typography>Assignee:</Typography>
                            <div>
                                {currentAssignee.map((item, index) => (
                                    <Chip
                                        key={`${item.username + index}`}
                                        item={item.username}
                                        label={item.username}
                                        color="primary"
                                        className='chip'
                                        avatar={<Avatar alt={item.username} src={item.photoURL} />}
                                        variant='outlined'
                                        sx={{ ml: 2 }}
                                    />
                                ))}
                            </div>
                        </ListItem>
                    </List>


                    <Box className="createdOn" sx={{ display: 'flex', flexBasis: '100%', justifyContent: 'flex-end' }}>
                        <Typography className='view-title' sx={{ fontWeight: '300' }}>Created on:</Typography>

                        <Typography className='view-value' sx={{
                            marginLeft: '1rem',
                            fontWeight: '600',
                            overflowWrap: 'anywhere'
                        }}><Moment format="DD/MMM/YYYY HH:MMA">{currentDefect.createdDate}</Moment></Typography>
                    </Box>

                    <Box className="createdBy" sx={{ display: 'flex', flexBasis: '100%', justifyContent: 'flex-end' }}>
                        <Typography className='view-title' sx={{ fontWeight: '300' }}>Created by:</Typography>
                        <Typography className='view-value'
                            sx={{
                                marginLeft: '1rem',
                                fontWeight: '600',
                                overflowWrap: 'anywhere'
                            }}>{currentDefect.reporter}</Typography>
                    </Box>

                    <Box flexBasis={'100%'}></Box>



                    <Box sx={{ display: 'flex', maxHeight: '250px', overflow: 'auto', flexBasis: '100%' }}>
                        <List
                            className='attachment' sx={{ ml: 3, mt: 2 }}>

                            <Typography fontWeight={600} fontSize={'1.2rem'} sx={{ color: '#339e31' }}>Attachment:  </Typography>
                            {currentDefect.attachment.length ? "" : <Typography sx={{ fontWeight: '200', mt: 2 }}>No attachment</Typography>}
                            {currentDefect.attachment.map((item, index) => (
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

                                    {item.type.includes('video/mp4') ?
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

                                    {item.type.includes('text') || item.type.includes('vnd.ms-excel') ?
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

                    <Typography mt={7} ml={3} fontWeight={600} fontSize={'1.2rem'} sx={{ color: '#339e31' }}>Comment:  </Typography>
                    <Paper sx={{ width: '100%', overflow: 'hidden', mt: 3, ml: 3 }}>
                        {comments.comments.totalDocs < 1 ? <Typography sx={{ fontWeight: '200', mt: 2 }}>There are no comment yet</Typography> :
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {/* <TableCell>User</TableCell> */}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {!comments.comments.docs ? '' : comments.comments.docs.map((item, index) => (
                                            <TableRow key={'comment' + index}>
                                                <TableCell key={item.user[0].username} sx={{ wordWrap: 'break-word', overflow: 'auto', maxWidth: '100px' }}>

                                                    <Paper sx={{ display: 'flex', flexWrap: 'wrap', p: '1rem' }}>
                                                        <Avatar alt={item.user[0].username} src={item.user[0].photoURL} sx={{ height: '50px', width: '50px' }} />
                                                        <Typography sx={{ m: '1rem' }}>{item.user[0].username}</Typography>

                                                        <Typography sx={{ m: '1rem' }}><Moment format="DD/MMM/YYYY , HH:MM:SS">{item.date}</Moment></Typography>
                                                        <Typography sx={{ flexBasis: '100%', m: '2rem' }}>{item.comment}</Typography>
                                                    </Paper>

                                                </TableCell>
                                                {/* <TableCell key={item.comment} sx={{ wordWrap: 'break-word', overflow: 'auto', maxWidth: '200px' }}>{item.comment}</TableCell> */}
                                                {/* <TableCell key={item.date}><Moment format="DD/MMM/YYYY , HH:MM:SS">{item.date}</Moment></TableCell> */}
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
                        }
                    </Paper>

                    <Box
                        className='commentSection'
                        component="form"
                        noValidate
                        autoComplete='off'
                        autoCorrect="true"
                        sx={{ display: 'flex', flexBasis: '100%', mt: '1rem', ml: '1rem' }}

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
                    </Box>

                    <Box className='addCommentBtn' sx={{ flexBasis: '100%' }}>
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



        </Box >
    )
}

export default ViewDefect