import React from 'react';

const AuthorizationModal = () => {
    return (
        <section className="pc-container">
            <div className="modal-overlay">
                <div className="modal-container-denegate p-10">
                    <div className="modal-content p-10">
                        <h2 className='alert-heading'>Alerta</h2>
                        <p>Lo siento, no tienes permiso para acceder a este módulo.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuthorizationModal;