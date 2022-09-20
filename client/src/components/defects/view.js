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
import History from './history';

//function
import {calcuDateDiff} from '../../../src/utils/tools'


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
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import moment from 'moment';

const ViewDefect = () => {


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

    //show/hide defect details
    const [showDefectDetails, setShowDefectDetails] = useState(true);
    const [showDescription, setShowDescription] = useState(true);
    const [showAssignee, setShowAssignee] = useState(true);
    const [showAttachment, setShowAttachment] = useState(true);
    const [showComment, setShowComment] = useState(false);



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

                    <Box className="createdOn" sx={{ display: 'flex', flexBasis: '100%', justifyContent: 'flex-end'}}>

                        {/* if it is not converted(showing iso date), use Created on */}
                        {!String(calcuDateDiff(currentDefect.createdDate)).includes("ago") ?
                            <Typography className='view-title' sx={{ fontWeight: '300' }}>Created on: </Typography>
                            :
                            <Typography className='view-title' sx={{ fontWeight: '300' }}>Created: </Typography>
                        }

                        <Typography className='view-value' sx={{
                            fontWeight: '600',
                            overflowWrap: 'anywhere'
                        }}>&nbsp; {calcuDateDiff(currentDefect.createdDate)}</Typography>

                        <Typography className='view-title' sx={{ fontWeight: '300' }}>&nbsp; by</Typography>
                        <Typography className='view-value' sx={{ fontWeight: '600' }}>&nbsp;{currentDefect.reporter}</Typography>
                    </Box>


                    <Typography variant='h4' className='defect-summary' sx={{ flexBasis: '100%', m: '2rem' }}>{currentDefect.title}</Typography>



                    <Box flexBasis={'100%'}></Box>
                    <Typography className="defectSubHeader" m={3} flexBasis={'100%'}>
                        {showDefectDetails ?
                            <Tooltip title="Hide defect details">
                                <ArrowCircleDownIcon
                                    onClick={() => setShowDefectDetails(false)}
                                    sx={{ marginTop: '1rem', marginRight: '1rem' }} />
                            </Tooltip>
                            :
                            <Tooltip title="Show defect details">
                                <ArrowCircleUpIcon
                                    onClick={() => setShowDefectDetails(true)}
                                    sx={{ marginTop: '1rem', marginRight: '1rem' }} />
                            </Tooltip>
                        }
                        Details:
                    </Typography>

                    {showDefectDetails ?
                        <Box className='defectViewDetails' sx={{ display: 'flex', flexBasis: '100%', flexWrap: 'wrap' }}>
                            <Box flexBasis={'15%'} id="defectDetailsTitleViewLeft">
                                <Typography className='defectDetailsKey'>Type:</Typography>
                                <Typography className='defectDetailsKey'>Project:</Typography>
                                <Typography className='defectDetailsKey'>Components:</Typography>
                            </Box>


                            <Box flexBasis={'25%'} alignContent={'center'} display={'flex'} flexDirection={'column'}
                                id="defectDetailsValueViewLeft"
                            >
                                <Typography className='defectDetailsValue'>{currentDefect.issuetype}</Typography>
                                <Typography className='defectDetailsValue'>{currentDefect.project}</Typography>
                                <Typography className='defectDetailsValue'>{currentDefect.components}</Typography>
                            </Box>
                            <Box flexBasis={'20%'}></Box>

                            <Box flexBasis={'15%'} id="defectDetailsTitleViewRight">
                                <Typography className='defectDetailsKey'>Status:</Typography>
                                <Typography className='defectDetailsKey'>Server:</Typography>
                                <Typography className='defectDetailsKey'>Severity:</Typography>
                            </Box>


                            <Box flexBasis={'25%'} alignContent={'center'} display={'flex'} flexDirection={'column'}
                                id="defectDetailsValueViewRight"
                            >
                                <Typography className='defectDetailsValue'>{currentDefect.status}</Typography>
                                <Typography className='defectDetailsValue'>{currentDefect.server}</Typography>
                                <Typography className='defectDetailsValue'>{currentDefect.severity}</Typography>
                            </Box>

                        </Box>
                        :
                        null
                    }



                    <Box flexBasis={'100%'}></Box>



                    <Typography className="defectSubHeader" mt={8} ml={3}>
                        {showDescription ?
                            <Tooltip title="Hide description">
                                <ArrowCircleDownIcon
                                    onClick={() => setShowDescription(false)}
                                    sx={{ marginTop: '1rem', marginRight: '1rem' }} />
                            </Tooltip>
                            :
                            <Tooltip title="Show description">
                                <ArrowCircleUpIcon
                                    onClick={() => setShowDescription(true)}
                                    sx={{ marginTop: '1rem', marginRight: '1rem' }} />
                            </Tooltip>
                        }
                        Description: </Typography>



                    {showDescription ?
                        <Box sx={boxDescription}>
                            <div className='defect-description' style={{ margin: '2rem' }}>
                                <div dangerouslySetInnerHTML={
                                    { __html: htmlDecode(currentDefect.description) }
                                }>
                                </div>
                            </div>
                        </Box>
                        :
                        null
                    }

                    <Box flexBasis={'100%'}></Box>

                    <Typography className="defectSubHeader" mt={4} mb={2} ml={3}>
                        {showAssignee ?
                            <Tooltip title="Hide assignee">
                                <ArrowCircleDownIcon
                                    onClick={() => setShowAssignee(false)}
                                    sx={{ marginTop: '1rem', marginRight: '1rem' }} />
                            </Tooltip>
                            :
                            <Tooltip title="Show assignee">
                                <ArrowCircleUpIcon
                                    onClick={() => setShowAssignee(true)}
                                    sx={{ marginTop: '1rem', marginRight: '1rem' }} />
                            </Tooltip>
                        }
                        Assignee: </Typography>


                    {showAssignee ?
                        <List className='card' sx={{ ml: 3, mb: 3, flexBasis: '100%' }}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                {/* <Typography>Assignee:</Typography> */}
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
                        :
                        null
                    }




                    <Box flexBasis={'100%'}></Box>

                    <Typography className="defectSubHeader" m={3} flexBasis={'100%'}>
                        {showAttachment ?
                            <Tooltip title="Hide attachment">
                                <ArrowCircleDownIcon
                                    onClick={() => setShowAttachment(false)}
                                    sx={{ marginTop: '1rem', marginRight: '1rem' }} />
                            </Tooltip>
                            :
                            <Tooltip title="Show attachment">
                                <ArrowCircleUpIcon
                                    onClick={() => setShowAttachment(true)}
                                    sx={{ marginTop: '1rem', marginRight: '1rem' }} />
                            </Tooltip>
                        }
                        Attachment:
                    </Typography>

                    {showAttachment ?
                        <Box sx={{ display: 'flex', maxHeight: '250px', overflow: 'auto', flexBasis: '100%' }}>
                            <List
                                className='attachment' sx={{ ml: 3, mt: 2 }}>



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
                        :
                        null
                    }


                   
                    <History></History>
                    
                    <Typography className="defectSubHeader" m={3} flexBasis={'100%'}>
                        {showComment ?
                            <Tooltip title="Hide comment">
                                <ArrowCircleDownIcon
                                    onClick={() => setShowComment(false)}
                                    sx={{ marginTop: '1rem', marginRight: '1rem' }} />
                            </Tooltip>
                            :
                            <Tooltip title="Show comment">
                                <ArrowCircleUpIcon
                                    onClick={() => setShowComment(true)}
                                    sx={{ marginTop: '1rem', marginRight: '1rem' }} />
                            </Tooltip>
                        }
                        Comment:
                    </Typography>

                    {showComment ?
                    <>
                    <Paper sx={{ width: '100%', overflow: 'hidden', mt: 3, ml: 3 }}>
                        {comments.comments.totalDocs < 1 ? <Typography sx={{ fontWeight: '200', mt: 2 }}>There are no comment yet</Typography> :
                            <Box sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer sx={{ maxHeight: 540 }}>
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

                                                            <Typography sx={{ m: '1rem' }}>{calcuDateDiff(item.date)}</Typography>
                                                            <Typography sx={{ flexBasis: '100%', m: '2rem' }}>{item.comment}</Typography>
                                                        </Paper>

                                                    </TableCell>
                                                    {/* <TableCell key={item.comment} sx={{ wordWrap: 'break-word', overflow: 'auto', maxWidth: '200px' }}>{item.comment}</TableCell> */}
                                                    {/* <TableCell key={item.date}><Moment format="DD/MMM/YYYY , HH:MM:SS">{item.date}</Moment></TableCell> */}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>



                                <TablePagination
                                    component="div"
                                    rowsPerPageOptions={[3, 10]}
                                    rowsPerPage={rowsPerPage}
                                    colSpan={3}
                                    count={comments.comments.totalDocs}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />

                            </Box>

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
                                    .then(() => {
                                        dispatch(getCommentByDefectIdPaginate({ defectId: defectId }))
                                    })
                                setCommentTextArea('')
                            }}
                        >Add</Button>

         

                    </Box>
                    </>
                        :
                        null
                    }

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