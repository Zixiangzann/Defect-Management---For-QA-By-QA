import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tooltip from '@mui/material/Tooltip';

const ManageUserDetails = ({
    userDetails,
    firstname,
    lastname,
    username,
    jobtitle,
    email,
    emailCheck,
    admin,
    handleFirstName,
    handleLastName,
    handleUserName,
    handleJobTitle,
    handleEmail,
    handleEmailCheck,
    editEnabled,
    users,
    handleEditConfirm,
    handleEditState,
    dispatch,
    checkUsernameExist,
    checkEmailExist
}) => {
    return (
        <Box flexBasis='100%'>
            {userDetails.email  ?
                <Box>

                    <Typography variant='h5' mb={5} mt={5} flexBasis='60%'>User Details</Typography>
                    
                    {users.data.permission[0].changeUserDetails ?
                    <Typography variant='h7' mb={5} mt={5} flexBasis='100%'>Click on <EditIcon  sx={{ color: 'blue' }}/> 
                     to edit field and click on <CheckCircleIcon sx={{ color: 'green' }}/> to confirm changes, unconfirmed changes will not be saved</Typography>
                    :
                    null}

                     <Box flexBasis={100} mb={5}></Box>

                    <FormControl
                        id='addUserFirstNameForm'
                        sx={{ m: 1, width:'80%' }}>
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
                        sx={{ m: 1, width:'80%' }}>
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
                        sx={{ m: 1, width:'80%' }}>
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


                    <FormControl id='addUserEmailForm' sx={{ m: 1, width:'80%' }}>
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


                    <FormControl id='jobTitleForm' sx={{ m: 1, width:'80%' }}>
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
        </Box>
    )
}


export default ManageUserDetails