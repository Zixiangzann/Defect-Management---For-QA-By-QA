import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import {addComment, checkEmailExist, checkUsernameExist, getAllProjects, getAllUsersEmail, getCommentByDefectIdPaginate, getUserByEmail, resetUserPassword, updateEmail, updateFirstname, updateJobtitle, updateLastname, updateRole, updateUsername, updateUserPermission, assignProject, removeFromProject, addUser, updatePhone, checkPhoneExist, updateProfilePicture} from '../actions/admin'
import { showToast } from '../../utils/tools';
import { getProjectByTitle } from '../actions/defects';

const initialState = () => ({
    loading:false,
    error:{
        emailTaken: null,
        usernameTaken:null,
        userNotFound:null,
        phoneTaken: null,
    },
    userEmails:[],
    projectList:[],
    selectedProjectDetails:{},
    userDetails:{
        profilepicture: null,
        firstname:null,
        lastname:null,
        username:null,
        email:null,
        phone:null,
        jobtitle:null
    },
    userPermission:{},
    userProject:[]
})

export const adminSlice = createSlice({
    name:'admin',
    initialState: initialState(),
    reducers:{
        resetState: (state, action) => {
            state.userDetails = {}
            state.permission = {}
            state.project = []
            state.selectedProjectDetails = {}
            state.error={}
          },
 
    },
    extraReducers:(builder)=>{
        builder
        .addCase(addUser.pending,(state,action)=>{
            state.loading = true;
        })
        .addCase(addUser.fulfilled,(state,action)=>{
            state.loading = false;
        })
        .addCase(addUser.rejected,(state,action)=>{
            showToast('ERROR',action.payload.message)
            state.loading = false;
        })
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
        .addCase(checkPhoneExist.fulfilled,(state,action)=>{
            if (action.payload.message) {
                state.error.phoneTaken = action.payload.message
            } else {
                state.error.phoneTaken = null
            }
        })
        .addCase(getUserByEmail.fulfilled,(state,action)=>{
            // state.userDetails = action.payload.data
            state.userDetails.photoURL = action.payload.data[0].photoURL            
            state.userDetails.firstname = action.payload.data[0].firstname
            state.userDetails.lastname = action.payload.data[0].lastname
            state.userDetails.username = action.payload.data[0].username
            state.userDetails.phone = action.payload.data[0].phone
            state.userDetails.email = action.payload.data[0].email
            state.userDetails.jobtitle = action.payload.data[0].jobtitle
            state.userDetails.role = action.payload.data[0].role
            //permission
            state.userPermission = action.payload.data[0].permission
            //project
            state.userProject = action.payload.data[0].project

            state.error.userNotFound = null;
        })
        .addCase(getUserByEmail.rejected,(state,action)=>{
            state.error.userNotFound = "User not found"
        })
        .addCase(getAllProjects.fulfilled,(state,action)=>{
            state.projectList = [...action.payload.project]
        })
        .addCase(getProjectByTitle.fulfilled,(state,action)=>{
            state.selectedProjectDetails = action.payload.project
        })
        .addCase(updateProfilePicture.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Successfully Updated")
            console.log("change profile pic fulfiled")
        })
        .addCase(updateProfilePicture.rejected,(state,action)=>{
            showToast('ERROR',action.payload.data.message)
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
        .addCase(updatePhone.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updatePhone.rejected,(state,action)=>{
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
        .addCase(updateRole.fulfilled,(state,action)=>{
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateRole.rejected,(state,action)=>{
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