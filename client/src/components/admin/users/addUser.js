//comp
import { useState, useEffect } from 'react';

//lib
import ModalComponent from '../../../utils/modal/modal';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, checkEmailExist, checkUsernameExist } from '../../../store/actions/admin';
import { Loader,ProfilePicEditor } from '../../../utils/tools';


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
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import InputAdornment from '@mui/material/InputAdornment';

//React-phone-number-input
import 'react-phone-input-2/lib/material.css'
import PhoneInput from 'react-phone-input-2'
import { Avatar } from '@mui/material';

const AddUser = () => {

    const [emailCheck, setEmailCheck] = useState(false);
    const [phoneCheck, setPhoneCheck] = useState(0)
    const [profilePicture, setProfilePicture] = useState('');
    const [profilePictureSample, setProfilePictureSample] = useState('')

    const [userDetails, setUserDetails] = useState({
        firstname: '',
        lastname: '',
        username: '',
        phone: '',
        email: '',
        password: '',
        role: 'user',
        jobtitle: ''
    })


    const handleUserDetails = (event) => {
        const value = event.target.value
        setUserDetails({
            ...userDetails,
            [event.target.name]: value
        })
    }

    const handleTrimOnBlur = (event) => {
        const value = event.target.value.trim()

        setUserDetails({
            ...userDetails,
            [event.target.name]: value
        })

    }

    //Permission state
    const [permission, setPermission] = useState({
        addDefect: true,
        editOwnDefect: true,
        addComment: true,
        editOwnComment: true,
        deleteOwnComment: true,
        viewAllDefect: false,
        editAllDefect: true,
        deleteAllDefect: false,
        editAllComment: false,
        deleteAllComment: false,
        addUser: false,
        disableUser: false,
        deleteUser: false,
        changeUserDetails: false,
        resetUserPassword: false,
        addProject: false,
        assignProject: false,
        deleteProject: false,
        addComponent: false,
        deleteComponent: false
    })

    useEffect(()=>{
        console.log(permission)
    },[permission])

    const handlePermission = (event) => {
        const value = event.target.checked;
        setPermission({
            ...permission,
            [event.target.name]: value
        });

    }

    const dispatch = useDispatch();

    //Modal
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);


    const handleGeneratePassword = () => {
        const password = createPassword();
        setUserDetails({
            ...userDetails,
            password
        })
    }

    const handleEmailCheck = () => {
        setEmailCheck(!validator.isEmail(userDetails.email));
    }

    const admin = useSelector(state => state.admin)
    const users = useSelector(state => state.users)

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
        navigator.clipboard.writeText(`Email: ${userDetails.email} \n Password: ${userDetails.password}`)
        showToast('SUCCESS', 'Copied')
    }

    const handleSubmit = (event) => {
        event.preventDefault();


        //to find a better way for validation.
        //Currently checking if the phone number is at least 8 characters including country code..
        if (userDetails.phone.length >= 8) {
            //if false mean ok, else throw error
            setPhoneCheck(false)
        } else {
            setPhoneCheck(true)
            showToast('ERROR', <div>Failed to create user <br></br> A valid phone number is required</div>)
        }

        if (emailCheck) showToast('ERROR', <div>Failed to create user <br></br>A valid email is required</div>)
        if (admin.error.emailTaken) showToast('ERROR', <div>Failed to create user <br></br>Email have been taken</div>)
        if (admin.error.usernameTaken) showToast('ERROR', <div>Failed to create user <br></br>Username have been taken</div>)

        if (!phoneCheck && !emailCheck && !admin.error.emailTaken && !admin.error.usernameTaken) {
            dispatch(addUser({
                userDetails,
                permission
            }))
                .unwrap()
                .then(() => setOpenModal(true))
        }
    }

    return (
        <Box mt={5} overflow={'auto'} maxHeight={'650px'} >

            <form style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} onSubmit={handleSubmit}>

                <Typography variant='h4' mb={5} flexBasis='100%'>Account Details</Typography>


                <Typography sx={{m:1}}>Profile picture: </Typography>
                <Box id="upload-profile-picture-container" 
                sx={{display:'flex',flexBasis:'100%',justifyContent:'center'}}>
                
                {/* <Avatar
                    id="add-profile-picture"
                    label="profile"
                    alt="profile"
                    src={profilePictureSample}
                    sx={{ width: 200, height: 200}}
                    /> */}

                </Box>

                <ProfilePicEditor
                imageUrl={profilePictureSample}
                >

                </ProfilePicEditor>

                <Box flexBasis={'100%'}></Box>
                
                <Button 
                color='primary' 
                variant='outlined'
                component="label"
                onChange={(e)=> {
                    console.log(URL.createObjectURL(e.target.files[0]))
                    setProfilePictureSample(URL.createObjectURL(e.target.files[0]))
                    setProfilePicture(e.target.files[0])
                }}
                sx={{mt:2}}
                >
                    Upload profile picture
                    <input hidden accept="image/*" type="file" />
                </Button>
                
                <Box flexBasis={'100%'} m={2}></Box>    

                <FormControl
                    id='addUserFirstNameForm'
                    sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor='firstname'
                    >First Name</InputLabel>
                    <OutlinedInput
                        required
                        name="firstname"
                        id="firstname"
                        text="text"
                        value={userDetails.firstname}
                        label="First Name"
                        onChange={handleUserDetails}
                        onBlur={handleTrimOnBlur}
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
                        name="lastname"
                        id="lastname"
                        text="text"
                        value={userDetails.lastname}
                        label="Last Name"
                        onChange={handleUserDetails}
                        onBlur={handleTrimOnBlur}
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
                        name="username"
                        id="username"
                        text="text"
                        value={userDetails.username}
                        label="Username"
                        onChange={handleUserDetails}
                        fullWidth
                        onBlur={(e) => {
                            handleTrimOnBlur(e)
                            dispatch(checkUsernameExist({ username: userDetails.username }))
                        }}
                    />
                    <FormHelperText error>{admin.error.usernameTaken ? admin.error.usernameTaken : null}</FormHelperText>
                </FormControl>


                <FormControl id='addPhoneNumberForm' sx={{ m: 1, flexBasis: '45%' }}>
                    <PhoneInput
                        inputProps={{
                            id: "phone",
                            name: 'phone',
                            required: true,
                        }}
                        country={'sg'}
                        placeholder='Enter phone number'
                        value={userDetails.phone}
                        onChange={phone => 
                            setUserDetails({ ...userDetails, phone })
                        }
                        inputStyle={{ width: 100 + '%' }}
                        onBlur={() => {
                            userDetails.phone.length >= 8 ? setPhoneCheck(false) : setPhoneCheck(true)
                        }
                        }
                    ></PhoneInput>
                    <FormHelperText error>{phoneCheck ? "Valid Phone number is required" : null}</FormHelperText>
                </FormControl>



                <FormControl id='addUserEmailForm' sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor="email"
                    >Email</InputLabel>
                    <OutlinedInput
                        required
                        name="email"
                        id="email"
                        type='text'
                        error={emailCheck}
                        value={userDetails.email}
                        label="Email"
                        onChange={handleUserDetails}
                        onBlur={(e) => {
                            handleTrimOnBlur(e)
                            handleEmailCheck(e)
                            dispatch(checkEmailExist({ email: userDetails.email }))
                        }}
                        fullWidth
                    />
                    <FormHelperText error>{!admin.error.emailTaken && emailCheck ? "Invalid email" : null}</FormHelperText>
                    <FormHelperText error>{admin.error.emailTaken ? admin.error.emailTaken : null}</FormHelperText>

                </FormControl>

                <br></br>


                <FormControl id='addUserJobTitleForm' sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor="jobtitle"
                    >Job Title</InputLabel>
                    <OutlinedInput
                        name="jobtitle"
                        id="jobtitle"
                        type='text'
                        value={userDetails.jobtitle}
                        label="Job Title"
                        fullWidth
                        onChange={handleUserDetails}
                        onBlur={handleTrimOnBlur}
                    />
                </FormControl>

                <Box flexBasis={'100%'}></Box>


                <FormControl id='addUserPasswordForm' sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor="password"
                    >Password</InputLabel>
                    <OutlinedInput
                        name="password"
                        id="password"
                        type='text'
                        value={userDetails.password}
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

                <Divider></Divider>

                <FormControl id="addUserRoleForm" sx={{ m: 2, flexBasis: '55%' }}>
                    <FormLabel>Role:</FormLabel>
                    <RadioGroup
                        row
                        defaultValue="user">
                        <FormControlLabel
                            name='role'
                            value='user'
                            control={<Radio />}
                            label='User'
                            onChange={handleUserDetails} />

                        <FormControlLabel
                            name='role'
                            value='admin'
                            control={<Radio disabled={users.data.role === 'owner' ? false : true} />}
                            label='Admin'
                            onChange={handleUserDetails}
                        />

                        <FormControlLabel
                            name='role'
                            value='owner'
                            control={<Radio disabled={users.data.role === 'owner' ? false : true} />}
                            label='Owner'
                            onChange={handleUserDetails}
                        />

                        {users.data.role === 'owner' ? null : <FormHelperText>Only Super Admin can create "Admin/Owner" account</FormHelperText>}

                    </RadioGroup>
                </FormControl>


                <Divider sx={{ flexBasis: '100%', borderBottomColor: 'black', mt: 5 }}></Divider>

                <Typography variant='h4' sx={{ flexBasis: '100%', mt: 2 }}>Account Permission</Typography>

                {/* Standard user control */}

                <Typography sx={{ flexBasis: '100%', mt: 2, mb: 2, fontSize: '1.2rem', fontWeight: '600' }}>Standard User</Typography>

                <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Defect management</Typography>
                <FormControlLabel name='addDefect' control={<Checkbox defaultChecked />} label="Add Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                <FormControlLabel name='editOwnDefect' control={<Checkbox defaultChecked />} label="Edit Own Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                <FormControlLabel name='editAllDefect' control={<Checkbox defaultChecked />} label="Edit All Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Comment management</Typography>
                <FormControlLabel name='addComment' control={<Checkbox defaultChecked />} label="Add Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                <FormControlLabel name='editOwnComment' control={<Checkbox defaultChecked />} label="Edit Own Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                <FormControlLabel name='deleteOwnComment' control={<Checkbox defaultChecked />} label="Delete Own Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />

                <Divider sx={{ flexBasis: '100%', borderBottomColor: 'black', mt: 5 }}></Divider>

                {/* sensitive admin control, only admin or owner account should hold these permission */}
                {users.data.role === 'owner' && userDetails.role === 'admin' || userDetails.role === 'owner' ?
                    <>
                        <Typography sx={{ flexBasis: '100%', mt: 2, fontSize: '1.2rem', fontWeight: '600' }}>Admin</Typography>


                        <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Defect management</Typography>
                        <FormControlLabel name='viewAllDefect' control={<Checkbox />} label="View All Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                        <FormControlLabel name='deleteAllDefect' control={<Checkbox />} label="Delete All Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />

                        <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Comment management</Typography>
                        <FormControlLabel name='editAllComment' control={<Checkbox />} label="Edit All Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                        <FormControlLabel name='deleteAllComment' control={<Checkbox />} label="Delete All Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />



                        <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>User management</Typography>
                        <FormControlLabel name='addUser' control={<Checkbox />} label="Add Users" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                        <FormControlLabel name='disableUser' control={<Checkbox />} label="Disable Users" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                        <FormControlLabel name='deleteUser' control={<Checkbox />} label="Delete Users" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                        <FormControlLabel name='changeUserDetails' control={<Checkbox />} label="Change Users Details" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                        <FormControlLabel name='resetUserPassword' control={<Checkbox />} label="Reset Users Password" sx={{ flexBasis: '100%' }} onChange={handlePermission} />


                        <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Project management</Typography>
                        <FormControlLabel name='addProject' control={<Checkbox />} label="Add Projects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                        <FormControlLabel name='assignProject' control={<Checkbox />} label="Assign Projects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                        <FormControlLabel name='deleteProject' control={<Checkbox />} label="Delete Projects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                        <FormControlLabel name='addComponent' control={<Checkbox />} label="Add Components" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                        <FormControlLabel name='deleteComponent' control={<Checkbox />} label="Delete Components" sx={{ flexBasis: '100%' }} onChange={handlePermission} />

                    </>
                    :
                    null
                }



                {admin.loading ?
                    <Loader
                    message={"Creating account, please wait.."}
                    ></Loader> :
                    <Button
                        id='addUserBtn'
                        variant='contained'
                        type='submit'
                        sx={{ mt: 5, flexBasis: '25%' }}
                    >Add user</Button>

                }




            </form>


            <ModalComponent
                open={openModal}
                setOpenModal={setOpenModal}
                title="Account created"
                description={`Email: ${userDetails.email} \n Password: ${userDetails.password} \n Role: ${userDetails.role.toLocaleUpperCase()}`}
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

export default AddUser;