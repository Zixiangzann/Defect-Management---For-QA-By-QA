//get the defect list of the component/user about to be removed from the project
//ask to reallocate before allowing to remove the component/user.


//lib
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { defectListOfUserToBeRemoved } from "../../../store/actions/projects";
import { useNavigate } from 'react-router-dom'

//comp
import ReallocateUser from "./reallocateUser";

//MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ReallocateComponent from "./reallocateComponent";


const ReallocateComponentPrompt = ({
    open,
    setOpen,
    project,
    component,
    projectAvailableComponent,
    defectListComponent
}) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'maxContent',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const dispatch = useDispatch();

    return (
        <Modal
            open={open ? open : false}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >

            <Box sx={style}>
                {defectListComponent && defectListComponent.length ?
                    <Box p={2}>

                        <Typography display={'inline'}>There are total {defectListComponent.length} {defectListComponent.length > 1 ? "defects" : "defect"} assigned to this component </Typography >
                        <Typography sx={{ display: 'inline', color: '#9c27b0', fontWeight: '600' }}>"{component}"</Typography>
                        <Typography sx={{ mt: 1, mb: 1, color: 'red' }}>To remove this component, you will need to change the defect component to some other component.</Typography>
                        {/* <Typography sx={{ mt: 1, mb: 1, color: 'red' }}>Please add the component first if it does not exist.</Typography> */}

                        <TableContainer
                            sx={{ maxHeight: '500px' }}>
                            <Table
                                stickyHeader
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Defect ID</TableCell>
                                        <TableCell>Summary</TableCell>
                                        <TableCell>Components</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {defectListComponent.map((defect, index) => (
                                        <ReallocateComponent
                                            key={defect.defectid}
                                            component={component}
                                            project={project}
                                            defectDetails={defect}
                                            projectAvailableComponent={projectAvailableComponent}
                                        >
                                        </ReallocateComponent>
                                    ))}

                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: 4, mt: 4 }}>
                            <Button
                                variant="contained"
                                onClick={() => setOpen(false)}>
                                Close
                            </Button>

                        </Box>
                    </Box>
                    :
                    null
                }


            </Box >
        </Modal >


    )
}

export default ReallocateComponentPrompt;