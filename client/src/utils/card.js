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

const DefectCard = ({
    current
}) => {
    <List className='score-card'>
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    <PersonIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText 
            primary="Assignee" 
            secondary={current.assignee}
            className="assignee"
            >
            </ListItemText>


        </ListItem>


    </List>

}


export default DefectCard;