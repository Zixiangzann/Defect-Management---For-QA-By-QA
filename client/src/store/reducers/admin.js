import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import {addComment, checkEmailExist, checkUsernameExist, getCommentByDefectIdPaginate, getUserByEmail, resetUserPassword, updateEmail, updateFirstname, updateJobtitle, updateLastname, updateUsername} from '../actions/admin'
import { showToast } from '../../utils/tools';

export const adminSlice = createSlice({
    name:'admin',
    initialState: {
        error:{
            emailTaken: null,
            usernameTaken:null,
            userNotFound:null
        },
        userDetails:{},
        userPermission:{},
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
            state.userDetails = action.payload.data
            state.userPermission = action.payload.data[0].permission
            state.error.userNotFound = null;
        })
        .addCase(getUserByEmail.rejected,(state,action)=>{
            state.error.userNotFound = "User not found"
        })
        .addCase(updateFirstname.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateFirstname.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(updateLastname.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateLastname.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(updateUsername.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateUsername.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(updateEmail.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateEmail.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(updateJobtitle.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateJobtitle.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(resetUserPassword.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(resetUserPassword.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })

    }
})

export default adminSlice.reducer;