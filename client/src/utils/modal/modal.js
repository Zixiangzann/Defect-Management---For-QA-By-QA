//lib
import { useState } from "react"

//comp
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import ReactPlayer from 'react-player'
import ReactAudioPlayer from 'react-audio-player';

//MUI
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography";
import { Button, FormControl, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';


const ModalComponent = ({
    open,
    setOpenModal,
    title,
    description,
    warn,
    handleModalConfirm,
    input,
    inputLabel,
    inputValue,
    inputType,
    handleModalInput,
    button1,
    button2,
    titleColor,
    showImage,
    showVideo,
    showAudio,
    showDoc,
    image,
    video,
    audio,
    doc
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    return (
        <Modal
            open={open}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"

        >
            <Box
                className="modal-box"
                sx={{ height: 'fit-content' }}>

                <Box display={'flex'} justifyContent={'space-between'}>

                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 600, color: titleColor }}>
                        {title}
                    </Typography>

                    <IconButton
                        onClick={() => setOpenModal(false)}>
                        <CloseIcon />
                    </IconButton>

                </Box>

                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2, ml: 1, whiteSpace: 'pre-line' }}>
                    {description}
                </Typography>





                {showImage ?
                    <Zoom>
                        <img
                            alt=""
                            src={image}
                            width="500"
                        />
                    </Zoom>

                    :
                    null
                }

                {showVideo ?
                    <ReactPlayer
                        url={video}
                        width="500"
                        controls={true}
                        playing={false}
                    />
                    :
                    null
                }

                {showAudio ?
                    <ReactAudioPlayer
                        src={audio}
                        controls={true}
                    />
                    :
                    null
                }

                {showDoc ?
                    <Paper sx={{ height: "350px", overflow: 'scroll' }}>
                        <p>{doc}</p>

                    </Paper>
                    :
                    null
                }


                <Typography id="modal-modal-warn" sx={{ mt: 2, mb: 1, ml: 1, fontWeight: 600 }}>
                    {warn}
                </Typography>

                {input
                    ?
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">{inputLabel}</InputLabel>
                        <OutlinedInput
                            type={showPassword || inputType !== 'password' ? 'text' : 'password'}
                            value={inputValue}
                            onChange={(e)=>handleModalInput(e)}

                            
                            endAdornment={inputType === 'password' ?
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                :
                                null
                            }
                            label={inputLabel}
                        />
                    </FormControl>
                    :
                    null
                }

                {button1 ?
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ m: 1 }}
                        onClick={() => {
                            handleModalConfirm()
                            setOpenModal(false)
                        }}
                    >{button1}</Button>
                    :
                    null}

                {button2 ?
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{ m: 1 }}
                        onClick={() => {
                            setOpenModal(false)
                        }}
                    >{button2}</Button>
                    :
                    null
                }




            </Box>
        </Modal>
    )
}

export default ModalComponent