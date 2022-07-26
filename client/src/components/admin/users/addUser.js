//comp
import { useState, useEffect } from 'react';

//lib
import ModalComponent from '../../../utils/modal/modal';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, checkEmailExist, checkPhoneExist, checkUsernameExist } from '../../../store/actions/admin';
import { Loader, ProfilePicEditor } from '../../../utils/tools';
import { showToast } from '../../../utils/tools';

//MUI
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import validator from 'validator';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
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
    const [uploadProfilePicture, setUploadProfilePicture] = useState('');
    const [profilePictureSample, setProfilePictureSample] = useState('');

    const userDetailsDefaultState = {
        firstname: '',
        lastname: '',
        username: '',
        phone: '',
        email: '',
        password: '',
        role: 'user',
        jobtitle: ''
    }

    const permissionDefaultState = {
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
    }

    const [userDetails, setUserDetails] = useState(userDetailsDefaultState)


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
    const [permission, setPermission] = useState(permissionDefaultState)

    useEffect(() => {
        console.log(permission)
    }, [permission])

    const handlePermission = (event) => {
        const value = event.target.checked;
        setPermission({
            ...permission,
            [event.target.name]: value
        });

    }

    const dispatch = useDispatch();

    //Modal
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");

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


    //profile pic handler
    const handleProfilePic = (e) => {
        const fileSizeKb = e.target.files[0].size / 1024;
        const MAX_FILE_SIZE = 3072;

        //max 5mb
        if (fileSizeKb > MAX_FILE_SIZE) {
            alert('Maximum file size limit is 3MB')
        } else {
            setProfilePictureSample(URL.createObjectURL(e.target.files[0]))
        }
    }

    const handleProfilePicToBlob = () => {
        //profile pic from canvas
        if (profilePictureSample) {
            const canvas = document.getElementById("profilePicEditor")

            canvas.toBlob((blob) => {
                let file = new File([blob], "profile-pic.jpg", { type: "image/jpeg" })
                setUploadProfilePicture(file)
                showToast('SUCCESS', <div>Profile picture set</div>)
            }, 'image/jpeg')        
        }
    }


    const handleSubmit = (event) => {
        event.preventDefault();

        //to find a better way for phone number validation.
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

        if (!phoneCheck && userDetails.phone.length && !emailCheck && !admin.error.emailTaken && !admin.error.usernameTaken) {
            dispatch(addUser({
                uploadProfilePicture,
                userDetails,
                permission
            }))
                .unwrap()
                .then(() => {
                    setModalTitle("Account created")
                    setOpenModal(true)
                }
                )
        }

    }

    //reset state to default if account is created and modal is closed
    useEffect(() => {
        if (modalTitle === "Account created" && openModal === false) {
            //reset back to default state
            setUserDetails(userDetailsDefaultState)
            setPermission(permissionDefaultState)
            setModalTitle("")
            setUploadProfilePicture("")
            setProfilePictureSample("")
        }
    }, [openModal])

    return (
        <Box mt={5} overflow={'auto'} maxHeight={'650px'} >

            <form style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} onSubmit={handleSubmit}>

                <Typography variant='h4' mb={5} flexBasis='100%'>Account Details</Typography>


                <Typography variant='h6' sx={{ m: 1 }}>Profile Picture: </Typography>
                <Box id="upload-profile-picture-container"
                    sx={{ display: 'flex', flexBasis: '100%', justifyContent: 'center' }}>

                </Box>

                <ProfilePicEditor
                    imageUrl={profilePictureSample}
                    defaultZoom={1.5}
                    editingEnabled={profilePictureSample ? true : false}
                >
                </ProfilePicEditor>

                <Box flexBasis={'100%'}></Box>
                <InputLabel sx={{ fontSize: '0.8rem', color: 'darkred', ml: 1, mt: 3 }}>Note: Max File size: 3MB</InputLabel>
                <Box flexBasis={'100%'}></Box>
                <Button
                    id="uploadProfilePictureBtn"
                    color='secondary'
                    variant='contained'
                    component="label"
                    onChange={(e) => handleProfilePic(e)}
                    sx={{ mt: 2 }}
                >
                    Upload picture
                    <input hidden accept="image/*" type="file" />
                </Button>


                {profilePictureSample ?
                    <Button
                        id="confirmProfilePictureBtn"
                        color='primary'
                        variant='contained'
                        onClick={() => {
                            handleProfilePicToBlob()
                        }}
                        sx={{ mt: 2, ml: 2 }}
                    >Confirm Picture</Button>
                    :
                    null
                }


                <Box flexBasis={'100%'} borderBottom={'1px solid grey'} m={6}></Box>
                <Typography variant='h6' sx={{ m: 1, flexBasis: '100%' }}>Profile Info: </Typography>

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
                            dispatch(checkPhoneExist({phone: userDetails.phone}))
                        }
                        }
                    ></PhoneInput>
                    <FormHelperText error>{phoneCheck ? "Valid Phone number is required" : null}</FormHelperText>
                    <FormHelperText error>{admin.error.phoneTaken ? admin.error.phoneTaken : null}</FormHelperText>
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
                title={modalTitle}
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