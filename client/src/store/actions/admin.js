import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios'
import { errorGlobal, successGlobal } from '../reducers/notifications';
import { getAuthHeader, removeTokenCookie } from '../../utils/tools'

export const addUser = createAsyncThunk(
    'admin/addUser',
    async({
        firstname,
        lastname,
        username,
        email,
        password,
        role,
        jobtitle
    },{dispatch}) =>{

        try {
            const request =await axios.post('/api/admin/adduser',{
                firstname,
                lastname,
                username,
                email,
                password,
                role,
                jobtitle
            },getAuthHeader());
            return {data:request.data.user}
        } catch (error) {
            // dispatch(errorGlobal(error.response.data.message));
            throw error;
        }
    })

export const checkEmailExist = createAsyncThunk(
    'admin/checkEmailExist',
    async({email})=>{
        try {
            const request = await axios.post('/api/admin/checkemailexist',{
                email
            },getAuthHeader())
            return{message:request.data.message}
        } catch (error) {
            throw error;
        }
    })
 
export const checkUsernameExist = createAsyncThunk(
    'admin/checkUsernameExist',
    async({username})=>{
    try {
        const request = await axios.post('/api/admin/checkusernameexist',{
            username
        },getAuthHeader())  
        return {message:request.data.message} 
    } catch (error) {
        throw error;
    }}
)

export const getUserByEmail = createAsyncThunk(
    'admin/getUserByEmail',
    async({email}) => {
        try{
            const request = await axios.post('/api/admin/getuserbyemail',{
                email
            },getAuthHeader())
            return {data:request.data}
        }catch(error){
            throw error;
        }
    }
)