import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'

const ManageUserResetPW = ({
    userDetails,
    users,
    handleResetPassword
}) => {

    return (
        <Box flexBasis='100%'>
            {userDetails.email  && users.data.permission[0].resetUserPassword ?
                <Box>
                    <Box flexBasis='100%'>
                        <Typography variant='h5' mb={5} mt={5} flexBasis='60%'>Reset Password</Typography>
                        <Box sx={{ display: 'flex', flexBasis: '100%', justifyContent: 'flex-start' }}>

                            <Button
                                id="resetPasword"
                                onClick={handleResetPassword}
                                sx={{ flexBasis: '30%', mt: 1, backgroundColor: 'lightblue', color: 'black' }}
                                variant='contained'
                            >Reset User Password</Button>

                           
                        </Box>
                       
                    </Box>
                    <Box sx={{ flexBasis: '100%', borderBottom: '1px solid black', mt: 5 }}></Box>
                </Box>
                :
                null
            }
        
        </Box>
    )
}


export default ManageUserResetPW