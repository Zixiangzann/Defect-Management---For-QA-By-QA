//comp
import { useState,useEffect } from 'react';

//lib
import ModalComponent from '../../../utils/modal/modal';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, checkEmailExist, checkUsernameExist, getUserByEmail } from '../../../store/actions/admin';

//MUI
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import validator from 'validator';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { showToast } from '../../../utils/tools';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import { IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';

const ManageUser = () => {

    //Search User
    const [searchUser,setSearchUser] = useState('')

    const dispatch = useDispatch();
    const admin = useSelector(state => state.admin)
    const userData = useSelector(state => state.admin.userData[0])

    const handleSearchUserField = (event) =>{
        setSearchUser(event.target.value)
    }

    const handleSearchUser = () =>{
        dispatch(getUserByEmail({
            email:searchUser
        }))
    }

    //User Field

    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('');
    const [emailCheck, setEmailCheck] = useState(false);
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [jobtitle, setJobTitle] = useState('');

    //edit user details state
    //show modal to check for edit confirmation


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


    const handleFirstName = (event) => {
        setFirstName(event.target.value)
    }

    const handleLastName = (event) => {
        setLastName(event.target.value)
    }

    const handleUserName = (event) => {
        setUserName(event.target.value)
    }


    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handleGeneratePassword = () => {
        setPassword(createPassword());
    }

    const handleEmailCheck = (event) => {
        setEmailCheck(!validator.isEmail(email));
    }

    const handleChangeRole = (event) => {
        setRole(event.target.value);
    }

    const handleJobTitle = (event) => {
        setJobTitle(event.target.value)
    }


    const handleSubmit = (event) => {
        event.preventDefault();
    }

    useEffect(() => {

        if(userData && userData !== 'User not found'){
        setFirstName(userData.firstname)
        setLastName(userData.lastname)
        setUserName(userData.lastname)
        setEmail(userData.email)
        setPassword("xxxxxxxxxxxxxxxxxx")
        setJobTitle(userData.jobtitle)
        setRole(userData.role)
        }
    }, [userData]);


    return(
        <Box mt={5} >

            <form style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} onSubmit={handleSubmit}>

            <FormControl
                    id='searchUser'
                    sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor='searchUser'
                    >Search User by Email</InputLabel>
                    <OutlinedInput
                        required
                        id="searchuser"
                        text="text"
                        value={searchUser}
                        label="Search User by Email"
                        onChange={handleSearchUserField}
                        fullWidth
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton
                                aria-label="search"
                                edge="end"
                                onClick={()=>{handleSearchUser()}}
                                >
                                    {<SearchIcon/>}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText error>{admin.error.userNotFound === "User not found" ? "User not found" : null}</FormHelperText>
                </FormControl>

                <Typography variant='h5' mb={5} mt={5} flexBasis='60%'>User Details</Typography>

<FormControl
    id='addUserFirstNameForm'
    sx={{ m: 1, flexBasis: '45%' }}>
    <InputLabel htmlFor='firstname'
    >First Name</InputLabel>
    <OutlinedInput
        required
        id="firstname"
        text="text"
        value={firstname}
        label="First Name"
        onChange={handleFirstName}
        fullWidth
        disabled
        endAdornment={
            <InputAdornment position='end'>
                <IconButton
                aria-label="edit-firstname"
                edge="end"
                >
                    {<EditIcon/>}
                </IconButton>
            </InputAdornment>
        }
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
        value={lastname}
        label="Last Name"
        onChange={handleLastName}
        fullWidth
        disabled
        endAdornment={
            <InputAdornment position='end'>
                <IconButton
                aria-label="edit-firstname"
                edge="end"
                >
                    {<EditIcon/>}
                </IconButton>
            </InputAdornment>
        }
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
        value={username}
        label="Username"
        onChange={handleUserName}
        fullWidth
        disabled
        endAdornment={
            <InputAdornment position='end'>
                <IconButton
                aria-label="edit-firstname"
                edge="end"
                >
                    {<EditIcon/>}
                </IconButton>
            </InputAdornment>
        }
        onBlur={(e) => {
            dispatch(checkUsernameExist({ username }))
        }}
    />
    <FormHelperText error>{admin.error.usernameTaken ? admin.error.usernameTaken : null}</FormHelperText>
</FormControl>


<FormControl id='addUserEmailForm' sx={{ m: 1, flexBasis: '45%' }}>
    <InputLabel htmlFor="email"
    >Email</InputLabel>
    <OutlinedInput
        required
        id="email"
        type='text'
        error={emailCheck}
        value={email}
        label="Email"
        onChange={(e) => handleEmail(e)}
        onBlur={(e) => {
            handleEmailCheck(e)
            dispatch(checkEmailExist({ email }))
        }}
        fullWidth
        disabled
        endAdornment={
            <InputAdornment position='end'>
                <IconButton
                aria-label="edit-firstname"
                edge="end"
                >
                    {<EditIcon/>}
                </IconButton>
            </InputAdornment>
        }
    />
    <FormHelperText error>{emailCheck ? "Invalid email" : null}</FormHelperText>
    <FormHelperText error>{admin.error.emailTaken ? admin.error.emailTaken : null}</FormHelperText>

</FormControl>

<br></br>


<FormControl id='jobTitleForm' sx={{ m: 1, flexBasis: '45%' }}>
    <InputLabel htmlFor="jobtitle"
    >Job Title</InputLabel>
    <OutlinedInput
        id="jobtitle"
        type='text'
        value={jobtitle}
        label="Job Title"
        fullWidth
        onChange={handleJobTitle}
        disabled
        endAdornment={
            <InputAdornment position='end'>
                <IconButton
                aria-label="edit-firstname"
                edge="end"
                >
                    {<EditIcon/>}
                </IconButton>
            </InputAdornment>
        }
    />
</FormControl>

<Divider></Divider>

<Box flexBasis='100%'></Box>

<Box sx={{display:'flex',flexBasis:'100%',justifyContent:'flex-end'}}>
<Button
    id="resetPasword"
    // onClick={handleGeneratePassword}
    sx={{ flexBasis: '30%',mt:1,backgroundColor:'lightblue',color:'black'}}
    variant='contained'
>Reset User Password</Button>

</Box>

<Box sx={{display:'flex',flexBasis:'100%',justifyContent:'flex-end'}}>
<Button
    id="changeUserRole"
    sx={{flexBasis: '30%',mt:1,backgroundColor:'lightblue',color:'black'}}
    variant='contained'
>Change User Role
</Button>
</Box>


                </form>
                </Box>
    )
}

export default ManageUser