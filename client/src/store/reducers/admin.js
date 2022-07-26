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

            state.userEmails = [...emails.sort()]

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
            state.userDetails.userId = action.payload.data[0]._id
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
            state.projectList = [...action.payload.project.sort((a, b) => a.title.localeCompare(b.title))]
        })
        .addCase(getProjectByTitle.fulfilled,(state,action)=>{
            state.selectedProjectDetails = action.payload.project
        })
        .addCase(updateProfilePicture.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(updateProfilePicture.fulfilled,(state,action)=>{
            state.loading = false
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateProfilePicture.rejected,(state,action)=>{
            state.loading = false
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(updateFirstname.fulfilled,(state,action)=>{
            state.loading = false
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateFirstname.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(updateFirstname.rejected,(state,action)=>{
            state.loading = false
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(updateLastname.fulfilled,(state,action)=>{
            state.loading = false
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateLastname.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(updateLastname.rejected,(state,action)=>{
            state.loading = false
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(updateUsername.fulfilled,(state,action)=>{
            state.loading = false
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateUsername.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(updateUsername.rejected,(state,action)=>{
            state.loading = false
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(updatePhone.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(updatePhone.fulfilled,(state,action)=>{
            state.loading = false
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updatePhone.rejected,(state,action)=>{
            state.loading = false
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(updateEmail.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(updateEmail.fulfilled,(state,action)=>{
            state.loading = false
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateEmail.rejected,(state,action)=>{
            state.loading = false
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(updateJobtitle.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(updateJobtitle.fulfilled,(state,action)=>{
            state.loading = false
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateJobtitle.rejected,(state,action)=>{
            state.loading = false
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(updateRole.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(updateRole.fulfilled,(state,action)=>{
            state.loading = false
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateRole.rejected,(state,action)=>{
            state.loading = false
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(resetUserPassword.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(resetUserPassword.fulfilled,(state,action)=>{
            state.loading = false
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(resetUserPassword.rejected,(state,action)=>{
            state.loading = false
            showToast('ERROR',action.payload.data.message)
        })
        .addCase(updateUserPermission.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(updateUserPermission.fulfilled,(state,action)=>{
            state.loading = false
            showToast('SUCCESS',"Successfully Updated")
        })
        .addCase(updateUserPermission.rejected,(state,action)=>{
            state.loading = false
            showToast('ERROR',action.payload.data.message)
        })
   

    }
})

export const {resetState} = adminSlice.actions
export default adminSlice.reducer;