import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'

const ManageUserRole = ({
    userDetails,
    users
}) => {
    return(
        <Box flexBasis='100%'>
        {userDetails && users.data.role === 'owner' ?
        <Box flexBasis='100%'>
            <Box flexBasis='100%' borderBottom={'1px solid black'} mt={5} mb={5}></Box>
                        <Typography variant='h5' mb={5} mt={5} flexBasis='60%'>Change Role</Typography>

                        <Box sx={{ display: 'flex', flexBasis: '100%', justifyContent: 'flex-start' }}>
                            <Button
                                variant='contained'
                                sx={{ flexBasis: '30%', mt: 1, backgroundColor: 'lightblue', color: 'black' }}
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