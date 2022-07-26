import { createSlice } from '@reduxjs/toolkit'
import { Navigate, useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/tools';
import { signInUser, isAuth, signOut, firstLoginValidation } from '../actions/users';


let DEFAULT_USER_STATE = {
    loading: false,
    data: {
        _id: null,
        email: null,
        firstname: null,
        lastname: null,
        project: null,
        jobtitle: null,
        role: null,
        verified: null,
        firstlogin: null,
        passwordresetted: null,
        permission: [{}],
    },
    auth: null
}

export const usersSlice = createSlice({
    name: 'users',
    initialState: DEFAULT_USER_STATE,
    reducers: {
        setAuthNull: (state, action) => {
            state.auth = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInUser.pending, (state) => { state.loading = true })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.auth = true;
                showToast("SUCCESS", <div>Login success</div>)
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.loading = false
                showToast("ERROR", <div>Login failed.<br /> {action.payload.data.message}</div>)

            })
            // IS AUTH
            .addCase(isAuth.pending, (state) => { state.loading = true })
            .addCase(isAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.data = { ...state.data, ...action.payload.data }
                state.auth = action.payload.auth;
            })
            .addCase(isAuth.rejected, (state) => { state.loading = false })
            .addCase(signOut.fulfilled, (state, action) => {
                state.data = DEFAULT_USER_STATE.data;
                state.auth = null;
                showToast('SUCCESS', <div>Logged out</div>);
            })
            .addCase(firstLoginValidation.fulfilled, (state, action) => {
                state.data = action.payload.data
            })
    }
})

export const { setFirstLoginFalse,setAuthNull } = usersSlice.actions;
export default usersSlice.reducer;