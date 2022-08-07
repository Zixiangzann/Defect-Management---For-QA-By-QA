import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios'
import { errorGlobal, successGlobal } from '../reducers/notifications';
import { getAuthHeader, removeTokenCookie } from '../../utils/tools'

//Get details for creating defects
//Get all available assignee of a project
export const getAllAssignee = createAsyncThunk(
    'defects/getAllAssignee',
    async(title) =>{
        try {
            const request = await axios.post('/api/defect/assignee',
            {title:title}
            ,getAuthHeader())
            return {assignee: request.data[0].assignee.sort()}
        } catch (error) {
            throw error;
        }
    }
)

//Get all available components of a project
export const getAllComponents = createAsyncThunk(
    'defects/getAllComponents',
    async(title) =>{
        try {
            const request = await axios.post('/api/defect/components',
            {title:title}
            ,getAuthHeader())
            return {components: request.data[0].components.sort()}
        } catch (error) {
            throw error;
        }
    }
)

//Use for getting available projects.
//Only admin can see all projects.
//user or any other role can only see project that is assigned to them.
export const getAllProjects = createAsyncThunk(
    'defects/getAllProjects',
    async()=>{
        try {
            const request = await axios.post('/api/defect/projects',{},getAuthHeader())
            return{project: request.data}
        } catch (error) {
            throw error;
        }
    }
)

//create defect
export const createDefect = createAsyncThunk(
    'defects/createDefect',
    async(defect,{dispatch}) => {
        try {
            const request = await axios.post('/api/defect/create',defect,getAuthHeader())
            dispatch(successGlobal(<div>Defect created<br /> Defect ID: {request.data.defectid}</div>));
            return request.data
        } catch (error) {
            dispatch(errorGlobal(<div>{error.response.data.message}</div>));
            throw error
        }
    }
)

export const getDefectById = createAsyncThunk(
    'defects/getDefectById',
    async(defectId,{ dispatch })=>{
        try{
            const request = await axios.get(`/api/defect/${defectId}`,getAuthHeader());
            return request.data;
        } catch(error){
            dispatch(errorGlobal(<div>{error.response.data.message}</div>));
            throw error
        }
    }
)

export const getAllDefectPaginate = createAsyncThunk(
    'defects/getAllDefectPaginate',
    async({
        page=1,
        limit=10,
        project="",
        sortby='defectid',
        order=1,
        search
    },{dispatch})=>{
        try {
            const request = await axios.post('/api/defect/paginate',{
                page,
                limit,
                project,
                sortby,
                order,
                search
            }
                ,getAuthHeader())
                return request.data;
        } catch (error) {
            dispatch(errorGlobal(<div>Error fetching defect list</div>));
            throw error
        }
    }
)

export const updateDefect = createAsyncThunk(
    'defects/updateDefect',
    async({values,defectId},{ dispatch })=>{
        try{
            const request = await axios.patch(`/api/defect/update/${defectId}`,values,getAuthHeader());
            dispatch(successGlobal(<div>Defect updated<br /> Defect ID: {defectId}</div>));
            return true;
        } catch(error){
            dispatch(errorGlobal(error.response.data.message))
            throw error
        }
    }
)

export const deleteDefect = createAsyncThunk(
    'defects/deleteDefect',
    async({defectId},{dispatch})=>{
        try {
            const request = await axios.delete(`/api/defect/delete/${defectId}`,getAuthHeader());
            dispatch(successGlobal(<div>Defect deleted<br /> Defect ID: {defectId}</div>));
            return true
        } catch (error) {
            dispatch(errorGlobal(error.response.data.message))
            throw error
        }
    }
)

export const filterDefect = createAsyncThunk(
    'defects/filterDefect',
    async({
        page=1,
        limit=10,
        project,
        components,
        status,
        severity,
        server,
        sortby='defectid',
        order=1,
        search
    }) => {
        try {
            const request = await axios.post('/api/defect/filter',{
                page,
                limit,
                project,
                components,
                status,
                severity,
                server,
                sortby,
                order,
                search
            },getAuthHeader());
            return request.data;

        } catch (error) {
            throw error;
        }
    }
)



