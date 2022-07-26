import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { errorGlobal, successGlobal } from '../reducers/notifications';
import { getAuthHeader, removeTokenCookie } from '../../utils/tools'


//firebase storage
import { storage } from '../../firebase';
import { ref, getDownloadURL, uploadBytes, uploadBytesResumable, deleteObject, listAll } from "firebase/storage"

//firebase auth
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();

export const getAllUsersEmail = createAsyncThunk(
    'admin/getAllUsersEmail',
    async ({ }) => {
        try {
            const request = await axios.get('/api/admin/allusersemail', getAuthHeader())
            return { data: request.data }
        } catch (error) {
            throw error;
        }
    })

export const addUser = createAsyncThunk(
    'admin/addUser',
    async ({
        uploadProfilePicture,
        userDetails,
        permission
    }, { dispatch, rejectWithValue }) => {

        try {

            //Upload profile picture to firebase storage, get url and put the url to db. 
            //use user email as the name of the profile picture
            let photoURL = ""
            console.log(uploadProfilePicture)

            const uploadPic = () => {
                return new Promise((resolve, reject) => {
                    if (uploadProfilePicture) {
                        onAuthStateChanged(auth, async (user) => {
                            if (user) {
                                const storageRef = ref(storage, `Profile-Picture/${userDetails.email}`)
                                const uploadTask = uploadBytesResumable(storageRef, uploadProfilePicture)

                                uploadTask.then((snapshot) => {
                                    getDownloadURL(snapshot.ref).then((downloadURL) => {
                                        photoURL = downloadURL
                                        console.log(photoURL)
                                        resolve(photoURL)
                                    })
                                })
                            }
                        })
                    } else {
                        //if user did not upload profile pic, then set it to the default (no-profile-pic)
                        photoURL = "https://firebasestorage.googleapis.com/v0/b/forqabyqa.appspot.com/o/Profile-Picture%2Fno-profile-pic.png?alt=media&token=be97a0fa-2ac8-4fd6-9beb-018269fb8bea"
                        resolve(photoURL)
                    }
                })
            }

            const createUser = async () => {
                const request = await axios.post('/api/admin/adduser', {
                    photoURL,
                    userDetails,
                    permission
                }, getAuthHeader());

                return { data: request.data.user }

            }

            //Get downloadURL then create user
            await uploadPic()
            await createUser()

        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }
    })

export const checkEmailExist = createAsyncThunk(
    'admin/checkEmailExist',
    async ({ email }) => {
        try {
            const request = await axios.post('/api/admin/checkemailexist', {
                email
            }, getAuthHeader())
            return { message: request.data.message }
        } catch (error) {
            throw error;
        }
    })

export const checkUsernameExist = createAsyncThunk(
    'admin/checkUsernameExist',
    async ({ username }) => {
        try {
            const request = await axios.post('/api/admin/checkusernameexist', {
                username
            }, getAuthHeader())
            return { message: request.data.message }
        } catch (error) {
            throw error;
        }
    }
)

export const checkPhoneExist = createAsyncThunk(
    'admin/checkPhoneExist',
    async ({ phone }) => {
        try {
            const request = await axios.post('/api/admin/checkphoneexist', {
                phone
            }, getAuthHeader())
            return { message: request.data.message }
        } catch (error) {
            throw error;
        }
    }
)

export const getUserByEmail = createAsyncThunk(
    'admin/getUserByEmail',
    async ({ email }) => {
        try {
            const request = await axios.post('/api/admin/getuserbyemail', {
                email
            }, getAuthHeader())
            return { data: request.data }
        } catch (error) {
            throw error;
        }
    }
)

export const updateProfilePicture = createAsyncThunk(
    'admin/updateProfilePicture',
    async ({
        ////adminPassword,
        userId,
        userEmail,
        uploadProfilePicture,
    }, { rejectWithValue }) => {
        try {
            //Upload profile picture to firebase storage, get url and put the url to db. 
            //use userId(objectid) as the name of the profile picture
            let photoURL = ""
            console.log(uploadProfilePicture)

            //function should not be ran if there is no update
            if (!uploadProfilePicture) throw new Error("no update to profile picture")

            //upload to firebase
            const uploadPic = () => {
                return new Promise((resolve, reject) => {
                    if (uploadProfilePicture) {
                        onAuthStateChanged(auth, async (user) => {
                            if (user) {
                                const storageRef = ref(storage, `Profile-Picture/${userId}`)
                                const uploadTask = uploadBytesResumable(storageRef, uploadProfilePicture)
                                uploadTask.then((snapshot) => {
                                    getDownloadURL(snapshot.ref).then((downloadURL) => {
                                        photoURL = downloadURL
                                        console.log(photoURL)
                                        resolve(photoURL)
                                    })
                                })
                            }else{
                                throw new Error("Firebase unable to get user, please relogin")
                               
                            }
                        })
                    }
                })
            }

            //update new photo url in account and db
            const updatePhotoURL = async () => {
                const request = await axios.patch('/api/admin/updateuser/photourl', {
                    //adminPassword,
                    userEmail,
                    userId,
                    userNewPhotoURL: photoURL
                }, getAuthHeader());

                return { data: request.data.user }

            }

            // upload the new profile picture to firebase, get the url and update the photoURL in firebase account and db
            await uploadPic().then(async()=>{
                await updatePhotoURL()
            })

        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }
    }
)

