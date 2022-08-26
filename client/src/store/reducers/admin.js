import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import {addComment, checkEmailExist, checkUsernameExist, getCommentByDefectIdPaginate, getUserByEmail} from '../actions/admin'
import { showToast } from '../../utils/tools';

export const adminSlice = createSlice({
    name:'admin',
    initialState: {
        error:{
            emailTaken: null,
            usernameTaken:null,
            userNotFound:null
        },
        userData:{},
    },reducers:{

    },
    extraReducers:(builder)=>{
        builder
        .addCase(checkEmailExist.fulfilled,(state,action)=>{
            if(action.payload.message){
                state.error.emailTaken = action.payload.message
            }else{
                state.error.emailTaken = null
            }
        })
        .addCase(checkUsernameExist.fulfilled,(state,action)=>{
            if (action.payload.message) {
                state.error.usernameTaken = action.payload.message
            } else {
                state.error.usernameTaken = null
            }
        })
        .addCase(getUserByEmail.fulfilled,(state,action)=>{
            state.userData = action.payload.data
        })
        .addCase(getUserByEmail.rejected,(state,action)=>{
            state.error.userNotFound = "User not found"
        })

    }
})

export default adminSlice.reducer;