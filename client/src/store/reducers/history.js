import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import {addHistory, getHistoryByDefectIdAndDate, getDefectEditDate} from '../actions/history'
import { showToast } from '../../utils/tools';

export const historySlice = createSlice({
    name:'history',
    initialState: {
        defectHistory:{},
        defectEditDate:[],
        allDefectHistory:{},
    },reducers:{

    },
    extraReducers:(builder)=>{
        builder
        .addCase(getHistoryByDefectIdAndDate.fulfilled,(state,action)=>{
            state.defectHistory = action.payload.data
        })
        .addCase(getDefectEditDate.fulfilled,(state,action)=>{
            state.defectEditDate = [...action.payload.data]
        })
    }
})

export default historySlice.reducer;