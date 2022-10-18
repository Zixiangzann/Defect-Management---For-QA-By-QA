import { createSlice } from '@reduxjs/toolkit'
import { showToast } from '../../utils/tools';
import { getWatchlistDefectList,getAllProjects,getAllAssignee, getAllComponents,getWatchlist, updateLayout, updateFieldFilter } from '../actions/watchlist';


let DEFAULT_WATCHLIST_STATE = {
    loading: false,
    defectList: {
        data: {},
        filter: {
            filtering: false,
            filtered: false,
            field: {
                // project: null,
                // components: null,
                // server: null,
                // severity: null,
                // status: null,
                // assignee: [],
                // reporter: null,
                // search: '',
            },
            showColumn: {
                menu: true,
                defectid: true,
                title: true,
                project: true,
                assigneeDetails: true,
                components: true,
                severity: true,
                status: true,
                server: false,
                reporter: false,
                createdDate: false,
                lastUpdatedDate: false,
            },
            sort: {
                order: -1,
                sortby: 'lastUpdatedDate'
            },
        },
        allProjects:[],
        allAssignee:[],
        allComponents:[],
    },
    projectReport: {
        chart: {},
        table: {}
    },
    savedLayout: {}
}

export const watchlistSlice = createSlice({
    name: 'watchlist',
    initialState: DEFAULT_WATCHLIST_STATE,
    reducers: {
        setShowColumn: (state, action) => {
            state.defectList.filter.showColumn = action.payload
        },
        resetFilterState: (state, action) => {
            state.defectList.filter.filtered = DEFAULT_WATCHLIST_STATE.defectList.filter.filtered
            state.defectList.filter.field = DEFAULT_WATCHLIST_STATE.defectList.filter.field
            state.defectList.data.components = null;
        },
        setFilterState: (state, action) => {
            state.defectList.filter.field = action.payload

            if (
                state.defectList.filter.field.search !== ''
                || state.defectList.filter.field.project !== null
                || state.defectList.filter.field.server !== null
                || state.defectList.filter.field.components !== null
                || state.defectList.filter.field.severity !== null
                || state.defectList.filter.field.status !== null
                || state.defectList.filter.field.assignee !== null
                || state.defectList.filter.field.reporter !== null) {
                state.defectList.filter.filtered = true;
            }
        },
        setSearch: (state, action) => {
            state.defectList.filter.field.search = action.payload
            if (
                state.defectList.filter.field.search !== ''
                || state.defectList.filter.field.project !== null
                || state.defectList.filter.field.server !== null
                || state.defectList.filter.field.components !== null
                || state.defectList.filter.field.severity !== null
                || state.defectList.filter.field.status !== null
                || state.defectList.filter.field.assignee !== null
                || state.defectList.filter.field.reporter !== null) {
                state.defectList.filter.filtered = true;
            } else {
                state.defectList.filter.filtered = false;
            }
        },
        setOrder: (state, action) => {
            state.defectList.filter.sort.order = action.payload
        },
        setSortBy: (state, action) => {
            state.defectList.filter.sort.sortby = action.payload
        },
        setSavedLayout: (state, action) => {
            state.savedLayout = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWatchlistDefectList.fulfilled, (state, action) => {
                state.defectList.data = action.payload;
            })
            .addCase(getAllProjects.fulfilled, (state, action) => {
                state.defectList.allProjects = [...action.payload.project.sort((a, b) => a.title.localeCompare(b.title))]
            })
            .addCase(getAllAssignee.fulfilled, (state, action) => {
                state.defectList.allAssignee= action.payload.assignee
            })
            .addCase(getAllComponents.fulfilled, (state, action) => {
                state.defectList.allComponents = action.payload.components
            })
            .addCase(getWatchlist.fulfilled, (state,action) => {
                state.savedLayout = action.payload.layouts
                state.defectList.filter.field = action.payload.defectList.filter.field
            })
            .addCase(updateLayout.fulfilled, (state,action) => {
                state.savedLayout = action.payload.layouts
            })
            .addCase(updateFieldFilter.fulfilled, (state,action) => {
                state.defectList.filter.field = action.payload.defectList.filter.field
            })

    }
})

export const { setShowColumn, resetFilterState, setFilterState, setSearch, setOrder, setSortBy, setSavedLayout } = watchlistSlice.actions;
export default watchlistSlice.reducer;