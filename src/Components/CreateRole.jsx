import React, { useState } from 'react';
import Box from "@mui/material/Box";
import { useForm } from 'react-hook-form';
import { useRole } from '../Context/Role.context';

const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3
};

function CreateRole({ onClose, onCreated }) {
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    const { createRole, role } = useRole();

    const onSubmit = handleSubmit(async (values) => {
        const isNameDuplicate = role.some(rol => rol.Name_Role === values.Name_Role);

        if (isNameDuplicate) {
            setError('Name_Role', {
                type: 'manual',
                message: 'El nombre del rol ya existe.'
            });
            return;
        }

        createRole(values);
        onCreated();
        onClose();
    });

    const onCancel = () => {
        onClose();
    };

    return (
        <Box sx={{ ...style, width: 600 }}>
            <div>
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h5>Registro de rol</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={onSubmit}>

                                <div className="control">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="Name_Role" className="form-label">
                                            Nombre: <strong>*</strong>
                                        </label>
                                        <input
                                            {...register("Name_Role", {
                                                required: "El nombre es obligatorio",
                                                pattern: {
                                                    value: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]*[a-záéíóúñ]$/,
                                                    message:
                                                        "El nombre del rol debe tener la primera letra en mayúscula y solo letras."
                                                }
                                            })}
                                            type="text"
                                            placeholder='Nombre'
                                            className="form-control"
                                            title='Ingrese el nombre del nuevo rol.'
                                        />
                                        {errors.Name_Role && (
                                            <p className="text-red-500">
                                                {errors.Name_Role.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="buttonconfirm">
                                    <div className="mb-3">
                                        <button
                                            className="btn btn-primary mr-5"
                                            type="submit"
                                            title='Se guarda la información recien ingresado en el sistema.'
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={onCancel}
                                            type="button"
                                            title='Se cancela la información recien ingresada en el sistema.'
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    )
}

export default CreateRole