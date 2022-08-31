import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import {addComment, checkEmailExist, checkUsernameExist, getAllUsersEmail, getCommentByDefectIdPaginate, getUserByEmail, resetUserPassword, updateEmail, updateFirstname, updateJobtitle, updateLastname, updateUsername, updateUserPermission} from '../actions/admin'
import { showToast } from '../../utils/tools';

const initialState = () => ({
    error:{
        emailTaken: null,
        usernameTaken:null,
        userNotFound:null
    },
    userEmails:[],
    userDetails:{},
    userPermission:{}
})

export const adminSlice = createSlice({
    name:'admin',
    initialState: initialState(),
    reducers:{
        resetState: (state, action) => {
            state.userDetails = {}
            state.permission = {}
          },
 
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllUsersEmail.fulfilled,(state,action)=>{
            const emails = [];
            action.payload.data.map((e)=>{
                emails.push(e.email)
            })

            state.userEmails = [...emails]

        })
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
        .addCase(updateUserPermission.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateUserPermission.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
        })

    }
})

export const {resetState} = adminSlice.actions
export default adminSlice.reducer;