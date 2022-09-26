//get the defect list of the component/user about to be removed from the project
//ask to reallocate before allowing to remove the component/user.

//lib
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { defectListOfUserToBeRemoved } from "../../../store/actions/projects";
import { useNavigate } from 'react-router-dom'


//MUI
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


const ReallocateUserPrompt = ({
    open,
    setOpen,
    user,
    defectListUser
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


    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };




    return (
        <Modal
            open={open ? open : false}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >

            <Box sx={style}>
                {defectListUser && defectListUser.length ?
                    <Box p={2}>
                        <Typography display={'inline'}>There are total {defectListUser.length} {defectListUser > 1 ? "defect" : "defects"} assigned to </Typography >
                        <Typography sx={{display:'inline',color:'blue',fontWeight:'600'}}>{user}</Typography>
                        <Typography sx={{mt:1,mb:1,color:'red'}}>To remove the user from this project, you will need to remove the user from the defect assignee</Typography>

                        <TableContainer
                        sx={{maxHeight:'500px'}}>
                            <Table
                            stickyHeader
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Defect ID</TableCell>
                                        <TableCell>Summary</TableCell>
                                        {/* <TableCell>Current assignee</TableCell> */}
                                        <TableCell>Link</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {defectListUser.map((defect, index) => (
                                        <TableRow
                                            key={`${defect.defectid}_${index}`}
                                        >
                                            <TableCell>{defect.defectid}</TableCell>
                                            <TableCell>{defect.title}</TableCell>
                                            {/* <TableCell
                                            sx={{wordBreak:'break-word'}}
                                            >{(defect.assignee).join(' ')}</TableCell> */}
                                            <TableCell>
                                                <Button
                                                    onClick={() => { openInNewTab(`/defect/view/${defect.defectid}`) }}
                                                >
                                                    Go to defect
                                                </Button></TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    :
                    null
                }


            </Box >
        </Modal>


    )
}

export default ReallocateUserPrompt;