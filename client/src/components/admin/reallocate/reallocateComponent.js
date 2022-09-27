//comp
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


//lib
import { addHistory } from "../../../store/actions/history";
import { updateDefect } from "../../../store/actions/defects";

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
import { defectListOfComponentToBeRemoved } from "../../../store/actions/projects";


const ReallocateComponent = ({
    defectDetails,
    projectAvailableComponent,
    component,
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

    const [componentState, setComponentState] = useState('');
    const [componentChanged, setComponentChanged] = useState(false)


    const handleChange = (event) => {
        setComponentState(event.target.value)
        setComponentChanged(true)
    };

    useEffect(() => {
        if (defectDetails) {
            setComponentState(defectDetails.components)
        }
    }, [defectDetails])

    useEffect(() => {
        //update assignee, only update if have differences and assignee must have at least 1
        if (componentChanged && componentState) {

            if (componentState !== defectDetails.components) {
                
                    //updating component
                    dispatch(updateDefect({ components: componentState, defectId: defectDetails.defectid }))
                    .unwrap()
                    .then(()=>{
                        dispatch(defectListOfComponentToBeRemoved({title:project,componentToBeRemove:component}))
                    })

                    dispatch(addHistory({
                        defectId: defectDetails.defectid,
                        from: defectDetails.components,
                        to: componentState,
                        field: "components",
                        editdate: new Date()
                    }))

                    
                }
        }
        setComponentChanged(false)

    }, [componentChanged])


    return(
        <TableRow
            key={`${defectDetails.defectid}`}
        >
            <TableCell>{defectDetails.defectid}</TableCell>
            <TableCell>{defectDetails.title}</TableCell>
            {defectDetails ?
                < TableCell >
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="component-checkbox-label">Components</InputLabel>
                        <Select
                            labelId="component-checkbox-label"
                            id="componentSelect"
                            value={componentState}
                            onChange={handleChange}
                            input={<OutlinedInput label="Components" />}
                            MenuProps={MenuProps}
                            sx={{color:'#9c27b0'}}
                        >

                            {projectAvailableComponent ? projectAvailableComponent.map((com) => (
                                <MenuItem key={com} value={com}>{com}</MenuItem>
                            ))
                                :
                                null
                            }
                        </Select>
                        {!componentState ?
                            <>
                                <FormHelperText error>Changes not applied.</FormHelperText>
                                <FormHelperText error> Defect must have be assigned to 1 component</FormHelperText>
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

export default ReallocateComponent;