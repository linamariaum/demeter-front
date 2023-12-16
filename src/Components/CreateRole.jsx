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

    function removeAccentsAndSpaces(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f\s]/g, '');
    }

    const onSubmit = handleSubmit(async (values) => {

        const normalizedInputName = removeAccentsAndSpaces(
            values.Name_Role
        );
        const normalizedExistingNames = role.map((rol) =>
            removeAccentsAndSpaces(rol.Name_Role)
        );

        const isNameDuplicate = normalizedExistingNames.includes(
            normalizedInputName
        );

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

                                <div className="city">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="Name_Role" className="form-label">
                                            Nombre: <strong>*</strong>
                                        </label>
                                        <input
                                            {...register("Name_Role", {
                                                pattern: {
                                                    value: /^[A-Za-zÁÉÍÓÚÑáéíóúñ]+(\s[A-Za-zÁÉÍÓÚÑáéíóúñ]+)?$/,
                                                    message: 'Solo se permiten letras, tildes y hasta un espacio entre letras.',
                                                },
                                                minLength: {
                                                    value: 3,
                                                    message: 'El nombre debe tener al menos 3 caracteres.',
                                                },
                                                maxLength: {
                                                    value: 30,
                                                    message: 'El nombre no puede tener más de 30 caracteres.',
                                                },
                                                setValueAs: (value) =>
                                                    value
                                                        .trim()
                                                        .replace(/\s+/g, ' ')
                                                        .toLowerCase()
                                                        .replace(/^(.)/, (match) => match.toUpperCase()),
                                            })}
                                            maxLength={30}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, '');
                                            }}
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