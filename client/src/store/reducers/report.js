import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { 
    getCountComponents, 
    getCountServer, 
    getCountStatus, 
    getCountSeverity, 
    getCountIssueType,
    getDefectId
} from '../actions/report'


let DEFAULT_REPORT_STATE = {
    report: {
        xselect: '',
        yselect: '',
        xlabel: [],
        xvalue: [],
        ylabel: [],
        yvalue: [],
        totalDefect: '',
        defectid:[]
    }
}

export const reportSlice = createSlice({
    name: 'report',
    initialState: DEFAULT_REPORT_STATE
    , reducers: {
        setXSelect: (state, action) => {
            state.report.xselect = action.payload
        },
        setYSelect: (state, action) => {
            state.report.yselect = action.payload
        },
        resetReportState: (state) => {
            state.report = DEFAULT_REPORT_STATE
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(getCountSeverity.fulfilled, (state, action) => {

                if (state.report.xselect === 'severity') {
                    const xLabel = []
                    const xValue = []
                    action.payload.map((item) => xLabel.push(item._id))
                    action.payload.map((item) => xValue.push(item.count))
                    state.report.xlabel = [...xLabel]
                    state.report.xvalue = [...xValue]
                }

                if (state.report.yselect === 'severity') {
                    const yLabel = []
                    const yValue = []
                    action.payload.map((item) => yLabel.push(item._id))
                    action.payload.map((item) => yValue.push(item.count))
                    state.report.ylabel = [...yLabel]
                    state.report.yvalue = [...yValue]
                }
            })
            .addCase(getCountStatus.fulfilled, (state, action) => {
                if (state.report.xselect === 'status') {
                    const xLabel = []
                    const xValue = []
                    action.payload.map((item) => xLabel.push(item._id))
                    action.payload.map((item) => xValue.push(item.count))
                    state.report.xlabel = [...xLabel]
                    state.report.xvalue = [...xValue]
                }

                if (state.report.yselect === 'status') {
                    const yLabel = []
                    const yValue = []
                    action.payload.map((item) => yLabel.push(item._id))
                    action.payload.map((item) => yValue.push(item.count))
                    state.report.ylabel = [...yLabel]
                    state.report.yvalue = [...yValue]
                }
            })
            .addCase(getCountComponents.fulfilled, (state, action) => {
                if (state.report.xselect === 'components') {
                    const xLabel = []
                    const xValue = []
                    action.payload.map((item) => xLabel.push(item._id))
                    action.payload.map((item) => xValue.push(item.count))
                    state.report.xlabel = [...xLabel]
                    state.report.xvalue = [...xValue]
                }

                if (state.report.yselect === 'components') {
                    const yLabel = []
                    const yValue = []
                    action.payload.map((item) => yLabel.push(item._id))
                    action.payload.map((item) => yValue.push(item.count))
                    state.report.ylabel = [...yLabel]
                    state.report.yvalue = [...yValue]
                }
            })
            .addCase(getCountIssueType.fulfilled, (state, action) => {
                if (state.report.xselect === 'issuetype') {
                    const xLabel = []
                    const xValue = []
                    action.payload.map((item) => xLabel.push(item._id))
                    action.payload.map((item) => xValue.push(item.count))
                    state.report.xlabel = [...xLabel]
                    state.report.xvalue = [...xValue]
                }

                if (state.report.yselect === 'issuetype') {
                    const yLabel = []
                    const yValue = []
                    action.payload.map((item) => yLabel.push(item._id))
                    action.payload.map((item) => yValue.push(item.count))
                    state.report.ylabel = [...yLabel]
                    state.report.yvalue = [...yValue]
                }
            })
            .addCase(getCountServer.fulfilled, (state, action) => {
                if (state.report.xselect === 'server') {
                    const xLabel = []
                    const xValue = []
                    action.payload.map((item) => xLabel.push(item._id))
                    action.payload.map((item) => xValue.push(item.count))
                    state.report.xlabel = [...xLabel]
                    state.report.xvalue = [...xValue]
                }

                if (state.report.yselect === 'server') {
                    const yLabel = []
                    const yValue = []
                    action.payload.map((item) => yLabel.push(item._id))
                    action.payload.map((item) => yValue.push(item.count))
                    state.report.ylabel = [...yLabel]
                    state.report.yvalue = [...yValue]
                }
            })
            .addCase(getDefectId.fulfilled,(state,action)=>{
                const defectIdList = []
                action.payload.map((item)=> defectIdList.push(item.defectid))
                state.report.defectid = [...defectIdList]
            })


    }
})

export const { setXSelect, setYSelect, resetReportState, getTotalDefect } = reportSlice.actions
export default reportSlice.reducer;