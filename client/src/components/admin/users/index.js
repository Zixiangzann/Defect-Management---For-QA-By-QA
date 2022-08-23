//comp
import { useState } from 'react';

//lib
import ModalComponent from '../../../utils/modal/modal';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, checkEmailExist, checkUsernameExist } from '../../../store/actions/admin';

//MUI
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import validator from 'validator';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { showToast } from '../../../utils/tools';
import { Divider, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';


const AdminUsers = () => {

    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('');
    const [emailCheck, setEmailCheck] = useState(false);
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [jobtitle, setJobTitle] = useState('');

    const dispatch = useDispatch();

    //Modal
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

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

    const admin = useSelector(state => state.admin)

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

    const handleModalConfirm = () => {
        navigator.clipboard.writeText(`Email: ${email} \n Password: ${password}`)
        showToast('SUCCESS', 'Copied')
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(addUser({
            username,
            firstname,
            lastname,
            email,
            password,
            role,
            jobtitle
        }))
            .unwrap()
            .then(() => setOpenModal(true))
            .catch((error) => console.log(error))
    }

    return (
        <Box mt={5} >

            <form style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} onSubmit={handleSubmit}>

                <Typography variant='h5' mb={5} flexBasis='60%'>Add User</Typography>

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
                    />
                    <FormHelperText error>{emailCheck ? "Invalid email" : null}</FormHelperText>
                    <FormHelperText error>{admin.error.emailTaken ? admin.error.emailTaken : null}</FormHelperText>

                </FormControl>

                <br></br>

                <FormControl id='addUserPasswordForm' sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor="password"
                    >Password</InputLabel>
                    <OutlinedInput
                        id="password"
                        type='text'
                        value={password}
                        label="Password"
                        fullWidth
                        disabled
                    />
                </FormControl>

                <Button
                    id="addUserGeneratePasswordBtn"
                    onClick={handleGeneratePassword}
                    sx={{ flexBasis: '20%' }}
                // variant='outlined'
                >Generate Password</Button>


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
                    />
                </FormControl>

                <Divider></Divider>

                <FormControl id="addUserRoleForm" sx={{ m: 1, flexBasis: '55%' }}>
                    <FormLabel>Role:</FormLabel>
                    <RadioGroup
                        row
                        defaultValue="user">
                        <FormControlLabel
                            value='user'
                            control={<Radio />}
                            label='User'
                            onChange={handleChangeRole} />

                        <FormControlLabel
                            value='admin'
                            control={<Radio />}
                            label='Admin'
                            onChange={handleChangeRole}

                        />
                    </RadioGroup>
                </FormControl>


                <Divider sx={{ flexBasis: '100%' }}></Divider>

                <Button
                    id='addUserBtn'
                    variant='contained'
                    type='submit'
                    sx={{ mt: 5, flexBasis: '25%' }}
                >Add user</Button>



            </form>


            <ModalComponent
                open={openModal}
                setOpenModal={setOpenModal}
                title="Account created"
                description={`Email: ${email} \n Password: ${password} \n Role: ${role.toLocaleUpperCase()}`}
                warn="Please copy and pass to the user, you will only see this password once"
                handleModalConfirm={handleModalConfirm}
                button1="Copy to Clipboard"
                button2="Cancel"
                titleColor="blue"
            >
            </ModalComponent>

        </Box>

    )
}

export default AdminUsers;