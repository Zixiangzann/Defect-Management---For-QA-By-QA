import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { getAuthHeader } from '../../utils/tools'

export const getWatchlistDefectList = createAsyncThunk(
    'watchlist/getWatchlistDefectList',
    async ({
        page = 1,
        limit = 10,
        project,
        components,
        status,
        severity,
        assignee,
        watchlist,
        reporter,
        server,
        sortby = 'lastUpdatedDate',
        order = 1,
        search
    }) => {
        try {
            const request = await axios.post('/api/defect/filter', {
                page,
                limit,
                project,
                components,
                status,
                severity,
                assignee,
                watchlist,
                reporter,
                server,
                sortby,
                order,
                search
            }, getAuthHeader());
            return request.data;

        } catch (error) {
            throw error;
        }
    }
)

export const getAllAssignee = createAsyncThunk(
    'watchlist/getAllAssignee',
    async (title) => {
        try {
            const request = await axios.post('/api/defect/assignee',
                { title: title }
                , getAuthHeader())
            return { assignee: request.data }
        } catch (error) {
            throw error;
        }
    }
)

export const getAllComponents = createAsyncThunk(
    'watchlist/getAllComponents',
    async (title) => {
        try {
            const request = await axios.post('/api/defect/components',
                { title: title }
                , getAuthHeader())
            return { components: request.data[0].components.sort() }
        } catch (error) {
            throw error;
        }
    }
)

export const getAllProjects = createAsyncThunk(
    'watchlist/getAllProjects',
    async () => {
        try {
            const request = await axios.post('/api/defect/projects', {}, getAuthHeader())
            return { project: request.data }
        } catch (error) {
            throw error;
        }
    }
)


export const getWatchlist = createAsyncThunk(
    'watchlist/getWatchlist',
    async () => {
        try {
            const request = await axios.post('/api/watchlist/getwatchlist',{},getAuthHeader())
            return request.data
        } catch (error) {
            throw error
        }
    }
)

export const updateLayout = createAsyncThunk(
    'watchlist/updateLayout',
    async (layouts) => {
        try {
            const request = await axios.post('/api/watchlist/updatelayout',{layouts},getAuthHeader())
            return request.data
        } catch (error) {
            throw error
        }
    }
)

export const updateFieldFilter = createAsyncThunk(
    'watchlist/updateFieldFilter',
    async ({
        project,
        components,
        status,
        severity,
        server,
        assignee,
        reporter,
        search}) => {
        try {
            const request = await axios.post('/api/watchlist/updatefieldfilter',
            {project,
                components,
                status,
                severity,
                server,
                assignee,
                reporter,
                search},getAuthHeader())
            return request.data
        } catch (error) {
            throw error
        }
    }
)