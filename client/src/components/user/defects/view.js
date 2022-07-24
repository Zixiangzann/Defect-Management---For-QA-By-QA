//Lib
import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Loader, htmlDecode } from '../../../utils/tools';
import { useDispatch, useSelector } from 'react-redux'
import Moment from 'react-moment'

//Comp
import { getDefectById } from '../../../store/actions/defects';

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

// import ScoreCard from '../../utils/scoreCard';

const ViewDefect = () => {

    const viewTitleStyle = {
        display: 'inline-block',
        marginLeft: '2rem'
    }

    const viewValueStyle = {
        display: 'inline-block',
        marginLeft: '2rem',
        fontWeight: '600',
        overflowWrap:'anywhere'
    }

    const boxDescription = {
        border: '1px solid black',
        margin:'2rem',
        minWidth: '200px',
        minHeight: '300px',
        maxHeight: '500px',
        overflow: 'auto'
    }


    const defects = useSelector(state => state.defects)
    const dispatch = useDispatch();
    const { defectId } = useParams();

    useEffect(() => {
        dispatch(getDefectById(defectId))
    }, [defectId, dispatch])

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
                        <Typography>
                            <div className='defect-description' style={{ margin: '2rem' }}>
                                <div dangerouslySetInnerHTML={
                                    { __html: htmlDecode(defects.current.description) }
                                }>
                                </div>
                            </div></Typography>
                    </Box>
                   
                    <Typography className='view-title' sx={viewTitleStyle}>Created on:</Typography>
                    <Typography className='view-value' sx={viewValueStyle}><Moment format="DD/MMM/YYYY HH:MMA">{defects.current.date}</Moment></Typography>


                    <Typography className='view-title' sx={viewTitleStyle}>Created by:</Typography>
                    {/* to add created by field to db when defect created */}
                    <Typography className='view-value' sx={viewValueStyle}>zixiang</Typography>


                    <List className='card' sx={{ml:3, mt:2}}>

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

                </Box>
                : null}



        </Box>
    )
}

export default ViewDefect