import React, { useEffect, useState } from 'react';
import '../css/style.css';

const DeleteProductCategory = ({ onClose, onDelete }) => {
  const [modalStyles, setModalStyles] = useState({
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '250px',
    width: '400px',
    padding: '20px',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    textAlign: 'center',
  });

  const [buttonStyles, setButtonStyles] = useState({
    marginTop: '80px',
    marginRight: '10%',
    marginLeft: '10%',
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 770) {
        setModalStyles((prevStyles) => ({ ...prevStyles, width: '50%', height: '27%' }));
      } else {
        setModalStyles((prevStyles) => ({ ...prevStyles, width: '400px' }));
      }

      if (window.innerWidth <= 590) {
        setModalStyles((prevStyles) => ({ ...prevStyles, height: '30%' }));
      } 

      if (window.innerWidth <= 498) {
        setModalStyles((prevStyles) => ({ ...prevStyles, height: '33%' }));
      } 

      if (window.innerWidth <= 436) {
        setModalStyles((prevStyles) => ({ ...prevStyles, height: '34.5%' }));
      } 

      if (window.innerWidth <= 425) {
        setModalStyles((prevStyles) => ({ ...prevStyles, width: '210px', height: 'auto' }));
        setButtonStyles((prevStyles) => ({
          ...prevStyles,
          marginTop: '40px',
          fontSize: '14px',
        }));
      } else {
        setButtonStyles((prevStyles) => ({
          ...prevStyles,
          marginTop: '80px',
          fontSize: 'inherit',
        }));
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClose}
    >
      <div style={modalStyles}>
        <h1 className="text-3xl font-semibold">Eliminar categoría de producto</h1>
        <p className="deleteText">¿Está seguro de que desea eliminar esta categoría?</p>
        <div className="flex justify-between buttonsdelete-responsive">
          <button
            onClick={onDelete}
            style={buttonStyles}
            className="btn btn-icon btn-danger btnDelete-responsive"
            title="Este botón sirve para eliminar la categoría y cerrar la ventana modal."
          >
            Eliminar
          </button>
          <button
            onClick={onClose}
            style={buttonStyles}
            className="btn btn-icon btn-primary"
            title="Este botón sirve para cerrar la ventana modal sin eliminar la categoría."
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductCategory;
