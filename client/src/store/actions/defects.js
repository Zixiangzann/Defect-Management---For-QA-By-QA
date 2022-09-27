import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { errorGlobal, successGlobal } from '../reducers/notifications';
import { getAuthHeader, removeTokenCookie } from '../../utils/tools'

//firebase
import { storage } from '../../firebase';
import { ref, getDownloadURL, uploadBytes, uploadBytesResumable, deleteObject, listAll } from "firebase/storage"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { async } from '@firebase/util';

//Get details for creating defects
//Get all available assignee of a project
export const getAllAssignee = createAsyncThunk(
    'defects/getAllAssignee',
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

//Get all available components of a project
export const getAllComponents = createAsyncThunk(
    'defects/getAllComponents',
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

//Use for getting available projects.
//Only account with viewAllDefect permission can view all project
//else can only see project that is assigned to them.
export const getAllProjects = createAsyncThunk(
    'defects/getAllProjects',
    async () => {
        try {
            const request = await axios.post('/api/defect/projects', {}, getAuthHeader())
            return { project: request.data }
        } catch (error) {
            throw error;
        }
    }
)

export const getProjectByTitle = createAsyncThunk(
    'defects/getProjectByTitle',
    async ({ projectTitle }) => {
        try {
            const request = await axios.get(`/api/project/${projectTitle}`, getAuthHeader())
            return { project: request.data }
        } catch (error) {
            throw error;
        }
    }
)

//create defect
export const createDefect = createAsyncThunk(
    'defects/createDefect',
    async (defect, { dispatch }) => {
        try {
            const request = await axios.post('/api/defect/create',
                defect
                , getAuthHeader())

            dispatch(successGlobal(<div>Defect created<br /> Defect ID: {request.data.defectid}</div>));
            return request.data
        } catch (error) {
            dispatch(errorGlobal(<div>{error.response.data.message}</div>));
            throw error
        }
    }
)

export const updateAttachment = createAsyncThunk(
    'defects/updateAttachment',
    async ({
        defectId,
        attachment,
        action,
        toBeDeleted
    }, { dispatch }) => {
        try {

            const uploadAndGetFileDetails = async () => {

                const fileDetailsArray = []

                const p1 = new Promise((resolve, reject) => {
                    attachment.map((item, index) => {
                        //Only upload if it is a new file type
                        //if already have downloadURL, do NOT reupload.  
                        if (item.downloadURL) {
                            fileDetailsArray.push(item)
                        }
                    })
                    
                    resolve(fileDetailsArray);
                })

                const p2 = new Promise((resolve, reject) => {


                    //Only upload if it is a new file type and action is "uploadFile"
                    if (action === 'uploadFile') {
                        attachment.map((item, index) => {
                            if (!item.downloadURL) {
                                const storageRef = ref(storage, `DefectID_${defectId}/${item.name}`)
                                if (!item) return null;
                                const uploadTask = uploadBytesResumable(storageRef, item)

                                uploadTask.then((snapshot) => {
                                    getDownloadURL(snapshot.ref).then((downloadURL) => {
                                        fileDetailsArray.push({
                                            "name": item.name,
                                            "lastModified": item.lastModified,
                                            "size": item.size,
                                            "type": item.type,
                                            "webkitRelativePath": item.webkitRelativePath,
                                            "downloadURL": downloadURL
                                        })
                                    })
                                })
                            }
                        }
                        )
                    }
                    //Delete file

                    if (action === 'deleteFile') {
                        const storageRef = ref(storage, `DefectID_${defectId}/${toBeDeleted}`)

                        deleteObject(storageRef).then(() => {
                            console.log('File deleted')
                        }).catch((error) => {
                            console.log('Error deleting file')
                        })
                    }
                    
                    resolve(fileDetailsArray);
                })

                Promise.all([p1, p2]).then(async (values) => {
                    
                    setTimeout(async () => {
                        const request = await axios.patch(
                            `/api/defect/update/attachment/${defectId}`, {
                            attachment: values[1]
                        }, getAuthHeader())

                        return request.data
                    }
                        , 3000)
                })
            }     
            //Firebase
            const auth = getAuth();

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    uploadAndGetFileDetails();
                }
            })

        } catch (error) {
            console.log(error)
            dispatch(errorGlobal(<div>Fail to attach file<br /> Defect ID: {defectId}</div>));
            throw error
        }
    }
)

export const getDefectById = createAsyncThunk(
    'defects/getDefectById',
    async (defectId, { dispatch }) => {
        try {
            const request = await axios.get(`/api/defect/${defectId}`, getAuthHeader());
            return request.data;
        } catch (error) {
            dispatch(errorGlobal(<div>{error.response.data.message}</div>));
            throw error
        }
    }
)

export const getAllDefectPaginate = createAsyncThunk(
    'defects/getAllDefectPaginate',
    async ({
        page = 1,
        limit = 10,
        project = "",
        sortby = 'defectid',
        order = -1,
        search
    }, { dispatch }) => {
        try {
            const request = await axios.post('/api/defect/paginate', {
                page,
                limit,
                project,
                sortby,
                order,
                search
            }
                , getAuthHeader())
            return request.data;
        } catch (error) {
            dispatch(errorGlobal(<div>Error fetching defect list</div>));
            throw error
        }
    }
)

export const updateDefect = createAsyncThunk(
    'defects/updateDefect',
    async ({ values, assignee, components, defectId }, { dispatch }) => {
        try {
            //update assignee only
            if(assignee){
                const request = await axios.patch(`/api/defect/update/${defectId}`, {assignee}, getAuthHeader());
                dispatch(successGlobal(<div>Assignee updated<br /> Defect ID: {defectId}</div>));
            }else if(components){
                const request = await axios.patch(`/api/defect/update/${defectId}`, {components}, getAuthHeader());
                dispatch(successGlobal(<div>Component updated<br /> Defect ID: {defectId}</div>));
            }else{
            const request = await axios.patch(`/api/defect/update/${defectId}`, values, getAuthHeader());
            dispatch(successGlobal(<div>Defect updated<br /> Defect ID: {defectId}</div>));
            }
            return true;
        } catch (error) {
            dispatch(errorGlobal(error.response.data.message))
            throw error
        }
    }
)

export const deleteDefect = createAsyncThunk(
    'defects/deleteDefect',
    async ({ defectId }, { dispatch }) => {
        try {
            const request = await axios.delete(`/api/defect/delete/${defectId}`, getAuthHeader());

            const storageRef = ref(storage, `DefectID_${defectId}`)
            const fileList = await listAll(storageRef)

            for (let item of fileList.items) {
                deleteObject(item).then(() => {
                    console.log(`File deleted - ${item}`)
                }).catch((error) => {
                    console.log('Error deleting file')
                })
            }

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
    async ({
        page = 1,
        limit = 10,
        project,
        components,
        status,
        severity,
        server,
        sortby = 'defectid',
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



