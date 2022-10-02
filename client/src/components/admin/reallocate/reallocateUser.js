//comp
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//lib
import { checkArrayEqual } from "../../../utils/tools";
import { defectListOfUserToBeRemoved } from "../../../store/actions/projects";
import { addHistory } from "../../../store/actions/history";
import { getAllAssignee, updateDefect } from "../../../store/actions/defects";

//mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Typography from "@mui/material/Typography";
import Avatar from '@mui/material/Avatar';
import FormHelperText from "@mui/material/FormHelperText";


const ReallocateUser = ({
    defectDetails,
    projectAvailableAssignee,
    fromAssignee,
    user,
    project
}) => {



    const dispatch = useDispatch();

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 'max-content',
            },
        },
    };

    const [assignee, setAssignee] = useState([]);
    const [assigneeChanged, setAssigneeChanged] = useState(false)

    //for getting username for history
    const [before, setBefore] = useState([])
    const [after, setAfter] = useState([])
    const [assigneeUpdated, setAssigneeUpdated] = useState(false)

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setAssignee(
            typeof value === 'string' ? value.split(',') : value,
        );

        setAssigneeChanged(true)
    };

    useEffect(() => {

        //before changes

        if (defectDetails) {
            let initial = []
            projectAvailableAssignee.map((user) => {
                if (defectDetails.assignee.indexOf(user.email) > -1) {
                    initial.push(user.username)
                }
            })
            setBefore([...initial])
        }

        if (defectDetails) {
            setAssignee(defectDetails.assignee)
        }

    }, [defectDetails])


    useEffect(() => {
        //update assignee, only update if have differences and assignee must have at least 1
        if (assigneeChanged) {


            if (!checkArrayEqual(assignee, defectDetails.assignee)) {
                if (assignee.length >= 1) {
                    //updating assignee
                    dispatch(updateDefect({ assignee: assignee, defectId: defectDetails.defectid }))
                        .unwrap()
                        .then(() => {
                            let current = []
                            if (assignee && assigneeChanged) {
                                projectAvailableAssignee.map((user) => {
                                    if (assignee.indexOf(user.email) > -1) {
                                        current.push(user.username)
                                    }
                                })
                                setAfter([...current])
                                setAssigneeUpdated(true)
                            }
                        })

                }
            }
            setAssigneeChanged(false)
        }




    }, [assigneeChanged])

    useEffect(() => {
        if (assigneeUpdated) {
            dispatch(addHistory({
                defectId: defectDetails.defectid,
                from: before,
                to: after,
                field: "assignee",
                editdate: new Date()
            }))
            dispatch(defectListOfUserToBeRemoved({ projectTitle: project, userEmail: user }))
            
            setAssigneeUpdated(false)
        }
    }, [assigneeUpdated])


    return (
        <TableRow
            key={`${defectDetails.defectid}`}
        >
            <TableCell>{defectDetails.defectid}</TableCell>
            <TableCell>{defectDetails.title}</TableCell>
            {defectDetails ?
                < TableCell >
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="assignee-checkbox-label">Assignee</InputLabel>
                        <Select
                            labelId="assignee-checkbox-label"
                            id="assigneeSelect"
                            multiple
                            value={assignee}
                            onChange={handleChange}
                            input={<OutlinedInput label="Assignee" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip
                                            key={value}
                                            label={value}
                                            color={value === user ? 'error' : 'info'}
                                        />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >


                            {projectAvailableAssignee ? projectAvailableAssignee.map((user) => (
                                <MenuItem key={user.email} value={user.email}>
                                    <Checkbox checked={assignee.indexOf(user.email) > -1} />
                                    <Avatar
                                        alt={user.email}
                                        src={user.photoURL}
                                        sx={{ marginRight: '1rem', width: 65, height: 65 }}></Avatar>

                                    <Box>
                                        <Typography
                                            sx={{ maxWidth: '15rem', overflow: 'auto', fontWeight: '600' }}
                                        >{user.email}</Typography>
                                        <Typography
                                            sx={{ maxWidth: '15rem', overflow: 'auto', fontWeight: '300' }}
                                        >@{user.username}</Typography>
                                    </Box>
                                </MenuItem>
                            ))
                                :
                                null
                            }
                        </Select>
                        {assignee.length === 0 ?
                            <>
                                <FormHelperText error>Changes not applied.</FormHelperText>
                                <FormHelperText error> Defect must have at least 1 assignee.</FormHelperText>
                            </>
                            :
                            null
                        }
                    </FormControl>
                </TableCell>

                :
                null
            }
        </TableRow >
    )

}

export default ReallocateUser;