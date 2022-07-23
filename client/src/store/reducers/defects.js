import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import EditDefect from '../../components/user/defects/edit'
import { createDefect, deleteDefect, filterDefect, getAllAssignee,getAllComponents,getAllDefectPaginate,getAllProjects,getDefectById,updateDefect } from '../actions/defects'

let DEFAULT_DEFECT_STATE ={
    loading:false,
    data:{
        defectid:null,
        title:null,
        description:null,
        project:null,
        components:null,
        issuetype:null,
        severity:null,
        status:null,
        assignee:null
    },
    filter:{
        filtered:false,
        project:null,
        components:null,
        severity:null,
        status:null
    },
    current:null
}

export const defectsSlice = createSlice({
    name:'defects',
    initialState:DEFAULT_DEFECT_STATE,
    reducers:{
      resetDataState: (state,action) =>{
        state.data = DEFAULT_DEFECT_STATE
      },
      setFilterState:(state,action) => {
        state.filter = action.payload
      }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllProjects.fulfilled,(state,action) => {
            state.data.project = action.payload.project
        })
        .addCase(getAllAssignee.fulfilled,(state,action)=>{
            state.data.assignee = action.payload.assignee
        })
        .addCase(getAllComponents.fulfilled,(state,action)=>{
            state.data.components = action.payload.components
        })
        .addCase(createDefect.pending,(state)=>{state.loading=true})
        .addCase(createDefect.fulfilled,(state,action) => {
            state.loading=false;
        })
        .addCase(createDefect.rejected,(state)=>{state.loading=false})
        .addCase(getAllDefectPaginate.pending,(state)=>{state.loading=true})
        .addCase(getAllDefectPaginate.fulfilled,(state,action)=>{
            state.loading = false;
            state.defectLists = action.payload
            state.filter.filtered = false;
        })
        .addCase(getAllDefectPaginate.rejected,(state)=>{state.loading=false})
        .addCase(filterDefect.fulfilled,(state,action)=>{
        state.loading=false
        state.defectLists = action.payload
        state.filter.filtered = true;
    })
        .addCase(getDefectById.pending,(state)=>{state.loading=true})
        .addCase(getDefectById.fulfilled,(state,action)=>{
            state.loading = false;
            state.current = action.payload;
        })
        .addCase(getDefectById.rejected,(state) => {state.loading=false})
    }
    })
    
    export const {resetDataState,setFilterState} = defectsSlice.actions;
    export default defectsSlice.reducer;