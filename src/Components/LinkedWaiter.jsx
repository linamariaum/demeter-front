import React, { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import '../css/style.css'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function LinkedWaiter({ isOpen = false, useButton = true, onClose = () => null }) {
    const [open, setOpen] = React.useState(isOpen);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        onClose()
        setOpen(false)
    };
    return (
        <div>
            {
                useButton && <button className="btn btn-danger" onClick={handleOpen}>Cancelar</button>
            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography className="text-center" id="modal-modal-title" variant="h6" component="h2">
                        ¡No se puede inhabillitar este empleado porque está asociado a una compra!

                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}

export default LinkedWaiter