import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { errorGlobal, successGlobal } from '../reducers/notifications';
import { getAuthHeader } from '../../utils/tools'

//get all users available for assigning to project
export const getAllUsersForAssign = createAsyncThunk(
    'projects/getAllUsersForAssign',
    async () => {
        try {
            const request = await axios.post('/api/project/getallusersforassign', {}, getAuthHeader())
            return { allUsersForAssign: request.data }
        } catch (error) {
            throw error;
        }
    }
)

export const checkProjectTitleExist = createAsyncThunk(
    'projects/checkProjectTitleExist',
    async({title}) => {
        try {
            const request = await axios.post('/api/project/checkprojectexist',{
                title
            },getAuthHeader())
            return {message: request.data.message}
            
        } catch (error) {
            throw error
        }
    })


export const addProject = createAsyncThunk(
    'projects/addProject',
    async ({
        title,
        description,
        assignee,
        components,
    }, { rejectWithValue }) => {
        try {
            const request = await axios.post('/api/project/add', {
                title,
                description,
                assignee,
                components,
            }, getAuthHeader())

            return request.data

        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }
    }
)

export const updateProjectTitleAndDescription = createAsyncThunk(
    'project/updateProjectTitleAndDescription',
    async ({
        oldTitle,
        newTitle,
        newDescription
    }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/project/update', {
                oldTitle,
                newTitle,
                newDescription
            }, getAuthHeader())

            return request
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response)
        }
    }
)

export const assignProject = createAsyncThunk(
    'project/assignProject',
    async ({
        userEmail,
        projectTitle
    }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/project/assignee/assign', {
                userEmail,
                projectTitle
            }, getAuthHeader())

            return request
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response)
        }
    }
)


export const removeFromProject = createAsyncThunk(
    'project/removeFromProject',
    async ({
        userEmail,
        projectTitle
    }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/project/assignee/removefromproject', {
                userEmail,
                projectTitle
            }, getAuthHeader())
            return request
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response)
        }
    }
)

export const addComponents = createAsyncThunk(
    'projects/addComponents',
    async ({
        title,
        components
    }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/project/components/add', {
                title,
                components
            }, getAuthHeader())

            return request.data
        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }
    }
)

export const removeComponents = createAsyncThunk(
    'projects/removeComponents',
    async ({
        title,
        componentToBeRemove
    }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/project/components/remove', {
                title,
                componentToBeRemove
            }, getAuthHeader())

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
    async ({
        projectTitle,
        userEmail
    }, { rejectWithValue }) => {
        try {
            const request = await axios.post('/api/project/assignee/defectlist', {
                projectTitle,
                userEmail
            }, getAuthHeader())

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
    async ({
        title,
        componentToBeRemove
    }, { rejectWithValue }) => {
        try {
            const request = await axios.post('/api/project/components/defectlist', {
                title,
                componentToBeRemove
            }, getAuthHeader())

            return request.data
        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }
    }
)