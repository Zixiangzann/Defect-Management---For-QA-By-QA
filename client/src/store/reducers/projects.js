import { createSlice } from '@reduxjs/toolkit'
import { showToast } from '../../utils/tools';
import { getAllProjects } from '../actions/admin';
import { getProjectByTitle } from '../actions/defects';
import { addComponents, removeComponents, assignProject, removeFromProject,updateProjectTitleAndDescription } from '../actions/projects';



import { 
    addProject,
    defectListOfComponentToBeRemoved,
    defectListOfUserToBeRemoved,
    getAllUsersForAssign 
} from '../actions/projects'

//slice for admin project management
let DEFAULT_PROJECTS_STATE = {
    assignee:{
        availableForAssign: [],
        currentAssignee: []
    },
    projectList:[],
    selectedProjectDetails:{},
    defectListUserToBeRemoved: {},
    defectListComponentToBeRemoved: {}

}

export const projectsSlice = createSlice({
    name:'projects',
    initialState: DEFAULT_PROJECTS_STATE,
    reducers:{
        resetState: (state, action) => {
            state.selectedProjectDetails = {}
          },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllUsersForAssign.fulfilled, (state,action) => {
            state.assignee.availableForAssign = action.payload.allUsersForAssign
        })
        .addCase(addProject.fulfilled,(state,action) => {
            showToast('SUCCESS',"Project created successfully")
        })
        .addCase(addProject.rejected,(state,action) => {
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(getAllProjects.fulfilled,(state,action)=>{
            state.projectList = [...action.payload.project]
        })
        .addCase(getProjectByTitle.fulfilled,(state,action)=>{
            state.selectedProjectDetails = action.payload.project
        })
        .addCase(updateProjectTitleAndDescription.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Project details updated successfully")
        })
        .addCase(updateProjectTitleAndDescription.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(assignProject.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Assignee added successfully")
        })
        .addCase(assignProject.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(removeFromProject.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Assignee removed successfully")
        })
        .addCase(removeFromProject.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(addComponents.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Component added successfully")
        })
        .addCase(addComponents.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(removeComponents.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Component removed successfully")
        })
        .addCase(removeComponents.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(defectListOfComponentToBeRemoved.fulfilled,(state,action)=>{
            state.defectListComponentToBeRemoved = action.payload
        })
        .addCase(defectListOfUserToBeRemoved.fulfilled,(state,action)=>{
            state.defectListUserToBeRemoved = action.payload
        })
        .addCase(defectListOfComponentToBeRemoved.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(defectListOfUserToBeRemoved.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })
    }
})

export const {resetState} = projectsSlice.actions
export default projectsSlice.reducer;