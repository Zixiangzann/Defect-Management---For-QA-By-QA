import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isAuth } from './store/actions/users';
import { Loader } from './utils/tools';

import MainLayout from './hoc/mainLayout';
import Header from './components/navigation/header'
import Home from './components/home'

import Defect from './components/user/defects';
import CreateDefect from './components/user/defects/create';
import EditDefect from './components/user/defects/edit';
import UserManagement from './components/admin';

import AdminProfile from './components/admin/profile';
import AdminUsers from './components/admin/users';
import AdminDefects from './components/admin/defects';
import AdminProjects from './components/admin/projects';

import Projects from './components/Projects';
import Auth from './components/auth';

import * as AuthGuard from './hoc/authGuard';


const Router = () => {

    const [loading, setLoading] = useState(true);
    const users = useSelector(state => state.users)


    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(isAuth())
    }, [])

    useEffect(() => {
        if (users.auth !== null) {
            setLoading(false)
        }
    }, [users])



    return (
        <BrowserRouter>
            {loading ?
                <Loader />
                :
                <>
                    <Header />
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/auth" element={
                                <AuthGuard.PreventReLoginGuard>
                                    <Auth />
                                </AuthGuard.PreventReLoginGuard>
                            }
                            />
                            <Route path="/defect" element={
                                <AuthGuard.LoginGuard>
                                    <Defect />
                                </AuthGuard.LoginGuard>
                            } />

                            <Route path="/defect/create" element={
                                <AuthGuard.LoginGuard>
                                    <CreateDefect />
                                </AuthGuard.LoginGuard>
                            } />

                            <Route path="/defect/edit/:defectId" element={
                                <AuthGuard.LoginGuard>
                                    <EditDefect />
                                </AuthGuard.LoginGuard>
                            } />

                            <Route path="/projects" element={
                                <AuthGuard.LoginGuard>
                                    <Projects />
                                </AuthGuard.LoginGuard>
                            } />

                            <Route path="/usermanagement" element={
                                <AuthGuard.AdminGuard>
                                    <UserManagement />
                                </AuthGuard.AdminGuard>
                            }>
                                <Route path='profile' element={<AdminProfile />} />
                                <Route path='Defects' element={<AdminDefects />} />
                                <Route path='users' element={<AdminUsers />} />
                                <Route path='projects' element={<AdminProjects />} />
                            </Route>
                        </Routes>
                    </MainLayout>
                </>
            }
        </BrowserRouter>

    )
};

export default Router;