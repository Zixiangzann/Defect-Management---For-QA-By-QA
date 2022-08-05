import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios'
import { getAuthHeader } from '../../utils/tools';
import { errorGlobal, successGlobal } from '../reducers/notifications';

export const getCountSeverity = createAsyncThunk(
    'report/getCountSeverity',
    async(project)=>{
        try {
            const request = await axios.post('/api/defect/countseverity',
            {project:project}
            ,getAuthHeader())
            return request.data
        } catch (error) {
            throw error
        }
    }
)

export const getCountIssueType = createAsyncThunk(
    'report/getCountIssueType',
    async(project)=>{
        try {
            const request = await axios.post('/api/defect/countissuetype',
            {project:project}
            ,getAuthHeader())
            return request.data
        } catch (error) {
            throw error
        }
    }
)

export const getCountServer = createAsyncThunk(
    'report/getCountServer',
    async(project)=>{
        try {
            const request = await axios.post('/api/defect/countserver',
            {project:project}
            ,getAuthHeader())
            return request.data
        } catch (error) {
            throw error
        }
    }
)

export const getCountStatus = createAsyncThunk(
    'report/getCountStatus',
    async(project)=>{
        try {
            const request = await axios.post('/api/defect/countstatus',
            {project:project}
            ,getAuthHeader())
            return request.data
        } catch (error) {
            throw error
        }
    }
)

export const getCountComponents = createAsyncThunk(
    'report/getCountComponents',
    async(project)=>{
        try {
            const request = await axios.post('/api/defect/countcomponents',
            {project:project}
            ,getAuthHeader())
            return request.data
        } catch (error) {
            throw error
        }
    }
)

export const getDefectId = createAsyncThunk(
    'report/getDefectId',
    async(
        {
            page=1,
            project
    })=>{
        try {
            const request = await axios.post('/api/defect/filter',{
                page,
                project
            },getAuthHeader());

            return request.data.docs;
        } catch (error) {
            throw error
        }
    }
)
