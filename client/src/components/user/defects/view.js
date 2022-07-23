//Lib
import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Loader, htmlDecode } from '../../../utils/tools';
import { useDispatch, useSelector } from 'react-redux'

//Comp
import { getDefectById } from '../../../store/actions/defects';

//MUI
import  Box from '@mui/material/Box';
import  Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText  from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';

// import ScoreCard from '../../utils/scoreCard';

const ViewDefect = () =>{

    const defects = useSelector(state=>state.defects)
    const dispatch = useDispatch();
    const { defectId } = useParams();

    useEffect(()=>{
        dispatch(getDefectById(defectId))
    },[defectId,dispatch])

    return(
<Box>
    {defects && defects.current ? 
    <Box className='defect_container'>
     
     <Typography variant='h6' className='defect-title' m={5} fontWeight={600}>{defects.current.title}</Typography>   
     
     <div className='defect-description' style={{margin:'2rem'}}>
        <div dangerouslySetInnerHTML={
        {__html: htmlDecode(defects.current.description)}
     }>
        </div>
     </div>

     <List className='card'>
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    <PersonIcon/>
                </Avatar>
            </ListItemAvatar>
<div>
            {defects.current.assignee.map((item,index)=>(
                <Chip
                key={`${item+index}`}
                item={item}
                label={item}
                color="primary"
                className='chip'
                />
                ))}
            </div>
            </ListItem>
{/*            
            <ListItemText 
            primary="Assignee" 
            secondary={defects.current.assignee}
            className="assignee"
            >
            </ListItemText>

        </ListItem> */}
    </List>
    
</Box>
:null}



</Box>
    )
}

export default ViewDefect