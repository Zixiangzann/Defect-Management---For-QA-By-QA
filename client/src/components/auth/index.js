import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { errorHelper, Loader } from '../../utils/tools';
import { signInUser } from '../../store/actions/users';
import { Divider, Typography } from '@mui/material';



const Auth = () => {

    // redux
    const users = useSelector((state) => state.users);
    const notifications = useSelector((state) => state.notifications);
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

    const handleSubmit = (values) => {
        dispatch(signInUser(values))
    }

    return (
        <Box className='loginpage' sx={{ display: 'flex', flexDirection: 'column'}}>
            <Typography variant='h4' sx={{ flexBasis: '50%', mt: 3,ml:6 }}>Login</Typography>


            <Box
                sx={{
                    display: 'flex', flexWrap:'wrap',  mt:1,ml:5
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
                    sx={{ flexBasis: '100%', mt: 1 }}
                />

                <TextField
                    name="password"
                    label="Enter your password"
                    type="password"
                    variant='outlined'
                    {...formik.getFieldProps('password')}
                    {...errorHelper(formik, 'password')}
                    sx={{  flexBasis: '100%', mt: 1 }}
                />
                <Box flexBasis='100%'></Box>

                <Box display={'flex'} justifyContent={'flex-end'} flexBasis='100%' mt={2}>
                {
                    users.loading ?
                        <Loader />
                        :
                        <Button
                            className='login-btn'
                            variant='outlined'
                            color="primary"
                            size="small"
                            onClick={() => console.log("login")}
                            type='submit'
                            sx={{  flexBasis: '25%', mt: 2 }}
                        >Login
                        </Button>
                }
                </Box>
            </Box>
        </Box>


    )

}

export default Auth;