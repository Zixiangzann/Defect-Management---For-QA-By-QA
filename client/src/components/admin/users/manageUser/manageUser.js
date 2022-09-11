//comp
import { useState, useEffect } from 'react';
import ManageUserDetails from './manageUserDetails';
import ManageUserPermission from './manageUserPermission';
import ManageUserRole from './manageUserRole';
import { resetState } from '../../../../store/reducers/admin';
import { isAuth } from '../../../../store/actions/users';
import ManageUserProject from './manageUserProject';
import ModalComponent from '../../../../utils/modal/modal';
import ManageUserResetPW from './manageUserResetPW';


//lib
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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
    getAllUsersEmail,
    updateUserPermission,
    updateRole,
    getAllProjects,
    removeFromProject,
    assignProject,
    updatePhone
} from '../../../../store/actions/admin';


//MUI
import Box from '@mui/material/Box'
import validator from 'validator';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { showToast } from '../../../../utils/tools';
import Typography from '@mui/material/Typography';
import { Divider, IconButton, InputAdornment, ListItem, Menu, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { getProjectByTitle } from '../../../../store/actions/defects';




const ManageUser = () => {

    //State
    //Nav tab
    const [tab, setTab] = useState(0);

    //Search User state
    const [searchUser, setSearchUser] = useState('')

    const dispatch = useDispatch();
    const admin = useSelector(state => state.admin)
    const users = useSelector(state => state.users)
    const userDetails = useSelector(state => state.admin.userDetails)
    const userPermission = useSelector(state => state.admin.userPermission[0])
    const userProject = useSelector(state => state.admin.userProject)

    //User Field state
    const [profilePictureSample, setProfilePictureSample] = useState('');
    const [editProfilePicture, setEditProfilePicture] = useState(false)
    const [uploadProfilePicture, setUploadProfilePicture] = useState('');
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('');
    const [emailCheck, setEmailCheck] = useState(false);
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [jobtitle, setJobTitle] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneCheck, setPhoneCheck] = useState(0)

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

    const defaultEditState = {
        editProfilePicture: false,
        editEmail: false,
        editFirstname: false,
        editJobtitle: false,
        editLastname: false,
        editUsername: false
    }
    const [editEnabled, setEditEnabled] = useState({
        defaultEditState
    })

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

    // project
    const [project, setProject] = useState('');
    const [selectProject, setSelectProject] = useState('');
    const [removeUserProject, setRemoveUserProject] = useState('')
    const [assignUserProject, setAssignUserProject] = useState('')


    //Handle

    //Nav tab
    const handleNavTab = (event, newValue) => {
        setTab(newValue)
    }

    //Select User
    const handleSelectUsers = (event) => {
        setSearchUser(event.target.value)
    }

    const handleProfilePic = (e) => {
        const fileSizeKb = e.target.files[0].size / 1024;
        const MAX_FILE_SIZE = 3072;

        //max 5mb
        if (fileSizeKb > MAX_FILE_SIZE) {
            alert('Maximum file size limit is 3MB')
        } else {
            setProfilePictureSample(URL.createObjectURL(e.target.files[0]))
            // setUserDet
        }

        // if(userDetails.photoURL !== )
        setEditEnabled({
            ...editEnabled,
            editProfilePicture: true
        })
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


    useEffect(() => {
        if (searchUser !== "") {
            dispatch(getUserByEmail({
                email: searchUser
            }))

            setEditEnabled({})
            setPhoneCheck(false)
            setEmailCheck(false)
            dispatch(resetState())
        }
    }, [searchUser])

    useEffect(() => {
        if (selectProject !== "") {
            dispatch(getProjectByTitle({
                projectTitle: selectProject
            }))
        }
    }, [selectProject])

    useEffect(() => {
        if (userDetails.email && userDetails !== 'User not found') {
            setPermission({
                ...userPermission
            })

            //set at inital state and after changes.
            //set field back to default(before change) when click on other edit state

            setFirstName(userDetails.firstname)
            setLastName(userDetails.lastname)
            setUserName(userDetails.username)
            setPhone(userDetails.phone)
            setEmail(userDetails.email)
            setJobTitle(userDetails.jobtitle)
            setRole(userDetails.role)

            //profile pic initial set
            //if changes is not confirmed. and user going to edit other field, change back to initial picture
            if (uploadProfilePicture === "" && !editEnabled.editProfilePicture) {
                setProfilePictureSample(userDetails.photoURL)
            }

        }


    }, [userDetails, userPermission, editEnabled])

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

    //library have different way of handling
    const handlePhone = (phone) => {
        setPhone(phone)
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
    const handleModalConfirm = async () => {

        const adminPassword = modalInput
        const userEmail = searchUser

        switch (editingField) {
            case "confirmFirstname":
                dispatch(updateFirstname({
                    adminPassword,
                    userEmail,
                    userNewFirstName: firstname
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editFirstname", false)
                    })
                    .then(() => {
                        dispatch(getUserByEmail({ email: searchUser }))
                        // dispatch(isAuth())
                    })
                break;
            case "confirmLastname":
                dispatch(updateLastname({
                    adminPassword,
                    userEmail,
                    userNewLastName: lastname
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editLastname", false)
                    })
                    .then(() => {
                        dispatch(getUserByEmail({ email: searchUser }))
                        // dispatch(isAuth())
                    })
                break;
            case "confirmPhone": {
                dispatch(updatePhone({
                    adminPassword,
                    userEmail,
                    userNewPhone: phone
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editPhone", false)
                    })
                    .then(() => {
                        dispatch(getUserByEmail({ email: searchUser }))
                    })
                break;
            }
            case "confirmUsername":
                dispatch(updateUsername({
                    adminPassword,
                    userEmail,
                    userNewUsername: username
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editUsername", false)
                    })
                    .then(() => {
                        dispatch(getUserByEmail({ email: searchUser }))
                        // dispatch(isAuth())
                    })
                break;
            case "confirmEmail":
                dispatch(updateEmail({
                    adminPassword,
                    userEmail,
                    userNewEmail: email
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editEmail", false)
                        setSearchUser(email);
                    })
                    .then(() => {
                        dispatch(getUserByEmail({ email: searchUser }))
                        // dispatch(isAuth())
                    })
                    .catch(() => {
                        setSearchUser(userDetails.email);
                    })
                break;
            case "confirmJobtitle":
                dispatch(updateJobtitle({
                    adminPassword,
                    userEmail,
                    userNewJobTitle: jobtitle
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editJobtitle", false)
                    })
                    .then(() => {
                        dispatch(getUserByEmail({ email: searchUser }))
                        // dispatch(isAuth())
                    })
                break;
            case "confirmRole":
                dispatch(updateRole({
                    adminPassword,
                    userEmail,
                    userNewRole: role
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editRole", false)
                    })
                    .then(() => {
                        dispatch(getUserByEmail({ email: searchUser }))
                        //only changing role and updating permission require to do isauth again
                        //to get using account details again, in case of scenario
                        //of updating of own account. Like "owner" account changing its own permission to enable/disable some permission.
                        dispatch(isAuth())
                    })
                break;

            case "confirmUpdatePermission":
                dispatch(updateUserPermission({
                    adminPassword,
                    userEmail,
                    userNewPermission: permission
                }))
                    .unwrap()
                    .then(() => {
                        handleEditState("editPermission", false)
                    })
                    .then(() => {
                        dispatch(getUserByEmail({ email: searchUser }))
                        //only changing role and updating permission require to do isauth again
                        //to get using account details again, in case of scenario 
                        //of updating own account. Like "owner" account changing its own permission to enable/disable some permission.
                        dispatch(isAuth())
                    })
                break;
            case "resetPassword":
                //generate a new password
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
                    .then(() => {
                        dispatch(getUserByEmail({ email: searchUser }))
                        dispatch(isAuth())
                    })

                break;

            case "removeFromProject":
                const projectTitle = removeUserProject
                dispatch(removeFromProject({
                    adminPassword,
                    userEmail,
                    projectTitle
                }))
                    .unwrap()
                    .then(() => {
                        dispatch(getUserByEmail({ email: searchUser }))
                        dispatch(getProjectByTitle({ projectTitle: selectProject }))
                        // dispatch(isAuth())
                    })
                break;
            case "assignToProject":
                //assign the selected project    
                const toAssign = selectProject
                dispatch(assignProject({
                    adminPassword,
                    userEmail,
                    projectTitle: toAssign
                }))
                    .unwrap()
                    .then(() => {
                        dispatch(getUserByEmail({ email: searchUser }))
                        dispatch(getProjectByTitle({ projectTitle: selectProject }))
                        // dispatch(isAuth())
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
        //only set 1 to edit state at a time
        setEditEnabled({ [fieldName]: enabled })
    }


    const [confirmChanges, setConfirmChanges] = useState('')

    //trimming when click confirm
    useEffect(() => {
        switch (confirmChanges) {
            case "confirmFirstname":
                setFirstName(firstname.trim())
                setOpenModal(true)
                break;
            case "confirmLastname":
                setLastName(lastname.trim())
                setOpenModal(true)
                break;
            case "confirmUsername":
                setUserName(username.trim())
                setOpenModal(true)
                break;
            case "confirmEmail":
                setEmail(email.trim())
                setOpenModal(true)
                break;
            case "confirmJobtitle":
                setJobTitle(jobtitle.trim())
                setOpenModal(true)
                break;
            case "confirmPhone":
                setOpenModal(true)
                break;
            default:
                break;
        }
    }, [confirmChanges])

    useEffect(() => {
        handleEditConfirm()
    }, [openModal])

    const handleEditConfirm = () => {

        // setOpenModal(true)

        switch (confirmChanges) {
            case "confirmFirstname":
                setModalDescription(`You are about to change user's First name\n\n From: "${userDetails.firstname}" \n To: "${firstname}"`)
                setEditingField(confirmChanges);
                break;
            case "confirmLastname":
                setModalDescription(`You are about to change user's Last name\n\n From: "${userDetails.lastname}" \n To: "${lastname}"`)
                setEditingField(confirmChanges);
                break;
            case "confirmUsername":
                setModalDescription(`You are about to change user's Username\n\n From: "${userDetails.username}" \n To: "${username}"`)
                setEditingField(confirmChanges);
                break;
            case "confirmEmail":
                setModalDescription(`You are about to change user's Email\n\n From: "${userDetails.email}" \n To: "${email}"`)
                setEditingField(confirmChanges);
                break;
            case "confirmJobtitle":
                setModalDescription(`You are about to change user's Job title\n\n From: "${userDetails.jobtitle}" \n To: "${jobtitle}"`)
                setEditingField(confirmChanges);
                break;
            case "confirmRole":
                setModalDescription(`You are about to change user's Role \n\n From: "${userDetails.role.charAt(0).toUpperCase() + userDetails.role.slice(1)}" 
                To: "${role.charAt(0).toUpperCase() + role.slice(1)}"
                ${role === 'user' && (userDetails.role === 'owner' || userDetails.role === 'admin') ? "Note: Account will lose all Admin permission" : ""}
                `)
                setEditingField(confirmChanges);
                break;
            case "confirmPermission":
                setModalDescription(`You are about to change user's Permission`)
                setEditingField("confirmUpdatePermission");
                break;
            case "confirmPhone":
                setModalDescription(`You are about to change user's phone number \n\n From: "${userDetails.phone}" 
                To: "${phone}
                `)
                setEditingField(confirmChanges);
                break;
            default:
                break;
        }

        setConfirmChanges('')
    }

    //Permission handle
    const handlePermission = (event) => {
        const value = event.target.checked;
        setPermission({
            ...permission,
            [event.target.name]: value
        });
    }

    const [permissionChanged, setPermissionChanged] = useState()

    const permissionChangedCheck = () => {
        const userPrevious = userPermission
        const userCurrent = permission
        return JSON.stringify(userPrevious) === JSON.stringify(userCurrent)
    }

    //Project handle
    const handleProjectDelete = (title) => {
        setRemoveUserProject(title)
        setEditingField('removeFromProject')
        setOpenModal(true)
        setModalDescription(`You are about to remove user from project: "${title}"`)
        setModalInput('')
    }

    const handleProjectAssign = () => {
        setAssignUserProject(selectProject)
        setEditingField('assignToProject')
        setOpenModal(true)
        setModalDescription(`You are about to assign user to "${selectProject}" project`)
        setModalInput('')
    }

    const handleSelectProject = (event) => {
        setSelectProject(event.target.value)
        console.log(selectProject)

    }

    //use effect

    useEffect(() => {

        if (userDetails) setPermissionChanged(permissionChangedCheck)

    }, [permission])


    useEffect(() => {
        dispatch(resetState())
        dispatch(getAllUsersEmail({}))
        dispatch(getAllProjects({}))
    }, [])


    return (
        <Box mt={5} sx={{ overflow: 'auto', maxHeight: '650px' }} >

            <form style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} onSubmit={handleSubmit}>

                {!userDetails.email ?
                    <Typography variant='h6' flexBasis={'100%'} mb={3}>Select User to begin</Typography>
                    :
                    null}

                <FormControl
                    id='searchUser'
                    sx={{ m: 1, flexBasis: '45%' }}>
                    <InputLabel htmlFor='searchUser'
                    >{searchUser === "" ? "Select User" : "Selected User"}</InputLabel>
                    <Select
                        id="selectuser"
                        value={searchUser}
                        label="usersEmails"
                        onChange={handleSelectUsers}
                        MenuProps={{ sx: { maxHeight: '18rem' } }}
                    >
                        {admin.userEmails.map((email) => (
                            <MenuItem key={email} value={email}>{email}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{ flexBasis: '100%', mt: 5, ml: 1 }} >

                    <List
                        id="userManagementInnerTab"
                        sx={{ display: 'inline-flex', flexDirection: 'row', justifyContent: 'flex-start', whiteSpace: 'nowrap' }}
                    >
                        {userDetails.email ?
                            <ListItem className='tab-userdetails'
                                sx={{ width: 'max-content' }}>
                                <ListItemButton
                                    sx={{
                                        color: (tab === 0 ? '#a534eb' : 'black'),
                                        borderBottom: (tab === 0 ? '2px solid purple' : '')
                                    }}
                                    onClick={() => setTab(0)}
                                >
                                    <ListItemText
                                        primary="User Details"

                                    />
                                </ListItemButton>
                            </ListItem>
                            : null}

                        {userDetails.email && users.data.permission[0].resetUserPassword ?
                            <ListItem className='tab-resetpassword'
                                sx={{ width: 'max-content' }}>
                                <ListItemButton
                                    sx={{
                                        color: (tab === 1 ? '#a534eb' : 'black'),
                                        borderBottom: (tab === 1 ? '2px solid purple' : '')
                                    }}
                                    onClick={() => setTab(1)}
                                >
                                    <ListItemText
                                        primary="Reset User Password"

                                    />
                                </ListItemButton>
                            </ListItem>
                            : null}


                        {userDetails.email && (users.data.role === 'owner' || users.data.role === 'admin') ?
                            <ListItem
                                className='tab-managerole'
                                sx={{ width: 'max-content' }}
                            >
                                <ListItemButton
                                    sx={{
                                        color: (tab === 2 ? '#a534eb' : 'black'),
                                        borderBottom: (tab === 2 ? '2px solid purple' : '')
                                    }}
                                    onClick={() => setTab(2)}
                                >
                                    <ListItemText
                                        primary="Manage Role"

                                    />
                                </ListItemButton>
                            </ListItem>
                            : null}

                        {userDetails.email && (users.data.role === 'owner' || users.data.role === 'admin') ?
                            <ListItem
                                className='tab-managepermission'
                                sx={{ width: 'max-content' }}
                            >
                                <ListItemButton
                                    sx={{
                                        color: (tab === 3 ? '#a534eb' : 'black'),
                                        borderBottom: (tab === 3 ? '2px solid purple' : '')
                                    }}
                                    onClick={() => setTab(3)}
                                >
                                    <ListItemText
                                        primary="Manage Permission"

                                    />
                                </ListItemButton>
                            </ListItem>
                            : null}

                        {userDetails.email && users.data.permission[0].assignProject ?
                            <ListItem
                                className='tab-assignproject'
                                sx={{ width: 'max-content' }}
                            >
                                <ListItemButton
                                    sx={{
                                        color: (tab === 4 ? '#a534eb' : 'black'),
                                        borderBottom: (tab === 4 ? '2px solid purple' : '')
                                    }}
                                    onClick={() => setTab(4)}
                                >
                                    <ListItemText
                                        primary="Project"

                                    />
                                </ListItemButton>
                            </ListItem>
                            : null}

                    </List>
                    <Divider></Divider>
                </Box>

                {tab === 0 ?
                    <ManageUserDetails
                        userDetails={userDetails}
                        profilePictureSample={profilePictureSample}
                        firstname={firstname}
                        lastname={lastname}
                        username={username}
                        phone={phone}
                        jobtitle={jobtitle}
                        email={email}
                        emailCheck={emailCheck}
                        admin={admin}
                        handleProfilePic={handleProfilePic}
                        handleProfilePicToBlob={handleProfilePicToBlob}
                        handleFirstName={handleFirstName}
                        handleLastName={handleLastName}
                        handleUserName={handleUserName}
                        handlePhone={handlePhone}
                        handleJobTitle={handleJobTitle}
                        handleEmail={handleEmail}
                        handleEmailCheck={handleEmailCheck}
                        phoneCheck={phoneCheck}
                        setPhoneCheck={setPhoneCheck}
                        editEnabled={editEnabled}
                        users={users}
                        setConfirmChanges={setConfirmChanges}
                        handleEditConfirm={handleEditConfirm}
                        handleEditState={handleEditState}
                        dispatch={dispatch}
                        checkUsernameExist={checkUsernameExist}
                        checkEmailExist={checkEmailExist}
                    >
                    </ManageUserDetails>
                    :
                    null
                }

                {tab === 1 ?
                    <ManageUserResetPW
                        userDetails={userDetails}
                        users={users}
                        handleResetPassword={handleResetPassword}
                    >
                    </ManageUserResetPW>
                    :
                    null
                }

                {tab === 2 ?
                    <ManageUserRole
                        userDetails={userDetails}
                        users={users}
                        role={role}
                        handleChangeRole={handleChangeRole}
                        handleEditConfirm={handleEditConfirm}
                    >
                    </ManageUserRole>
                    :
                    null
                }

                {tab === 3 ?
                    <ManageUserPermission
                        userDetails={userDetails}
                        users={users}
                        role={role}
                        permission={permission}
                        permissionChanged={permissionChanged}
                        permissionChangedCheck={permissionChangedCheck}
                        userPermission={userPermission}
                        handlePermission={handlePermission}
                        handleEditState={handleEditState}
                        handleEditConfirm={handleEditConfirm}
                    >
                    </ManageUserPermission>
                    :
                    null}


                {tab === 4 ?
                    <ManageUserProject
                        admin={admin}
                        userProject={userProject}
                        selectProject={selectProject}
                        handleSelectProject={handleSelectProject}
                        handleProjectDelete={handleProjectDelete}
                        handleProjectAssign={handleProjectAssign}
                    >
                    </ManageUserProject>
                    :
                    null}


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