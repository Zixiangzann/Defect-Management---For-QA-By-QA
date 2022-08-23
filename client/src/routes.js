import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isAuth } from './store/actions/users';
import { Loader } from './utils/tools';

import MainLayout from './hoc/mainLayout';
import Header from './components/navigation/header'
import Home from './components/home'

import Defect from './components/defects';
import CreateDefect from './components/defects/create';
import EditDefect from './components/defects/edit';
import UserManagement from './components/admin';
import AdminAssignProject from './components/admin/assign';
import AdminUsers from './components/admin/users';
import AdminProjects from './components/admin/projects';
import Projects from './components/Projects';
import Auth from './components/auth';
import ViewDefect from './components/defects/view';
import Report from './components/defects/report';

import * as AuthGuard from './hoc/authGuard';
import FirstLogin from './components/auth/firstLogin';



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
                            
                            <Route path="/" element={
                             <AuthGuard.LoginGuard>
                            <Home />
                            </AuthGuard.LoginGuard>
                            } />


                            <Route path="/auth" element={
                                <AuthGuard.PreventReLoginGuard>
                                    <Auth />
                                </AuthGuard.PreventReLoginGuard>
                            }
                            />

                            <Route path="/firstlogin" element={
                                <AuthGuard.FirstLoginGuard>
                                    <FirstLogin />
                                </AuthGuard.FirstLoginGuard>
                            }
                            />

                            <Route path="/defect" element={
                                <AuthGuard.LoginGuard>
                                    <Defect />
                                </AuthGuard.LoginGuard>
                            } />

                            <Route path="/defect/report" element={
                                <AuthGuard.LoginGuard>
                                    <Report />
                                </AuthGuard.LoginGuard>
                            } />

                            <Route path="/defect/create" element={
                                <AuthGuard.LoginGuard>
                                    <CreateDefect />
                                </AuthGuard.LoginGuard>
                            } />

                            <Route path="/defect/view/:defectId" element={
                                <AuthGuard.LoginGuard>
                                    <ViewDefect />
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
                                <Route path='users' element={<AdminUsers />} />
                                <Route path='projects' element={<AdminProjects />} />
                                <Route path='assign' element={<AdminAssignProject />} />
                            </Route>
                        </Routes>
                    </MainLayout>
                </>
            }
        </BrowserRouter>

    )
};

export default Router;