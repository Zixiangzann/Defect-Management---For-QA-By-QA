import {useSelector} from "react-redux";
import {Navigate,useLocation} from 'react-router-dom';

export const LoginGuard = (props) => {
    const users = useSelector(state=>state.users);
    let location = useLocation();

    if(!users.auth){
        return <Navigate to ="/auth" state={{from:location}} replace/>
    }
    return props.children
}

export const AdminGuard = (props) => {
    const users = useSelector(state=>state.users);
    let location = useLocation();

    if(users.data.role !== 'admin'){
        return <Navigate to ="/" state={{from:location}} replace/>
    }
    return props.children
}

export const PreventReLoginGuard = (props) => {
    const users = useSelector(state=>state.users);
    let location = useLocation();

    if(users.auth){
        return <Navigate to ="/" state={{from:location}} replace/>
    }
    return props.children
}