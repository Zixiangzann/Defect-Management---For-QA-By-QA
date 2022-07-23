import { Outlet } from 'react-router-dom';
import AdminLayout from '../../hoc/adminLayout';



const UserManagement = () =>{
    return(
        <AdminLayout>
        <Outlet/>
        </AdminLayout>
    )
}

export default UserManagement;