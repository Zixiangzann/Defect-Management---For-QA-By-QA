import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { errorHelper, Loader } from '../../utils/tools';
import { signInUser } from '../../store/actions/users';



const Auth = () => {

    // redux
    const users = useSelector((state) => state.users);
    const notifications = useSelector((state)=>state.notifications);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string()
                .required('Email is required')
                .email('Please enter a valid email'),
            password: Yup.string()
                .required('Password is required')
                // .min(8, 'Password require a minimum length of 8')
        }),
        onSubmit: (values) => {
            handleSubmit(values)
        }
    })

    const handleSubmit = (values) => { dispatch(signInUser(values)) }

    useEffect(()=>{
        if(notifications && notifications.global.success){
            navigate('/projects')
        }
    },[notifications])

    return (
        <div className='login'>
            <h1>Login</h1>
            <Box
                sx={{
                    '& .MuiTextField-root': { width: '100%', marginTop: '20px' },
                }}
                component="form"
                onSubmit={formik.handleSubmit}
            >

                <TextField
                    name="email"
                    label="Enter your email"
                    variant='outlined'
                    {...formik.getFieldProps('email')}
                    {...errorHelper(formik, 'email')}
                />

                <TextField
                    name="password"
                    label="Enter your password"
                    type="password"
                    variant='outlined'
                    {...formik.getFieldProps('password')}
                    {...errorHelper(formik, 'password')}
                />

                {
                    users.loading ?
                        <Loader />
                        :
                        <Button
                            className='login-btn'
                            variant='outlined'
                            color="secondary"
                            size="small"
                            onClick={() => console.log("login")}
                            type='submit'
                        >Login
                        </Button>
                }
            </Box>
        </div>


    )

}

export default Auth;