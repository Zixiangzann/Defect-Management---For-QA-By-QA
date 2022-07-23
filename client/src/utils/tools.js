import CirularProgress from '@mui/material/CircularProgress'
import { toast} from 'react-toastify'
import cookie from 'react-cookies'
import { FormHelperText } from '@mui/material'

export const errorHelper = (formik, values) => ({
    error: formik.errors[values] && formik.touched[values] ? true : false,
    helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values] : null
})

export const errorHelperSelect = (formik,values) => (
        (formik.errors[values] && formik.touched[values]) ?
        <FormHelperText error={true}>
        {formik.errors[values]}
        </FormHelperText>
        :
        null
)

export const Loader = () => {
    return (
        <div className='root_loader'>
            <CirularProgress />
        </div>
    )
}

export const showToast = (type, message) => {
    switch (type) {
        case 'SUCCESS':

            toast.success(message, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme:"colored" 
                });

            break;
        case 'ERROR':

            toast.error(message, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme:"colored" 
                });

                break;
                
        default:
            break;
    }
}

export const getTokenCookie = () => cookie.load('x-access-token');
export const removeTokenCookie = () => cookie.remove('x-access-token',{path:'/'});
export const getAuthHeader = () => {
    return { headers:{'Authorization':`Bearer ${getTokenCookie()}`}}
}
export const htmlDecode = (input) => {
    const doc = new DOMParser().parseFromString(input,"text/html")
    return doc.documentElement.textContent;
}