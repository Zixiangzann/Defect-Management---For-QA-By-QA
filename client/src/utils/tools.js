//lib
import { toast } from 'react-toastify'
import cookie from 'react-cookies'
import Moment from 'react-moment';
import { useState, useEffect } from 'react'
import moment from 'moment';


//comp
import AvatarEditor from 'react-avatar-editor'

//mui
import CirularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'


export const ProfilePicEditor = ({
    imageUrl,
    defaultZoom,
    editingEnabled,
}) => {
    let editor = "";

    const [pictureChanges, setPictureChanges] = useState("")
    const [zoom, setZoom] = useState(defaultZoom)

    const handleZoom = (event, value) => {
        setZoom(value)
    };

    const setEditorRef = (ed) => {
        editor = ed;
    };


    // const handleDownload = () => {

    //     console.log('test')
    //     const canvas = editor.getImageScaledToCanvas();
    //     canvas.toBlob((blob) => {
    //         // let file = new File([blob], "fileName.jpg", { type: "image/jpeg" })
    //         // console.log(file)
    //         // setPictureChanges(file)
    //         const anchor = document.createElement('a');
    //         anchor.download = 'fileName.jpg'; 
    //         anchor.href = URL.createObjectURL(blob);
    //         anchor.href = URL.createObjectURL(blob);
    //         anchor.click(); 
    //         URL.revokeObjectURL(anchor.href);
    //         let file = new File([blob], "profile-pic.jpg", { type: "image/jpeg" })
    //         console.log(file)

    //     },'image/jpeg')

    // }


    return (


        <Box display="flex" flexBasis={'100%'} justifyContent={'center'}>

            <Box display="block">

                {editingEnabled ?
                    <AvatarEditor
                        ref={setEditorRef}
                        image={imageUrl}
                        width={200}
                        height={200}
                        border={0}
                        borderRadius={50}
                        color={[255, 255, 255, 0.6]} // RGBA
                        rotate={0}
                        scale={zoom}
                        id="profilePicEditor"
                        crossOrigin='anonymous'
                    />

                    :
                    <Avatar
                    id="add-profile-picture"
                    label="profile"
                    alt="profile"
                    src={imageUrl ? imageUrl : "https://firebasestorage.googleapis.com/v0/b/forqabyqa.appspot.com/o/Profile-Picture%2Fno-profile-pic.png?alt=media&token=be97a0fa-2ac8-4fd6-9beb-018269fb8bea"}
                    sx={{ width: 200, height: 200}}
                    /> 
                }

                {editingEnabled ?
                    <Slider
                        aria-label="zoom"
                        value={zoom}
                        min={1}
                        max={10}
                        step={0.1}
                        onChange={handleZoom}
                    ></Slider>
                    :
                    null
                }

                {/* <Button onClick={()=>handleDownload()}>test</Button> */}

            </Box>

        </Box>
    )
}

export const errorHelper = (formik, values) => ({
    error: formik.errors[values] && formik.touched[values] ? true : false,
    helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values] : null
})

export const errorHelperSelect = (formik, values) => (
    (formik.errors[values] && formik.touched[values]) ?
        <FormHelperText error={true}>
            {formik.errors[values]}
        </FormHelperText>
        :
        null
)

export const Loader = ({
    message
}) => {
    return (
        <Box className="root_loader" sx={{ display: 'inline-flex', m: 1 }}>
            <CirularProgress />
            <Typography ml={5} mt={2}>{message}</Typography>
        </Box>
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
                theme: "colored"
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
                theme: "colored"
            });

            break;

        default:
            break;
    }
}

export const getTokenCookie = () => cookie.load('x-access-token');
export const removeTokenCookie = () => cookie.remove('x-access-token', { path: '/' });
export const getAuthHeader = () => {
    return { headers: { 'Authorization': `Bearer ${getTokenCookie()}` } }
}
export const htmlDecode = (input) => {
    const doc = new DOMParser().parseFromString(input, "text/html")
    return doc.documentElement.textContent;
}

export const calcuDateDiff = (isodate) => {
    const createdDate = moment(isodate)
    const current = moment()
    const secondsDifferent = moment.duration(current.diff(createdDate)).asSeconds()

    if (secondsDifferent < 60) {

        if (secondsDifferent <= 1) {
            return (
                Math.round(secondsDifferent) + " second ago"
            )
        } else {
            return (
                Math.round(secondsDifferent) + " seconds ago"
            )
        }
        //if less than a hour
    } else if (secondsDifferent > 60 && secondsDifferent < 3600) {

        const minutesDifferent = Math.round(moment.duration(current.diff(createdDate)).asMinutes())

        if (minutesDifferent <= 1) {
            return (
                minutesDifferent + " minute ago"
            )
        } else {
            return (
                minutesDifferent + " minutes ago"
            )
        }
        //if more than a hour less than a day  
    } else if (secondsDifferent > 3600 && secondsDifferent < 86400) {

        const hoursDifferent = Math.round(moment.duration(current.diff(createdDate)).asHours())

        if (hoursDifferent <= 1) {
            return (
                hoursDifferent + " hour ago"
            )
        } else {
            return (
                hoursDifferent + " hours ago"
            )
        }
        //if more than a day less than a week 
    } else if (secondsDifferent > 86400 && secondsDifferent < 604800) {
        const daysDifferent = Math.round(moment.duration(current.diff(createdDate)).asDays())

        if (daysDifferent <= 1) {
            return (
                daysDifferent + " day ago"
            )
        } else {
            return (
                daysDifferent + " days ago"
            )
        }
        //if more than a week less than a month 
    } else if (secondsDifferent > 604800 && secondsDifferent < 2628000) {

        const weeksDifferent = Math.round(moment.duration(current.diff(createdDate)).asWeeks())

        if (weeksDifferent <= 1) {
            return (
                weeksDifferent + " week ago"
            )
        } else {
            return (
                weeksDifferent + " weeks ago"
            )
        }

        //if more than a month less than 3 month   
    } else if (secondsDifferent > 2628000 && secondsDifferent < 7884000) {

        const monthsDifferent = Math.round(moment.duration(current.diff(createdDate)).asMonths())

        if (monthsDifferent <= 1) {
            return (
                monthsDifferent + " month ago"
            )
        } else {
            return (
                monthsDifferent + " months ago"
            )
        }
        //anything else just show the date
    } else {
        return (
            <Moment format="DD/MMM/YYYY HH:mmA">{isodate}</Moment>
        )
    }

} 