import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import EditDefect from '../../components/user/defects/edit'
import {
  createDefect,
  deleteDefect,
  filterDefect,
  getAllAssignee,
  getAllComponents,
  getAllDefectPaginate,
  getAllProjects,
  getDefectById,
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
    assignee: null
  },
  filter: {
    filtered: false,
    project: null,
    components: null,
    severity: null,
    status: null,
    search: '',
  },
  sort: {
    order: 1,
    sortby: 'defectid'
  },
  current: null
}

export const defectsSlice = createSlice({
  name: 'defects',
  initialState: DEFAULT_DEFECT_STATE,
  reducers: {
    resetDataState: (state, action) => {
      state.data = DEFAULT_DEFECT_STATE
    },
    resetFilterState: (state, action) => {
      state.filter = DEFAULT_DEFECT_STATE.filter
    },
    setFilterState: (state, action) => {
      state.filter = action.payload
    },
    setSearch: (state, action) => {
      state.filter.search = action.payload
      if (state.filter.search !== '' || state.filter.project !== null || state.filter.components !== null || state.filter.severity !== null || state.filter.status !== null) {
        state.filter.filtered = true;
      }else{
        state.filter.filtered = false;
      }
    },
    setOrder: (state, action) => {
      state.sort.order = action.payload
    },
    setSortBy: (state, action) => {
      state.sort.sortby = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.data.project = action.payload.project
      })
      .addCase(getAllAssignee.fulfilled, (state, action) => {
        state.data.assignee = action.payload.assignee
      })
      .addCase(getAllComponents.fulfilled, (state, action) => {
        state.data.components = action.payload.components
      })
      .addCase(createDefect.pending, (state) => { state.loading = true })
      .addCase(createDefect.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createDefect.rejected, (state) => { state.loading = false })
      .addCase(getAllDefectPaginate.pending, (state) => { state.loading = true })
      .addCase(getAllDefectPaginate.fulfilled, (state, action) => {
        state.loading = false;
        state.defectLists = action.payload
      })
      .addCase(getAllDefectPaginate.rejected, (state) => { state.loading = false })
      .addCase(filterDefect.fulfilled, (state, action) => {
        state.loading = false
        state.defectLists = action.payload
        if(state.filter.search !== '' || state.filter.project !== null || state.filter.components !== null || state.filter.severity !== null || state.filter.status !== null){
          state.filter.filtered = true;
        }else{
          state.filter.filtered = false;
        }
      })
      .addCase(getDefectById.pending, (state) => { state.loading = true })
      .addCase(getDefectById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getDefectById.rejected, (state) => { state.loading = false })
  }
})

export const { resetDataState, resetFilterState, setFilterState, setSearch, setOrder, setSortBy } = defectsSlice.actions;
export default defectsSlice.reducer;