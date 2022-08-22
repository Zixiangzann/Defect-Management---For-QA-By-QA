import { createSlice } from '@reduxjs/toolkit'
import { showToast } from '../../utils/tools';
import {signInUser,isAuth, signOut} from '../actions/users'; 

let DEFAULT_USER_STATE ={
    loading:false,
    data:{
        _id:null,
        email:null,
        firstname:null,
        lastname:null,
        project:null,
        age:null,
        role:null,
        verified:null,
        firstlogin:null,
    },
    auth:null
}

export const usersSlice = createSlice({
name:'users',
initialState:DEFAULT_USER_STATE,
reducers:{



},
extraReducers:(builder)=>{
    builder
    .addCase(signInUser.pending,(state)=>{state.loading = true})
    .addCase(signInUser.fulfilled,(state,action)=>{
        state.loading = false;
        state.data = action.payload.data;
        state.auth = true;
    })
    .addCase(signInUser.rejected,(state)=>{state.loading=false})
     // IS AUTH
     .addCase(isAuth.pending,(state)=>{ state.loading = true })
     .addCase(isAuth.fulfilled,(state,action)=>{
         state.loading = false;
         state.data = { ...state.data,...action.payload.data}
         state.auth = action.payload.auth;
     })
     .addCase(isAuth.rejected,(state)=>{ state.loading = false })
     .addCase(signOut.fulfilled,(state,action)=>{
        state.data = DEFAULT_USER_STATE.data;
        state.auth = null;
        showToast('SUCCESS',<div>Logged out</div>);
     })
}
})

export default usersSlice.reducer;