import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const ManageUserRole = ({
    userDetails,
    users,
    handleChangeRole,
    handleEditConfirm
}) => {
    return(
        <Box flexBasis='100%'>
        {userDetails && users.data.role === 'owner' ?

        
        <Box flexBasis='100%'>

        <Typography variant='h5' mb={3} mt={5} flexBasis='60%'>Change Role</Typography>

            <FormControl>
            <FormLabel id="roleForm">Role:</FormLabel>
            <RadioGroup
                value={userDetails.role}
                onChange={handleChangeRole}
                name="radio-buttons-group"
            >
                <FormControlLabel value="User" control={<Radio />} label="User" />
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                <FormControlLabel value="owner" control={<Radio />} label="Owner" />
            </RadioGroup>
            </FormControl>

                        

                        <Box sx={{ display: 'flex', flexBasis: '100%', justifyContent: 'flex-start' }}>
                            <Button
                                variant='contained'
                                sx={{ flexBasis: '30%', mt: 2, backgroundColor: 'lightblue', color: 'black' }}
                                onClick={()=> handleEditConfirm("confirmRole")}
                            >Change User Role</Button>
                        </Box>

                        <Box flexBasis='100%' borderBottom={'1px solid black'} mt={5} mb={5}></Box>
        </Box>
        :
        null
    }
    </Box>
    )
}

export default ManageUserRole