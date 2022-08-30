//comp
import { useState, useEffect } from 'react';

//lib
import ModalComponent from '../../../utils/modal/modal';
import { useDispatch, useSelector } from 'react-redux';
import { 
    addUser,
    checkEmailExist, 
    checkUsernameExist, 
    getUserByEmail, 
    updateFirstname, 
    updateLastname, 
    updateUsername, 
    updateEmail, 
    updateJobtitle, 
    resetUserPassword,
    getAllUsersEmail } from '../../../store/actions/admin';
import ManageUserResetPW from './manageUserResetPW';

//MUI
import Box from '@mui/material/Box'
import validator from 'validator';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { showToast } from '../../../utils/tools';
import Typography from '@mui/material/Typography';
import { IconButton, InputAdornment, Menu, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ManageUserDetails from './manageUserDetails';
import ManageUserPermission from './manageUserPermission';
import ManageUserRole from './manageUserRole';
import { resetState } from '../../../store/reducers/admin';

const ManageUser = () => {

    //State
    //Search User state
    const [searchUser, setSearchUser] = useState('')

    const dispatch = useDispatch();
    const admin = useSelector(state => state.admin)
    const users = useSelector(state => state.users)
    const userDetails = useSelector(state => state.admin.userDetails[0])
    const userPermission = useSelector(state => state.admin.userPermission[0])

    //User Field state
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('');
    const [emailCheck, setEmailCheck] = useState(false);
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [jobtitle, setJobTitle] = useState('');

    //Modal state
    const [openModal, setOpenModal] = useState(false);
    const [copyPasswordModalOpen, setCopyPasswordModalOpen] = useState(false)
    const [modalDescription, setModalDescription] = useState('');
    const [modalType, setModalType] = useState('');
    const [modalInput, setModalInput] = useState('');

    //reset password state
    const [newPassword, setNewPassword] = useState('')

    //editing state
    const [editingField, setEditingField] = useState('')
    const [editEnabled, setEditEnabled] = useState({
        editEmail: false,
        editFirstname: false,
        editJobtitle: false,
        editLastname: false,
        editUsername: false
    })

    //Permission state
    const [permission, setPermission] = useState({
        addDefect: true,
        editOwnDefect: true,
        addComment: true,
        editOwnComment: true,
        deleteOwnComment: true,
        viewAllDefect: false,
        editAllDefect: false,
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


    //Handle
    //Select User
    const handleSelectUsers = (event) => {
        setSearchUser(event.target.value)
    }

    useEffect(()=>{
        dispatch(getUserByEmail({
            email: searchUser
        }))
    },[searchUser])

    //User Field handle
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


    //Modal handle
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
                    .then(() => {
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


    //reset password handle
    const handleCopyPassword = () => {
        navigator.clipboard.writeText(`Email: ${searchUser} \n Password: ${newPassword}`)
        showToast('SUCCESS', 'Copied')
    }

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


    //Edit handle
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

    //Permission handle
    const handlePermission = (event) => {
        const value = event.target.checked;
        setPermission({
            ...permission,
            [event.target.name]: value
        });

        console.log(permission)

    }

    //use effect

    useEffect(() => {
        dispatch(resetState())
        dispatch(getAllUsersEmail({}))
    }, [])


    useEffect(() => {
        if (userDetails && userDetails !== 'User not found') {
            setFirstName(userDetails.firstname)
            setLastName(userDetails.lastname)
            setUserName(userDetails.username)
            setEmail(userDetails.email)
            setPassword("xxxxxxxxxxxxxxxxxx")
            setJobTitle(userDetails.jobtitle)
            setRole(userDetails.role)
        }
    }, [userDetails]);


    return (
        <Box mt={5} sx={{ overflow: 'auto', maxHeight: '650px' }} >

            <form style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} onSubmit={handleSubmit}>

                {!userDetails ?
                    <Typography variant='h6' flexBasis={'100%'} mb={3}>Select User to begin</Typography>
                    :
                    null}
                
                <FormControl
                    id='searchUser'
                    sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor='searchUser'
                    >Select User</InputLabel>
                    <Select
                    id="selectuser"
                    value={searchUser}
                    label="usersEmails"
                    onChange={handleSelectUsers}
                    >
                    {admin.userEmails.map((email) => (
                        <MenuItem key={email} value={email}>{email}</MenuItem>
                    ))}    
                    </Select>
                </FormControl>

                <ManageUserDetails
                    userDetails={userDetails}
                    firstname={firstname}
                    lastname={lastname}
                    username={username}
                    jobtitle={jobtitle}
                    email={email}
                    emailCheck={emailCheck}
                    admin={admin}
                    handleFirstName={handleFirstName}
                    handleLastName={handleLastName}
                    handleUserName={handleUserName}
                    handleJobTitle={handleJobTitle}
                    handleEmail={handleEmail}
                    handleEmailCheck={handleEmailCheck}
                    editEnabled={editEnabled}
                    users={users}
                    handleEditConfirm={handleEditConfirm}
                    handleEditState={handleEditState}
                    dispatch={dispatch}
                    checkUsernameExist={checkUsernameExist}
                    checkEmailExist={checkEmailExist}
                >

                </ManageUserDetails>

                <ManageUserResetPW
                    userDetails={userDetails}
                    users={users}
                    handleResetPassword={handleResetPassword}
                >

                </ManageUserResetPW>

                <ManageUserRole
                    userDetails={userDetails}
                    users={users}
                >

                </ManageUserRole>


                <ManageUserPermission
                    userDetails={userDetails}
                    users={users}
                    userPermission={userPermission}
                    handlePermission={handlePermission}
                >

                </ManageUserPermission>


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