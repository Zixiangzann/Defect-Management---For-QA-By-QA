import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import {addHistory, getHistoryByDefectIdPaginate} from '../actions/history'
import { showToast } from '../../utils/tools';

export const historySlice = createSlice({
    name:'history',
    initialState: {
        history:{},
    },reducers:{

    },
    extraReducers:(builder)=>{
        builder
        .addCase(getHistoryByDefectIdPaginate.fulfilled,(state,action)=>{
            state.history = action.payload.data
        })
    }
})

export default historySlice.reducer;