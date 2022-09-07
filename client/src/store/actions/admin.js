import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { errorGlobal, successGlobal } from '../reducers/notifications';
import { getAuthHeader, removeTokenCookie } from '../../utils/tools'
import { initializeApp } from "firebase/app";
import { getAuth,createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export const getAllUsersEmail = createAsyncThunk(
    'admin/getAllUsersEmail',
    async({})=> {
        try {
            const request = await axios.get('/api/admin/allusersemail',getAuthHeader())
            return { data: request.data}
        } catch (error) {
            throw error;
        }
    })

export const addUser = createAsyncThunk(
    'admin/addUser',
    async ({
        userDetails,
        permission
    }, { dispatch,rejectWithValue}) => {

        try {

            const auth = getAuth();

            const request = await axios.post('/api/admin/adduser', {
                userDetails,
                permission
            }, getAuthHeader());

            createUserWithEmailAndPassword(auth,userDetails.email,userDetails.password)
            .then((userCredential)=>{
                console.log("created")
            })

            return { data: request.data.user }
        } catch (error) {
            if(!error.response){
                throw error
            }

            return rejectWithValue(error.response)
            
        }
    })

export const checkEmailExist = createAsyncThunk(
    'admin/checkEmailExist',
    async ({ email }) => {
        try {
            const request = await axios.post('/api/admin/checkemailexist', {
                email
            }, getAuthHeader())
            return { message: request.data.message }
        } catch (error) {
            throw error;
        }
    })

export const checkUsernameExist = createAsyncThunk(
    'admin/checkUsernameExist',
    async ({ username }) => {
        try {
            const request = await axios.post('/api/admin/checkusernameexist', {
                username
            }, getAuthHeader())
            return { message: request.data.message }
        } catch (error) {
            throw error;
        }
    }
)

export const getUserByEmail = createAsyncThunk(
    'admin/getUserByEmail',
    async ({ email }) => {
        try {
            const request = await axios.post('/api/admin/getuserbyemail', {
                email
            }, getAuthHeader())
            return { data: request.data }
        } catch (error) {
            throw error;
        }
    }
)

export const updateFirstname = createAsyncThunk(
    'admin/updateFirstname',
    async ({
        adminPassword,
        userEmail,
        userNewFirstName },{rejectWithValue}) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/firstname', {
                adminPassword,
                userEmail,
                userNewFirstName
            }, getAuthHeader())
            return { data: request.data }

        } catch (error) {
            if(!error.response){
                throw error
            }

            return rejectWithValue(error.response)
            
        }

    })

export const updateLastname = createAsyncThunk(
    'admin/updateLastname',
    async ({
        adminPassword,
        userEmail,
        userNewLastName },{rejectWithValue}) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/lastname', {
                adminPassword,
                userEmail,
                userNewLastName
            }, getAuthHeader())
            return { data: request.data }

        } catch (error) {
            if(!error.response){
                throw error
            }

            return rejectWithValue(error.response)
            
        }

    })

export const updateUsername = createAsyncThunk(
    'admin/updateUsername',
    async ({
        adminPassword,
        userEmail,
        userNewUsername},{rejectWithValue}) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/username', {
                adminPassword,
                userEmail,
                userNewUsername
            }, getAuthHeader())
            return { data: request.data }

        } catch (error) {
            if(!error.response){
                throw error
            }

            return rejectWithValue(error.response)
            
        }

    })

export const updateEmail = createAsyncThunk(
    'admin/updateEmail',
    async ({
        adminPassword,
        userEmail,
        userNewEmail },{rejectWithValue}) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/email', {
                adminPassword,
                userEmail,
                userNewEmail
            }, getAuthHeader())

            return { data: request.data }

        } catch (error) {
            if(!error.response){
                throw error
            }

            return rejectWithValue(error.response)
            
        }

    })

export const updateJobtitle = createAsyncThunk(
    'admin/updateJobtitle',
    async ({
        adminPassword,
        userEmail,
        userNewJobTitle },{rejectWithValue}) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/jobtitle', {
                adminPassword,
                userEmail,
                userNewJobTitle
            }, getAuthHeader())
            return { data: request.data }

        } catch (error) {
            if(!error.response){
                throw error
            }

            return rejectWithValue(error.response)
            
        }

    })

 export const updateRole = createAsyncThunk(
    'admin/updateRole',
    async({
        adminPassword,
        userEmail,
        userNewRole },{rejectWithValue}) => {
            try {
                const request = await axios.patch('/api/admin/updateuser/role', {
                    adminPassword,
                    userEmail,
                    userNewRole
                }, getAuthHeader())
                return { data: request.data }
            } catch (error) {
                if(!error.response){
                    throw error
                }
                return rejectWithValue(error.response)
            }
    })   

export const resetUserPassword = createAsyncThunk(
    'admin/resetUserPassword',
    async({
        adminPassword,
        userEmail,
        userNewPassword
    },{rejectWithValue}) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/resetpassword', {
                adminPassword,
                userEmail,
                userNewPassword
            }, getAuthHeader())
            return { data: request.data }

        } catch (error) {
            if(!error.response){
                throw error
            }

            return rejectWithValue(error.response)
            
        }

    })

    export const updateUserPermission = createAsyncThunk(
        'admin/updateUserPermission',
        async({
            adminPassword,
            userEmail,
            userNewPermission
        },{rejectWithValue}) => {
            try {
                const request = await axios.patch('/api/admin/updateuser/permission', {
                    adminPassword,
                    userEmail,
                    userNewPermission
                }, getAuthHeader())

                console.log(userNewPermission)
                return { data: request.data }
    
            } catch (error) {
                if(!error.response){
                    throw error
                }
                return rejectWithValue(error.response)   
            }
        })

        export const getAllProjects = createAsyncThunk(
            'project/getAllProjects',
            async () => {
                try {
                    const request = await axios.post('/api/project/all', {}, getAuthHeader())
                    return { project: request.data }
                } catch (error) {
                    throw error;
                }
            }
        )

        export const assignProject = createAsyncThunk(
            'project/assignProject',
            async ({
                adminEmail,
                adminPassword,
                userEmail,
                projectTitle
            },{rejectWithValue}) =>{
                try {
                    const request = await axios.patch('/api/project/assign',{
                        adminEmail,
                        adminPassword,
                        userEmail,
                        projectTitle
                    },getAuthHeader())

                    return request
                }  catch (error) {
                    if(!error.response){
                        throw error
                    }
                    return rejectWithValue(error.response)   
                }
            }
        )

        export const removeFromProject = createAsyncThunk(
            'project/removeFromProject',
            async ({
                adminEmail,
                adminPassword,
                userEmail,
                projectTitle
            },{rejectWithValue}) =>{
                try {
                    const request = await axios.patch('/api/project/removefromproject',{
                        adminEmail,
                        adminPassword,
                        userEmail,
                        projectTitle
                    },getAuthHeader())
                    return request
                }  catch (error) {
                    if(!error.response){
                        throw error
                    }
                    return rejectWithValue(error.response)   
                }
            }
        )

