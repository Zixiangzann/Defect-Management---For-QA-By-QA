import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';

const ManageUserPermission = ({
    userDetails,
    users,
    role,
    permission,
    permissionChanged,
    userPermission,
    permissionChangedCheck,
    handlePermission,
    handleEditConfirm
}) => {



return(
    <Box flexBasis={'100%'}>
         {/* Change Account role and permission */}
         {userDetails.email  && (users.data.role === 'owner' || users.data.role === 'admin') ?
                    <Box flexBasis='100%'>

                        {/* Standard user control */}
                        <Typography variant='h4' sx={{ flexBasis: '100%', mt: 2 }}>Account Permission</Typography>
                        <Typography sx={{ flexBasis: '100%', mt: 2, mb: 2, fontSize: '1.2rem', fontWeight: '600' }}>Standard User</Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Defect management</Typography>
                            <FormControlLabel name='addDefect' control={<Checkbox defaultChecked={userPermission.addDefect} />} label="Add Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                            <FormControlLabel name='editOwnDefect' control={<Checkbox defaultChecked={userPermission.editOwnDefect} />} label="Edit Own Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                            <FormControlLabel name='editAllDefect' control={<Checkbox defaultChecked={userPermission.editAllDefect} />} label="Edit All Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                            <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Comment management</Typography>
                            <FormControlLabel name='addComment' control={<Checkbox defaultChecked={userPermission.addComment} />} label="Add Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                            <FormControlLabel name='editOwnComment' control={<Checkbox defaultChecked={userPermission.editOwnComment} />} label="Edit Own Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                            <FormControlLabel name='deleteOwnComment' control={<Checkbox defaultChecked={userPermission.deleteOwnComment} />} label="Delete Own Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                        </Box>


                        <Divider sx={{ flexBasis: '100%', borderBottomColor: 'black', mt: 5 }}></Divider>

                        {/* sensitive admin control, only some admin or owner should have these control */}
                        {users.data.role === 'owner' && (role === 'admin' || role === 'owner') ?
                            <>
                                <Typography sx={{ flexBasis: '100%', mt: 2, fontSize: '1.2rem', fontWeight: '600' }}>Admin</Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Defect management</Typography>
                                    <FormControlLabel name='viewAllDefect' control={<Checkbox defaultChecked={userPermission.viewAllDefect} />} label="View All Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='deleteAllDefect' control={<Checkbox defaultChecked={userPermission.deleteAllDefect} />} label="Delete All Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />

                                    <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Comment management</Typography>
                                    <FormControlLabel name='editAllComment' control={<Checkbox defaultChecked={userPermission.editAllComment} />} label="Edit All Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='deleteAllComment' control={<Checkbox defaultChecked={userPermission.deleteAllComment} />} label="Delete All Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />



                                    <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>User management</Typography>
                                    <FormControlLabel name='addUser' control={<Checkbox defaultChecked={userPermission.addUser} />} label="Add Users" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='disableUser' control={<Checkbox defaultChecked={userPermission.disableUser} />} label="Disable Users" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='deleteUser' control={<Checkbox defaultChecked={userPermission.deleteUser} />} label="Delete Users" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='changeUserDetails' control={<Checkbox defaultChecked={userPermission.changeUserDetails} />} label="Change Users Details" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='resetUserPassword' control={<Checkbox defaultChecked={userPermission.resetUserPassword} />} label="Reset Users Password" sx={{ flexBasis: '100%' }} onChange={handlePermission} />


                                    <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Project management</Typography>
                                    <FormControlLabel name='addProject' control={<Checkbox defaultChecked={userPermission.addProject} />} label="Add Projects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='assignProject' control={<Checkbox defaultChecked={userPermission.assignProject} />} label="Assign Projects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='deleteProject' control={<Checkbox defaultChecked={userPermission.deleteProject} />} label="Delete Projects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='addComponent' control={<Checkbox defaultChecked={userPermission.addComponent} />} label="Add Components" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='deleteComponent' control={<Checkbox defaultChecked={userPermission.deleteComponent} />} label="Delete Components" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                </Box>
                                
                            </>
                            :
                            null
                        }

                        <Box display={'flex'} justifyContent={'flex-start'} flexBasis={'100%'}>
                        <Button
                        variant='contained'
                        sx={{ flexBasis: '30%', mt: 1, backgroundColor: 'lightblue', color: 'black' ,mt:5}}
                        disabled={permissionChanged}
                        onClick={(e) => handleEditConfirm("confirmPermission")}
                        >
                            Update Permission</Button>
                        </Box>

                    </Box>
                    :
                    null
                }
    </Box>
)
}

export default ManageUserPermission