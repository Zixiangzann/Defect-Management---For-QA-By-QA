//lib
import { useState } from "react"

//MUI
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";


const ModalComponent = ({
    open,
    setOpenModal,
    title,
    description,
    warn,
    handleModalConfirm,
    button1,
    button2,
    titleColor,
}) => {


    return (
        <Modal
            open={open}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal-box">
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontWeight:600,color:titleColor}}>
                    {title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2, whiteSpace: 'pre-line' }}>
                    {description}
                </Typography>
                <Typography id="modal-modal-warn" sx={{mt:2,mb:1,fontWeight:600}}>
                    {warn}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{m: 1 }}
                    onClick={()=>{
                        handleModalConfirm()
                        setOpenModal(false)
                    }}
                >{button1}</Button>


                <Button
                    variant="outlined"
                    color="error"
                    sx={{ m: 1 }}
                    onClick={()=>{
                        setOpenModal(false)
                    }}
                >{button2}</Button>





            </Box>
        </Modal>
    )
}

export default ModalComponent