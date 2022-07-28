import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import {addComment, getCommentByDefectIdPaginate} from '../actions/comments'
import { showToast } from '../../utils/tools';

export const commentsSlice = createSlice({
    name:'comments',
    initialState: {
        comments:{},
    },reducers:{

    },
    extraReducers:(builder)=>{
        builder
        .addCase(getCommentByDefectIdPaginate.fulfilled,(state,action)=>{
            state.comments = action.payload.data
        })
        .addCase(addComment.fulfilled,(state,action)=>{
            showToast('SUCCESS',<div>Commented</div>);
        })
    }
})

export default commentsSlice.reducer;