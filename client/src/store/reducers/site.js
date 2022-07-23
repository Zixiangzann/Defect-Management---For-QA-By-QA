import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const siteSlice = createSlice({
name:'site',
initialState: {
    layout:''
},
reducers:{

}
})

export default siteSlice.reducer;