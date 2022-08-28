import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import InfoIcon from '@mui/icons-material/Info';

//redux
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Divider, Tooltip } from "@mui/material";
import { firstLoginValidation } from "../../store/actions/users";


const FirstLogin = () => {

    const users = useSelector(state => state.users)
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordCheck, setNewPasswordCheck] = useState('')
    const [oldPassword, setOldPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(firstLoginValidation({
            email: users.data.email,
            oldPassword: oldPassword,
            newPassword: newPassword
        })).unwrap()
        .then(()=>{
                navigate('/')
        })
        
    }

    const handleGeneratePassword = () => {
        setNewPassword(createPassword());
        setNewPasswordCheck(false)
    }

    const handleNewPassword = (event) => {
        setNewPassword(event.target.value)
    }

    const handleOldPassword = (event) => {
        setOldPassword(event.target.value)
    }

    const handleNewPasswordCheck = () => {
        //check password criteria
        const regExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        setNewPasswordCheck(!regExp.test(newPassword))
    }

    const createPassword = () => {
        let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*(){}[]:";|/.,1234567890';
        let password = ''
        const passwordLength = Math.floor(Math.random() * (25 - 15 + 1) + 15)

        //check password criteria
        const regExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

        while (regExp.test(password) !== true) {
            password = ''
            for (let index = 0; index < passwordLength; index++) {
                const randomIndex = Math.floor(Math.random() * (characters.length - 0 + 1) + 0)
                password = password + characters.charAt(randomIndex)
            }
        }
        return password
    }

    return (
        <Box mt={5} >
            <form style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} onSubmit={handleSubmit}>
                {/* change welcome message to company name */}
                {users.data.passwordresetted ?
                <Typography variant="h3">An admin have recently resetted your password</Typography>
                :
                <Typography variant="h3">Welcome to Defect Management! (ForQAByQA)</Typography>
            }
                <Typography sx={{ ml: 1, mt: 5, mb: 1, flexBasis: '100%' }}>Please check your details and change password to proceed</Typography>
                <Typography sx={{ ml: 1, mt: 1, mb: 1, flexBasis: '100%' }}>You may choose to generate a new password or create your own password</Typography>
                <Typography sx={{ ml: 1, mt: 1, mb: 5, flexBasis: '100%', color: 'red' }}>Inform your admin immediately if any of the details are incorrect</Typography>

                <Typography flexBasis={'100%'} mb={2} ml={2}>Check your account details</Typography>

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

                <FormControl
                    id='addUserUserNameForm'
                    sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor='username'
                    >Username</InputLabel>
                    <OutlinedInput
                        required
                        id="username"
                        text="text"
                        value={users.data.username}
                        label="Username"
                        fullWidth
                        disabled
                    />
                </FormControl>

                <FormControl
                    id='addUserJobTitleForm'
                    sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor='jobtitle'
                    >Job Title</InputLabel>
                    <OutlinedInput
                        required
                        id="jobtitle"
                        text="text"
                        value={users.data.jobtitle}
                        label="Job Title"
                        fullWidth
                        disabled
                    />
                </FormControl>
                

                <FormControl id='addUserEmailForm' sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor="email"
                    >Email</InputLabel>
                    <OutlinedInput
                        required
                        id="email"
                        type='text'
                        value={users.data.email}
                        label="Email"
                        fullWidth
                        disabled
                    />
                </FormControl>

                <Box flexBasis={'100%'} borderBottom={'1px solid black'} mt={2}></Box>
                <Typography mt={3} ml={2} mb={2} mr={2}>Reset your password</Typography> 
                <Tooltip title=
                    {
                    <div>
                    Password must consist of: <br></br>
                    - At least one upper case letter <br></br>
                    - At least one lower case letter <br></br>
                    - At least one digit <br></br>
                    - At least one special character <br></br>
                    - Minimum eight in length 
                    </div>}
                    placement="left"
                    sx={{mt:3}}
                    >
                <InfoIcon/>
                </Tooltip>

                <Box flexBasis={'100%'}></Box>

                <FormControl id='addUserOldPasswordForm' sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor="oldPassword"
                    >Old Password</InputLabel>
                    <OutlinedInput
                        required
                        id="oldPassword"
                        type='text'
                        value={oldPassword}
                        label="oldPassword"
                        onChange={(e) => handleOldPassword(e)}
                        placeholder="Enter your New Password"
                        fullWidth
                    />
                </FormControl>

                <Box flexBasis={'45%'}></Box>

                <FormControl id='addUserPasswordForm' sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor="password"
                    >New Password</InputLabel>
                    <OutlinedInput
                        id="password"
                        type='text'
                        value={newPassword}
                        error={newPasswordCheck}
                        label="Password"
                        onChange={(e) => handleNewPassword(e)}
                        placeholder="Enter your New Password"
                        fullWidth
                        onBlur={() => {
                            handleNewPasswordCheck()
                        }}
                    />
                    <FormHelperText error>{newPasswordCheck ? "Password did not meet criteria" : null}</FormHelperText>
                </FormControl>
                

                <Button
                    id="addUserGeneratePasswordBtn"
                    onClick={handleGeneratePassword}
                    sx={{ flexBasis: '20%' }}
                // variant='outlined'
                >Generate New Password</Button>

<Box sx={{display:'flex',flexBasis:'100%',justifyContent:'flex-end',mt:5}}>
                <Button 
                variant="contained"
                type='submit'
                sx={{flexBasis:'30%', mt:5}}>Proceed</Button>
</Box>
            </form>

        </Box>)
}

export default FirstLogin