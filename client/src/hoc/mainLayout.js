import Container from '@mui/material/Container';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = (props) => {

    return(
        <Container className={`Maincontainer`}>
            {props.children}
            <ToastContainer/>
        </Container>
    )
}

export default MainLayout