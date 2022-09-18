import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios'
import { errorGlobal, successGlobal } from '../reducers/notifications';
import { getAuthHeader } from '../../utils/tools'

export const getCommentByDefectIdPaginate = createAsyncThunk(
    'defects/comments',
    async({
        defectId,
        page=1,
        limit=3
    }) => {
        try {
            const request = axios.post(`/api/comment/paginate/${defectId}`,{
                page,
                limit
            },getAuthHeader());
            return request
        } catch (error) {
            throw error;
        }
    }
)

export const addComment = createAsyncThunk(
    'defects/addComment',
    async({defectId,comment}) => {
        try {
            const request = axios.post(`/api/comment/add/${defectId}`,{
                comment
            },getAuthHeader())
            return request
        } catch (error) {
            throw error
        }
    }
)