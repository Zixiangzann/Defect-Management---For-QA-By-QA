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
    handleEditConfirm,
    setConfirmChanges
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
                            <FormControlLabel name='addDefect' control={<Checkbox checked={permission.addDefect} />} label="Add Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                            <FormControlLabel name='editOwnDefect' control={<Checkbox checked={permission.editOwnDefect} />} label="Edit Own Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                            <FormControlLabel name='editAllDefect' control={<Checkbox checked={permission.editAllDefect} />} label="Edit All Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                            <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Comment management</Typography>
                            <FormControlLabel name='addComment' control={<Checkbox checked={permission.addComment} />} label="Add Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                            <FormControlLabel name='editOwnComment' control={<Checkbox checked={permission.editOwnComment} />} label="Edit Own Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                            <FormControlLabel name='deleteOwnComment' control={<Checkbox checked={permission.deleteOwnComment} />} label="Delete Own Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                        </Box>


                        <Divider sx={{ flexBasis: '100%', borderBottomColor: 'black', mt: 5 }}></Divider>

                        {/* sensitive admin control, only some admin or owner should have these control */}
                        {users.data.role === 'owner' && (role === 'admin' || role === 'owner') ?
                            <>
                                <Typography sx={{ flexBasis: '100%', mt: 2, fontSize: '1.2rem', fontWeight: '600' }}>Admin</Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Defect management</Typography>
                                    <FormControlLabel name='viewAllDefect' control={<Checkbox checked={permission.viewAllDefect} />} label="View All Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='deleteAllDefect' control={<Checkbox checked={permission.deleteAllDefect} />} label="Delete All Defects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />

                                    <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Comment management</Typography>
                                    <FormControlLabel name='editAllComment' control={<Checkbox checked={permission.editAllComment} />} label="Edit All Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='deleteAllComment' control={<Checkbox checked={permission.deleteAllComment} />} label="Delete All Comments" sx={{ flexBasis: '100%' }} onChange={handlePermission} />

                                    <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>User management</Typography>
                                    <FormControlLabel name='addUser' control={<Checkbox checked={permission.addUser} />} label="Add Users" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='disableUser' control={<Checkbox checked={permission.disableUser} />} label="Disable Users" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='deleteUser' control={<Checkbox checked={permission.deleteUser} />} label="Delete Users" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='changeUserDetails' control={<Checkbox checked={permission.changeUserDetails} />} label="Change Users Details" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='resetUserPassword' control={<Checkbox checked={permission.resetUserPassword} />} label="Reset Users Password" sx={{ flexBasis: '100%' }} onChange={handlePermission} />

                                    <Typography sx={{ flexBasis: '100%', mt: 2, textDecoration: 'underline' }}>Project management</Typography>
                                    <FormControlLabel name='addProject' control={<Checkbox checked={permission.addProject} />} label="Add Projects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='assignProject' control={<Checkbox checked={permission.assignProject} />} label="Assign Projects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='deleteProject' control={<Checkbox checked={permission.deleteProject} />} label="Delete Projects" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='addComponent' control={<Checkbox checked={permission.addComponent} />} label="Add Components" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                    <FormControlLabel name='deleteComponent' control={<Checkbox checked={permission.deleteComponent} />} label="Delete Components" sx={{ flexBasis: '100%' }} onChange={handlePermission} />
                                </Box>
                                
                            </>
                            :
                            null
                        }

                        <Box display={'flex'} justifyContent={'flex-start'} flexBasis={'100%'}>
                        <Button
                        id="changePermissionBtn"
                        variant='contained'
                        color='primary'
                        sx={{ flexBasis: '30%', mt: 1 ,mt:5}}
                        // disabled={permissionChanged}
                        onClick={(e) => {
                            setConfirmChanges("confirmPermission")
                        }}
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