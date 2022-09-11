
import { toast } from 'react-toastify'
import cookie from 'react-cookies'
import { Button, FormHelperText, Typography } from '@mui/material'
import { useState, useEffect } from 'react'


import AvatarEditor from 'react-avatar-editor'

//mui
import CirularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import { Avatar } from '@mui/material';

export const ProfilePicEditor = ({
    imageUrl
}) => {
    let editor = "";

    const [pictureChanges, setPictureChanges] = useState("")
    const [zoom, setZoom] = useState(2)

    const handleZoom = (event, value) => {
        setZoom(value)
    };

    const setEditorRef = (ed) => {
        editor = ed;
    };


    const handleDownload = () => {

        console.log('test')
        const canvas = editor.getImageScaledToCanvas();
        canvas.toBlob((blob) => {
            // let file = new File([blob], "fileName.jpg", { type: "image/jpeg" })
            // console.log(file)
            // setPictureChanges(file)
            const anchor = document.createElement('a');
            anchor.download = 'fileName.jpg'; // optional, but you can give the file a name
            anchor.href = URL.createObjectURL(blob);
            anchor.href = URL.createObjectURL(blob);
            anchor.click(); 
            URL.revokeObjectURL(anchor.href);
            let file = new File([blob], "profile-pic.jpg", { type: "image/jpeg" })
            console.log(file)

        },'image/jpeg')

    }


    return (


        <Box display="flex" flexBasis={'100%'} justifyContent={'center'}>

            <Box display="block">

                {imageUrl ?
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
                    src={"https://firebasestorage.googleapis.com/v0/b/forqabyqa.appspot.com/o/Profile-Picture%2Fno-profile-pic.png?alt=media&token=be97a0fa-2ac8-4fd6-9beb-018269fb8bea"}
                    sx={{ width: 200, height: 200}}
                    /> 
                }

                {imageUrl ?
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