export const updateFirstname = createAsyncThunk(
    'admin/updateFirstname',
    async ({
        //adminPassword,
        userEmail,
        userNewFirstName }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/firstname', {
                //adminPassword,
                userEmail,
                userNewFirstName
            }, getAuthHeader())
            return { data: request.data }

        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }

    })

export const updateLastname = createAsyncThunk(
    'admin/updateLastname',
    async ({
        //adminPassword,
        userEmail,
        userNewLastName }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/lastname', {
                //adminPassword,
                userEmail,
                userNewLastName
            }, getAuthHeader())
            return { data: request.data }

        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }

    })

export const updateUsername = createAsyncThunk(
    'admin/updateUsername',
    async ({
        //adminPassword,
        userEmail,
        userNewUsername }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/username', {
                //adminPassword,
                userEmail,
                userNewUsername
            }, getAuthHeader())
            return { data: request.data }

        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }

    })

export const updatePhone = createAsyncThunk(
    'admin/updatePhone',
    async ({
        //adminPassword,
        userEmail,
        userNewPhone }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/phone', {
                //adminPassword,
                userEmail,
                userNewPhone
            }, getAuthHeader())
            return { data: request.data }

        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }

    })

export const updateEmail = createAsyncThunk(
    'admin/updateEmail',
    async ({
        //adminPassword,
        userEmail,
        userNewEmail }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/email', {
                //adminPassword,
                userEmail,
                userNewEmail
            }, getAuthHeader())

            return { data: request.data }

        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }

    })

export const updateJobtitle = createAsyncThunk(
    'admin/updateJobtitle',
    async ({
        //adminPassword,
        userEmail,
        userNewJobTitle }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/jobtitle', {
                //adminPassword,
                userEmail,
                userNewJobTitle
            }, getAuthHeader())
            return { data: request.data }

        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }

    })

export const updateRole = createAsyncThunk(
    'admin/updateRole',
    async ({
        //adminPassword,
        userEmail,
        userNewRole }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/role', {
                //adminPassword,
                userEmail,
                userNewRole
            }, getAuthHeader())
            return { data: request.data }
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response)
        }
    })

export const resetUserPassword = createAsyncThunk(
    'admin/resetUserPassword',
    async ({
        //adminPassword,
        userEmail,
        userNewPassword
    }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/resetpassword', {
                //adminPassword,
                userEmail,
                userNewPassword
            }, getAuthHeader())
            return { data: request.data }

        } catch (error) {
            if (!error.response) {
                throw error
            }

            return rejectWithValue(error.response)

        }

    })

export const updateUserPermission = createAsyncThunk(
    'admin/updateUserPermission',
    async ({
        //adminPassword,
        userEmail,
        userNewPermission
    }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/admin/updateuser/permission', {
                //adminPassword,
                userEmail,
                userNewPermission
            }, getAuthHeader())

            console.log(userNewPermission)
            return { data: request.data }

        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response)
        }
    })

export const getAllProjects = createAsyncThunk(
    'project/getAllProjects',
    async () => {
        try {
            const request = await axios.post('/api/project/all', {}, getAuthHeader())
            return { project: request.data }
        } catch (error) {
            throw error;
        }
    }
)

export const assignProject = createAsyncThunk(
    'project/assignProject',
    async ({
        adminEmail,
        //adminPassword,
        userEmail,
        projectTitle
    }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/project/assignee/assign', {
                adminEmail,
                //adminPassword,
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
        adminEmail,
        //adminPassword,
        userEmail,
        projectTitle
    }, { rejectWithValue }) => {
        try {
            const request = await axios.patch('/api/project/assignee/removefromproject', {
                adminEmail,
                //adminPassword,
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

