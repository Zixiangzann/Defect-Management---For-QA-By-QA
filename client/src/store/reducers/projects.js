import { createSlice } from '@reduxjs/toolkit'
import { showToast } from '../../utils/tools';

import { 
    addProject,
    getAllUsersForAssign 
} from '../actions/projects'

//slice for admin project management
let DEFAULT_PROJECTS_STATE = {
    assignee:{
        availableForAssign: [],
        currentAssignee: []
    }

}

export const projectsSlice = createSlice({
    name:'projects',
    initialState: DEFAULT_PROJECTS_STATE,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllUsersForAssign.fulfilled, (state,action) => {
            state.assignee.availableForAssign = action.payload.allUsersForAssign
        })
        .addCase(addProject.fulfilled,(state,action) => {
            showToast('SUCCESS',"Project Successfully Created")
        })
        .addCase(addProject.rejected,(state,action) => {
            showToast('ERROR',action.payload.data.message)
        })
    }
})

export default projectsSlice.reducer;