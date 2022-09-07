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
    role,
    handleChangeRole,
    handleEditConfirm
}) => {
    return(
        <Box flexBasis='100%'>
            {/* owner(super admin) account can manage role , admin can see the account role but cannot change the role*/}
        {userDetails.email  && users.data.role === 'owner' || users.data.role === 'admin'  ?

        
        <Box flexBasis='100%'>

        <Typography variant='h5' mb={3} mt={5} flexBasis='60%'>Change Role</Typography>
        {users.data.role === 'owner' ? null : <Typography mb={3}>Only Super Admin can manage account Role</Typography>}

            <FormControl>
            <FormLabel 
            id="roleForm"
            sx={{mb:3}}
            >Role:</FormLabel>
            <RadioGroup
                value={role}
                onChange={handleChangeRole}
                name="radio-buttons-group"
            >
                <FormControlLabel value="user" control={<Radio />} label="User"   disabled={users.data.role !== 'owner'}/>
                <FormControlLabel value="admin" control={<Radio />} label="Admin" disabled={users.data.role !== 'owner'}/>
                <FormControlLabel value="owner" control={<Radio />} label="Owner" disabled={users.data.role !== 'owner'}/>
            </RadioGroup>
            </FormControl>

                        

                        <Box sx={{ display: 'flex', flexBasis: '100%', justifyContent: 'start' }}>
                            <Button
                                id="changeRoleBtn"
                                variant='contained'
                                color='primary'
                                // disabled={userDetails.role === role}
                                sx={{ flexBasis: '30%', mt: 2}}
                                onClick={()=> handleEditConfirm("confirmRole")}
                            >Change User Role</Button>
                        </Box>

                       
        </Box>
        :
        null
    }
    </Box>
    )
}

export default ManageUserRole