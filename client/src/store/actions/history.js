import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { errorGlobal, successGlobal } from '../reducers/notifications';
import { getAuthHeader } from '../../utils/tools'
import { async } from '@firebase/util';


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
        field,
        editdate

    }) => {
        try {
            const request = axios.post(`/api/history/add/${defectId}`, {
                defectId,
                from,
                to,
                field,
                editdate
            }, getAuthHeader())
            return request
        } catch (error) {
            throw error
        }
    }
)

//get specific defect history
export const getHistoryByDefectIdAndDate = createAsyncThunk(
    'defects/gethistorybydefectidanddate',
    async({
        defectId,
        editDateFrom,
        editDateTo,
    }) => {
        try {
            const request = axios.post(`/api/history/get/historybyidanddate/${defectId}`,{
                editDateFrom,
                editDateTo,
            },getAuthHeader())
            return request
        } catch (error) {
            throw error
        }
    }
)

export const getDefectEditDate = createAsyncThunk(
    'defects/getDefectEditDate',
    async({
        defectId
    }) => {
        try {
            const request = axios.get(`/api/history/get/editdate/${defectId}`,getAuthHeader())
            return request
        } catch (error) {
            throw error
        }
    }
)

//end of get specific defect history

//get all defect history

//end of get all defect history