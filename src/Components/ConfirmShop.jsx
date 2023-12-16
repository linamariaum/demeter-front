import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link, useNavigate, useNavigation } from 'react-router-dom';


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


function ConfirmShop({ onConfirm, data, ...onConfirmValues }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigation = useNavigate()

  const navigateToMainMenu = () => {
    navigation("/shopping")
  }
  return (
    <div>
      <button className="btn btn-primary ml-2" onClick={handleOpen}>Confirmar compra</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography className="text-center" id="modal-modal-title" variant="h6" component="h2">
            ¿Estas seguro de confirmar la compra?

          </Typography>
          <button className="bg-red-500 text-white font-bold py-2 px-4 rounded ml-5 mt-3 " {...onConfirmValues} onClick={() => onConfirm({ navigateToMainMenu, ...data, ...onConfirmValues })}>
            Confirmar
          </button>


          <button onClick={handleClose} className="btn btn-danger bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded m-3 j">
            Cancelar
          </button>
        </Box>
      </Modal>
    </div>
  )
}

export default ConfirmShop