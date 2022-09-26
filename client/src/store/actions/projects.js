import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { errorGlobal, successGlobal } from '../reducers/notifications';
import { getAuthHeader} from '../../utils/tools'

//get all users available for assigning to project
export const getAllUsersForAssign = createAsyncThunk(
    'projects/getAllUsersForAssign',
    async() => {
        try {
            const request = await axios.post('/api/project/getallusersforassign',{},getAuthHeader())
            return { allUsersForAssign: request.data }
        } catch (error) {
            throw error;
        }
    }
)

export const addProject = createAsyncThunk(
    'projects/addProject',
    async({
        title,
        description,
        assignee,
        components,
    },{rejectWithValue}) => {
        try {
            const request = await axios.post('/api/project/add',{
                title,
                description,
                assignee,
                components,
            },getAuthHeader())

            return request.data
            
        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }
    }
)

export const defectListOfUserToBeRemoved = createAsyncThunk(
    'projects/defectListOfUserToBeRemoved',
    async({
        projectTitle,
        userEmail
    },{rejectWithValue}) => {
        try {
            const request = await axios.post('/api/project/assignee/defectlist',{
                projectTitle,
                userEmail
            },getAuthHeader())

            return request.data
        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }
    }
)

export const defectListOfComponentToBeRemoved = createAsyncThunk(
    'projects/defectListOfComponentToBeRemoved',
    async({
        title,
        componentToBeRemove
    },{rejectWithValue}) => {
        try {
            const request = await axios.post('/api/project/components/defectlist',{
                title,
                componentToBeRemove
            },getAuthHeader())

            return request.data
        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }
    }
)