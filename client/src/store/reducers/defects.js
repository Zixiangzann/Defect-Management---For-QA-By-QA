import { createSlice } from '@reduxjs/toolkit'
import { showToast } from '../../utils/tools'

import {
  createDefect,
  defectWatch,
  deleteDefect,
  filterDefect,
  getAllAssignee,
  getAllComponents,
  getAllProjects,
  getDefectById,
  updateAttachment,
  updateDefect,
} from '../actions/defects'

let DEFAULT_DEFECT_STATE = {
  loading: false,
  data: {
    defectid: null,
    reporter: null,
    title: null,
    description: null,
    project: null,
    components: null,
    issuetype: null,
    severity: null,
    status: null,
    assignee: null,
    watching: null,
    attachment: []
  },
  filter: {
    filtering: false,
    filtered: false,
    field:{
    project: null,
    components: null,
    server:null,
    severity: null,
    status: null,
    assignee: [],
    reporter: null,
    search: '',
    },
    showColumn:{
      menu:true,
      defectid:true,
      title:true,
      project:true,
      assigneeDetails: true,
      components:true,
      severity:true,
      status:true,
      server:false,
      reporter:false,
      createdDate:false,
      lastUpdatedDate: false,
    }
  },
  sort: {
    order: -1,
    sortby: 'lastUpdatedDate'
  },
  current: {
    defect: null,
    assignee: null
  }
}

export const defectsSlice = createSlice({
  name: 'defects',
  initialState: DEFAULT_DEFECT_STATE,
  reducers: {
    resetDataState: (state, action) => {
      state.data = DEFAULT_DEFECT_STATE
    },
    resetFilterState: (state, action) => {
      state.filter.filtered = DEFAULT_DEFECT_STATE.filter.filtered
      state.filter.field = DEFAULT_DEFECT_STATE.filter.field
      state.data.components = null;
    },
    setFilterState: (state, action) => {
      state.filter.field = action.payload
      
      if (
        state.filter.field.search !== '' 
        || state.filter.field.project !== null 
        || state.filter.field.server !== null  
        || state.filter.field.components !== null 
        || state.filter.field.severity !== null 
        || state.filter.field.status !== null
        || state.filter.field.assignee !== null
        || state.filter.field.reporter !== null) {
        state.filter.filtered = true;
      }
    },
    setSearch: (state, action) => {
      state.filter.field.search = action.payload
      if (
        state.filter.field.search !== '' 
        || state.filter.field.project !== null 
        || state.filter.field.server !== null  
        || state.filter.field.components !== null 
        || state.filter.field.severity !== null 
        || state.filter.field.status !== null
        || state.filter.field.assignee !== null
        || state.filter.field.reporter !== null) {
        state.filter.filtered = true;
      } else {
        state.filter.filtered = false;
      }
    },
    setOrder: (state, action) => {
      state.sort.order = action.payload
    },
    setSortBy: (state, action) => {
      state.sort.sortby = action.payload
    },
    setShowColumn: (state, action) => {
      state.filter.showColumn = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.data.project = [...action.payload.project.sort((a, b) => a.title.localeCompare(b.title))]
      })
      .addCase(getAllAssignee.fulfilled, (state, action) => {
        state.data.assignee = action.payload.assignee
      })
      .addCase(getAllComponents.fulfilled, (state, action) => {
        state.data.components = action.payload.components
      })
      .addCase(defectWatch.fulfilled, (state, action) => {
        console.log(action.payload.watch)
        showToast('SUCCESS',action.payload.watch)
      })
      .addCase(defectWatch.rejected, (state,action) => {
        showToast('ERROR',action.payload.data.message)
      })
      .addCase(createDefect.pending, (state) => { state.loading = true })
      .addCase(createDefect.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createDefect.rejected, (state) => { state.loading = false })
      .addCase(filterDefect.pending,(state, action) => {
        state.filter.filtering = true
      })
      .addCase(filterDefect.fulfilled, (state, action) => {
        state.filter.filtering = false
        state.loading = false
        state.defectLists = action.payload
        if (state.filter.field.search !== '' 
        || state.filter.field.project !== null 
        || state.filter.field.components !== null 
        || state.filter.field.severity !== null 
        || state.filter.field.status !== null
        || state.filter.field.assignee !== null
        || state.filter.field.reporter !== null
        ) {
          state.filter.filtered = true;
        } else {
          state.filter.filtered = false;
        }
      })
      .addCase(filterDefect.rejected, (state, action) => {
        state.filter.filtering = false
        showToast('ERROR',"Failed to get defect list")
      })
      .addCase(getDefectById.pending, (state) => { state.loading = true })
      .addCase(getDefectById.fulfilled, (state, action) => {
        state.loading = false;
        state.current.defect = action.payload[0].defect;
        state.current.assignee = action.payload[1].assignee;
      })
      .addCase(getDefectById.rejected, (state) => { state.loading = false })
  }
})

export const { resetDataState, resetFilterState, setFilterState, setSearch, setOrder, setSortBy, setShowColumn } = defectsSlice.actions;
export default defectsSlice.reducer;