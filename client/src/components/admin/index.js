import { Outlet } from 'react-router-dom';
import AdminLayout from '../../hoc/adminLayout';
import AdminUsersManagement from './users';



const UserManagement = () =>{
    return(
        <AdminUsersManagement>
        <Outlet/>
        </AdminUsersManagement>

    )
}

export default UserManagement;