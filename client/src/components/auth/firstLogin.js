import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

//redux
import { useDispatch, useSelector } from "react-redux";

const handleSubmit = () =>{
    
}

const FirstLogin = () => {

    const users = useSelector(state => state.users)

    return (
        <Box mt={5} >
        <form style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} onSubmit={handleSubmit}>
            <Typography variant="h3">Welcome to Defect Management!</Typography>
            
            <Typography sx={{ml:1,mt:5,mb:1,flexBasis:'60%'}}>Please check your details and change your password to proceed</Typography>
            <Typography sx={{ml:1,mt:1,mb:5,flexBasis:'60%',color:'red'}}>Inform your admin immediately if any of the details is incorrect</Typography>

            <FormControl
                id='addUserFirstNameForm'
                sx={{ m: 1, flexBasis: '45%' }}>
                <InputLabel htmlFor='firstname'
                >First Name</InputLabel>
                <OutlinedInput
                    required
                    id="firstname"
                    text="text"
                    value={users.data.firstname}
                    label="First Name"
                    fullWidth
                    disabled
                />
            </FormControl>


            <FormControl
                    id='addUserLastNameForm'
                    sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor='lastname'
                    >Last Name</InputLabel>
                    <OutlinedInput
                        required
                        id="lastname"
                        text="text"
                        value={users.data.lastname}
                        label="Last Name"
                        fullWidth
                        disabled
                    />
                </FormControl>

                </form>

        </Box>)
}

export default FirstLogin