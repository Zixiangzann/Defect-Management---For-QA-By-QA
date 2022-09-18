import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { errorGlobal, successGlobal } from '../reducers/notifications';
import { getAuthHeader } from '../../utils/tools'


export const getHistoryByDefectIdPaginate = createAsyncThunk(
    'defects/history',
    async ({
        defectId,
        page = 1,
        limit = 3
    }) => {
        try {
            const request = axios.post(`/api/history/paginate/${defectId}`, {
                page,
                limit
            }, getAuthHeader());
            return request
        } catch (error) {
            throw error;
        }
    }
)

export const addHistory = createAsyncThunk(
    'defects/addHistory',
    async ({
        defectId,
        from,
        to,
        field

    }) => {
        try {
            const request = axios.post(`/api/history/add/${defectId}`, {
                defectId,
                from,
                to,
                field
            }, getAuthHeader())
            return request
        } catch (error) {
            throw error
        }
    }
)