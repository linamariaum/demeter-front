import React from 'react';

const AuthorizationModal = () => {
    return (
        <section className="pc-container">
            <div className="modal-overlay">
                <div className="modal-container-denegate">
                    <div className="modal-content p-11">
                        <h2 className='alert-heading'>Alerta</h2>
                        <p>Lo siento, no tienes permiso para acceder a este módulo.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuthorizationModal;