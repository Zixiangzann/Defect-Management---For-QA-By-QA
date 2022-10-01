import { createSlice } from '@reduxjs/toolkit'
import { showToast } from '../../utils/tools';
import { getAllProjects } from '../actions/admin';
import { getProjectByTitle } from '../actions/defects';
import { addComponents, removeComponents, assignProject, removeFromProject,updateProjectTitleAndDescription, checkProjectTitleExist } from '../actions/projects';



import { 
    addProject,
    defectListOfComponentToBeRemoved,
    defectListOfUserToBeRemoved,
    getAllUsersForAssign 
} from '../actions/projects'

//slice for admin project management
let DEFAULT_PROJECTS_STATE = {
    loading:false,
    error:{
        projectTitleTaken: null
    },
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
        .addCase(checkProjectTitleExist.fulfilled,(state,action) => {
            if(action.payload.message){
                state.error.projectTitleTaken = action.payload.message
            }else{
                state.error.projectTitleTaken = null
            }
        })
        .addCase(addProject.pending,(state,action) => {
           state.loading = true;
        })
        .addCase(addProject.fulfilled,(state,action) => {
            state.loading = false;
            showToast('SUCCESS',"Project created successfully")
        })
        .addCase(addProject.rejected,(state,action) => {
            state.loading = false;
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(getAllProjects.fulfilled,(state,action)=>{
            state.projectList = [...action.payload.project]
        })
        .addCase(getProjectByTitle.fulfilled,(state,action)=>{
            state.selectedProjectDetails = action.payload.project
        })
        .addCase(updateProjectTitleAndDescription.pending,(state,action)=>{
            state.loading = true;
        })
        .addCase(updateProjectTitleAndDescription.fulfilled,(state,action)=>{
            state.loading = false;
            showToast('SUCCESS',"Project details updated successfully")
        })
        .addCase(updateProjectTitleAndDescription.rejected,(state,action)=>{
            state.loading = false;
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(assignProject.pending,(state,action)=>{
            state.loading = true;
        })
        .addCase(assignProject.fulfilled,(state,action)=>{
            state.loading = false;
            showToast('SUCCESS',"Assignee added successfully")
        })
        .addCase(assignProject.rejected,(state,action)=>{
            state.loading = false;
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(removeFromProject.pending,(state,action)=>{
            state.loading = true;
        })
        .addCase(removeFromProject.fulfilled,(state,action)=>{
            state.loading = false;
            showToast('SUCCESS',"Assignee removed successfully")
        })
        .addCase(removeFromProject.rejected,(state,action)=>{
            state.loading = false;
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(addComponents.pending,(state,action)=>{
            state.loading = true;
        })
        .addCase(addComponents.fulfilled,(state,action)=>{
            state.loading = false;
            showToast('SUCCESS',"Component added successfully")
        })
        .addCase(addComponents.rejected,(state,action)=>{
            state.loading = false;
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(removeComponents.pending,(state,action)=>{
            state.loading = true;
        })
        .addCase(removeComponents.fulfilled,(state,action)=>{
            state.loading = false;
            showToast('SUCCESS',"Component removed successfully")
        })
        .addCase(removeComponents.rejected,(state,action)=>{
            state.loading = false;
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