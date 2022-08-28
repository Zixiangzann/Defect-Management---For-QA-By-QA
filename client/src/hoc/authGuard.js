import {useSelector} from "react-redux";
import {Navigate,useLocation,useNavigate} from 'react-router-dom';

export const LoginGuard = (props) => {
    const users = useSelector(state=>state.users);
    let location = useLocation();
    const navigate = useNavigate();

    if(!users.auth){
        return <Navigate to ="/auth" state={{from:location}} replace/>
    }

    if((users.data.firstlogin || users.data.passwordresetted) && users.auth){
        setTimeout(()=>{
            navigate('/firstlogin')
        },100)   
    }

    return props.children
}
 
export const FirstLoginGuard = (props) =>{
    const users = useSelector(state=>state.users);
    let location = useLocation();
    const navigate = useNavigate();

    if(!users.data.firstlogin && !users.data.passwordresetted){
        return <Navigate to ="/" state={{from:location}} replace/>
    }
    return props.children
}

export const AdminGuard = (props) => {
    const users = useSelector(state=>state.users);
    let location = useLocation();

    if(users.data.role !== 'admin' && users.data.role !== 'owner'){
        return <Navigate to ="/" state={{from:location}} replace/>
    }

    if(users.data.firstlogin && users.auth){
        return <Navigate to ="/firstlogin" state={{from:location}} replace/>  
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