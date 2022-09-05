import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { errorGlobal, successGlobal } from '../reducers/notifications';
import { getAuthHeader, removeTokenCookie } from '../../utils/tools'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


export const signInUser = createAsyncThunk(
    'users/signInUser',
    async ({ email, password }, { dispatch,rejectWithValue}) => {
        try {

            const auth = getAuth();

            const request = await axios.post('/api/auth/signin', {
                email: email,
                password: password
            });

            //Firebase auth, to enhance security on file attachment.. 
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                })
                .catch((error) => {
                    throw error
                  });

            return { data: request.data.user }

        } catch (error) {
            if(!error.response){
                throw error
            }
            return rejectWithValue(error.response) 
        }
    }
)

export const isAuth = createAsyncThunk(
    'users/isAuth',
    async () => {
        try {
            const request = await axios.get('/api/auth/isauth', getAuthHeader());
            return { data: request.data, auth: true }
        } catch (error) {
            return { data: {}, auth: false }
        }
    }
)

export const firstLoginValidation = createAsyncThunk(
    'users/firstLoginValidation',
    async ({ email, oldPassword, newPassword }, { dispatch }) => {
        try {
            const request = await axios.post('/api/auth/firstloginvalidation', {
                email,
                oldPassword,
                newPassword
            }, getAuthHeader());
            dispatch(successGlobal(<div>Validation Success</div>))
            return { data: request.data.user }
        } catch (error) {
            dispatch(errorGlobal(<div>Validation failed.<br /> {error.response.data.message}</div>));
            throw error;
        }
    }
)

export const signOut = createAsyncThunk(
    'users/signOut',
    async () => {
        removeTokenCookie();
    }
)