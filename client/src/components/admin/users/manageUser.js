//comp
import { useState, useEffect } from 'react';

//lib
import ModalComponent from '../../../utils/modal/modal';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, checkEmailExist, checkUsernameExist, getUserByEmail, updateFirstname, updateLastname, updateUsername, updateEmail, updateJobtitle, resetUserPassword } from '../../../store/actions/admin';

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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';

const ManageUser = () => {

    //Search User
    const [searchUser, setSearchUser] = useState('')

    const dispatch = useDispatch();
    const admin = useSelector(state => state.admin)
    const users = useSelector(state => state.users)
    const userDetails = useSelector(state => state.admin.userDetails[0])
    const userPermission = useSelector(state => state.admin.userPermission[0])

    const handleSearchUserField = (event) => {
        setSearchUser(event.target.value)
    }

    const handleSearchUser = () => {
        dispatch(getUserByEmail({
            email: searchUser
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

    //Field
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


    //Modal
    const [openModal, setOpenModal] = useState(false);
    const [copyPasswordModalOpen,setCopyPasswordModalOpen] = useState(false)
    const [modalDescription, setModalDescription] = useState('');
    const [modalType, setModalType] = useState('');
    const [modalInput, setModalInput] = useState('');
    

    const handleModalConfirm = () => {

        switch (editingField) {
            case "confirmFirstname":
                dispatch(updateFirstname({
                    adminPassword: modalInput,
                    userEmail: searchUser,
                    userNewFirstName: firstname
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editFirstname", false)
                    })
                break;
            case "confirmLastname":
                dispatch(updateLastname({
                    adminPassword: modalInput,
                    userEmail: searchUser,
                    userNewLastName: lastname
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editLastname", false)
                    })
                break;
            case "confirmUsername":
                dispatch(updateUsername({
                    adminPassword: modalInput,
                    userEmail: searchUser,
                    userNewUsername: username
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editUsername", false)
                    })
                break;
            case "confirmEmail":
                dispatch(updateEmail({
                    adminPassword: modalInput,
                    userEmail: searchUser,
                    userNewEmail: email
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editEmail", false)
                        setSearchUser(email);
                    }).catch(() => {
                        setSearchUser(userDetails.email);
                    })
                break;
            case "confirmJobtitle":
                dispatch(updateJobtitle({
                    adminPassword: modalInput,
                    userEmail: searchUser,
                    userNewJobTitle: jobtitle
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editJobtitle", false)
                    })
                break;
            case "resetPassword":
                //generate a new password
                const adminPassword = modalInput
                const userEmail = searchUser
                const userNewPassword = createPassword()
                setNewPassword(userNewPassword)
                console.log(userNewPassword)
                
                dispatch(resetUserPassword({
                    adminPassword,
                    userEmail,
                    userNewPassword
                }))
                .unwrap()
                .then(()=>{
                    setCopyPasswordModalOpen(true)
                })

                break;
            default:
                break;

        }
        setModalInput('')

    }

    const handleModalInput = (event) => {
        setModalInput(event.target.value);
    }

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(`Email: ${searchUser} \n Password: ${newPassword}`)
        showToast('SUCCESS', 'Copied')
    }


    //reset password

    const [newPassword,setNewPassword] = useState('')

    const handleResetPassword = (event) => {
        setEditingField('resetPassword')
        setOpenModal(true)
        setModalDescription(`You are about to Reset user's Password\n 
        Account: "${userDetails.email}" password will be reset`)
        setModalInput('')
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


    //editing

    const [editingField, setEditingField] = useState('')
    const [editEnabled, setEditEnabled] = useState({
        editEmail: false,
        editFirstname: false,
        editJobtitle: false,
        editLastname: false,
        editUsername: false
    })

    const handleEditState = (fieldName, enabled) => {

        setEditEnabled({
            ...editEnabled,
            [fieldName]: enabled
        })

    }

    const handleEditConfirm = (fieldName) => {
        setOpenModal(true)

        switch (fieldName) {
            case "confirmFirstname":
                setModalDescription(`You are about to change user's First name\n\n From: "${userDetails.firstname}" \n To: "${firstname}"`)
                setEditingField(fieldName);
                break;
            case "confirmLastname":
                setModalDescription(`You are about to change user's Last name\n\n From: "${userDetails.lastname}" \n To: "${lastname}"`)
                setEditingField(fieldName);
                break;
            case "confirmUsername":
                setModalDescription(`You are about to change user's Username\n\n From: "${userDetails.username}" \n To: "${username}"`)
                setEditingField(fieldName);
                break;
            case "confirmEmail":
                setModalDescription(`You are about to change user's Email\n\n From: "${userDetails.email}" \n To: "${email}"`)
                setEditingField(fieldName);
                break;
            case "confirmJobtitle":
                setModalDescription(`You are about to change user's Job title\n\n From: "${userDetails.jobtitle}" \n To: "${jobtitle}"`)
                setEditingField(fieldName);
                break;

            default:
                break;
        }
    }

    //Permission state
    const [permission, setPermission] = useState({
        addDefect:true,
        editOwnDefect:true,
        addComment:true,
        editOwnComment:true,
        deleteOwnComment:true,
        viewAllDefect:false,
        editAllDefect:false,
        deleteAllDefect:false,
        editAllComment:false,
        deleteAllComment:false,
        addUser:false,
        disableUser:false,
        deleteUser:false,
        changeUserDetails:false,
        resetUserPassword:false,
        addProject:false,
        assignProject:false,
        deleteProject:false,
        addComponent:false,
        deleteComponent:false
    })

    const handlePermission = (event) => {
        const value = event.target.checked;
        setPermission({
            ...permission,
            [event.target.name]: value
        });

    }


    useEffect(() => {

        if (userDetails && userDetails !== 'User not found') {
            setFirstName(userDetails.firstname)
            setLastName(userDetails.lastname)
            setUserName(userDetails.username)
            setEmail(userDetails.email)
            setPassword("xxxxxxxxxxxxxxxxxx")
            setJobTitle(userDetails.jobtitle)
            setRole(userDetails.role)

            // //set permission
            // setPermission({addDefect:userPermission.addDefect})
        }
    }, [userDetails]);


    return (
        <Box mt={5} sx={{ overflow: 'auto', maxHeight: '650px' }} >

            <form style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} onSubmit={handleSubmit}>

            {!userDetails ?    
            <Typography variant='h6' flexBasis={'100%'} mb={3}>Search for user by email to edit the account details</Typography>
            :
            null}


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
                                    onClick={() => { handleSearchUser() }}
                                >
                                    {<SearchIcon />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText error>{admin.error.userNotFound === "User not found" ? "User not found" : null}</FormHelperText>
                </FormControl>

                {userDetails ?
                <Box>

                <Typography variant='h5' mb={5} mt={5} flexBasis='60%'>User Details</Typography>

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
                        value={firstname}
                        label="First Name"
                        onChange={handleFirstName}
                        fullWidth
                        disabled={!editEnabled.editFirstname}
                        endAdornment={users.data.permission[0].changeUserDetails ?
                            <InputAdornment position='end'>
                                <Tooltip title="Confirm changes">
                                    <span>
                                        <IconButton
                                            aria-label="confirmFirstname"
                                            edge="end"
                                            onClick={(e) => handleEditConfirm("confirmFirstname")}
                                            disabled={editEnabled.editFirstname && userDetails.firstname !== firstname ? false : true}
                                            sx={{ color: 'green' }}
                                        >
                                            {<CheckCircleIcon />}
                                        </IconButton>
                                    </span>
                                </Tooltip>

                                <Tooltip title="Edit field">
                                    <IconButton
                                        name="editFirstname"
                                        aria-label="edit-firstname"
                                        edge="end"
                                        onClick={(e) => handleEditState("editFirstname", true)}
                                        sx={{ color: 'blue' }}
                                    >
                                        {<EditIcon

                                        />}
                                    </IconButton>
                                </Tooltip>

                            </InputAdornment>
                            :
                            null
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
                        disabled={!editEnabled.editLastname}
                        endAdornment={users.data.permission[0].changeUserDetails ?
                            <InputAdornment position='end'>
                                <Tooltip title="Confirm changes">
                                    <span>
                                        <IconButton
                                            aria-label="confirmLastname"
                                            edge="end"
                                            onClick={(e) => handleEditConfirm("confirmLastname")}
                                            disabled={editEnabled.editLastname && userDetails.lastname !== lastname ? false : true}
                                            sx={{ color: 'green' }}
                                        >
                                            {<CheckCircleIcon />}
                                        </IconButton>
                                    </span>
                                </Tooltip>

                                <Tooltip title="Edit field">
                                    <IconButton
                                        name="editLastname"
                                        aria-label="editLastname"
                                        edge="end"
                                        onClick={(e) => handleEditState("editLastname", true)}
                                        sx={{ color: 'blue' }}
                                    >
                                        {<EditIcon

                                        />}
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                            :
                            null
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
                        disabled={!editEnabled.editUsername}
                        endAdornment={users.data.permission[0].changeUserDetails ?
                            <InputAdornment position='end'>

                                <Tooltip title="Confirm changes">
                                    <span>
                                        <IconButton
                                            aria-label="confirmUsername"
                                            edge="end"
                                            disabled={!admin.error.usernameTaken && editEnabled.editUsername && userDetails.username !== username ? false : true}
                                            onClick={(e) => handleEditConfirm("confirmUsername")}
                                            sx={{ color: 'green' }}
                                        >
                                            {<CheckCircleIcon />}
                                        </IconButton>
                                    </span>
                                </Tooltip>

                                <Tooltip title="Edit field">
                                    <IconButton
                                        name="editUsername"
                                        aria-label="editUsername"
                                        edge="end"
                                        onClick={(e) => handleEditState("editUsername", true)}
                                        sx={{ color: 'blue' }}
                                    >
                                        {<EditIcon

                                        />}
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                            :
                            null
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
                        disabled={!editEnabled.editEmail}
                        endAdornment={
                            users.data.permission[0].changeUserDetails ?
                                <InputAdornment position='end'>

                                    <Tooltip title="Confirm changes">
                                        <span>
                                            <IconButton
                                                aria-label="confirmEmail"
                                                edge="end"
                                                disabled={!emailCheck && !admin.error.emailTaken && editEnabled.editEmail && userDetails.email !== email ? false : true}
                                                onClick={(e) => { handleEditConfirm("confirmEmail") }}
                                                sx={{ color: 'green' }}
                                            >
                                                {<CheckCircleIcon />}
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                    <Tooltip title="Edit field">
                                        <IconButton
                                            name="editEmail"
                                            aria-label="editEmail"
                                            edge="end"
                                            onClick={(e) => { handleEditState("editEmail", true) }}
                                            sx={{ color: 'blue' }}
                                        >
                                            {<EditIcon

                                            />}
                                        </IconButton>
                                    </Tooltip>

                                </InputAdornment>
                                :
                                null
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
                        disabled={!editEnabled.editJobtitle}
                        endAdornment={users.data.permission[0].changeUserDetails ?
                            <InputAdornment position='end'>

                                <Tooltip title="Confirm changes">
                                    <span>
                                        <IconButton
                                            aria-label="confirmJobtitle"
                                            edge="end"
                                            disabled={editEnabled.editJobtitle && userDetails.jobtitle !== jobtitle ? false : true}
                                            onClick={(e) => handleEditConfirm("confirmJobtitle")}
                                            sx={{ color: 'green' }}
                                        >
                                            {<CheckCircleIcon />}
                                        </IconButton>
                                    </span>
                                </Tooltip>

                                <Tooltip title="Edit field">
                                    <IconButton
                                        name="editJobtitle"
                                        aria-label="editJobtitle"
                                        edge="end"
                                        onClick={(e) => handleEditState("editJobtitle", true)}
                                        sx={{ color: 'blue' }}
                                    >
                                        {<EditIcon

                                        />}
                                    </IconButton>
                                </Tooltip>

                            </InputAdornment>
                            :
                            null
                        }


                    />
                </FormControl>
</Box>
:
null
}


                <Box flexBasis='100%'></Box>


                {/* Reset Password */}
                {userDetails && users.data.permission[0].resetUserPassword ?
                    <Box flexBasis='100%'>
                        <Box flexBasis='100%' borderBottom={'1px solid black'} mt={5} mb={5}></Box>
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
                    :
                    null
                }
    


                {/* Change Account role and permission */}
                {userDetails && users.data.role === 'owner' ?
                    <Box flexBasis='100%'>
                        <Box flexBasis='100%' borderBottom={'1px solid black'} mt={5} mb={5}></Box>
                        <Typography variant='h5' mb={5} mt={5} flexBasis='60%'>Change Role and Permission</Typography>
                        <Typography variant='h4' sx={{ flexBasis: '100%', mt: 2 }}>Account Permission</Typography>

                {/* Standard user control */}

                <Typography sx={{ flexBasis: '100%', mt: 2, mb: 2, fontSize: '1.2rem', fontWeight: '600' }}>Standard User</Typography>

                <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Defect management</Typography>
                <FormControlLabel name='addDefect' control={<Checkbox defaultChecked={userPermission.addDefect} />} label="Add Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                <FormControlLabel name='editOwnDefect' control={<Checkbox defaultChecked={userPermission.editOwnDefect} />} label="Edit Own Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                <FormControlLabel name='editAllDefect' control={<Checkbox defaultChecked/>} label="Edit All Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Comment management</Typography>
                <FormControlLabel name='addComment' control={<Checkbox defaultChecked />} label="Add Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                <FormControlLabel name='editOwnComment' control={<Checkbox defaultChecked />} label="Edit Own Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                <FormControlLabel name='deleteOwnComment' control={<Checkbox defaultChecked />} label="Delete Own Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />

                <Divider sx={{ flexBasis: '100%', borderBottomColor: 'black', mt: 5 }}></Divider>

                {/* sensitive admin control, only some admin or owner should have these control */}
                {users.data.role === 'owner' && userDetails.role === 'admin' ?
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

                    </Box>
                    :
                    null
                }


                <ModalComponent
                    open={openModal}
                    setOpenModal={setOpenModal}
                    title="Warning"
                    description={modalDescription}
                    warn={"Enter your password and click on confirm to make changes"}
                    input={true}
                    inputValue={modalInput}
                    inputLabel={"Password"}
                    inputType={"password"}
                    handleModalInput={handleModalInput}
                    handleModalConfirm={handleModalConfirm}
                    button1="Confirm"
                    button2="Cancel"
                    titleColor="darkred"
                >
                </ModalComponent>

                <ModalComponent
                open={copyPasswordModalOpen}
                setOpenModal={setCopyPasswordModalOpen}
                title="Password has been reset successfully"
                description={`Email: ${searchUser} \n Password: ${newPassword}`}
                warn="Please copy and pass to the user, you will only see this password once"
                handleModalConfirm={handleCopyPassword}
                button1="Copy to Clipboard"
                button2="Cancel"
                titleColor="blue"
            >
            </ModalComponent>

                


            </form>
        </Box>
    )
}

export default ManageUser