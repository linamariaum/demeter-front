import React, { useState } from 'react';
import Select from 'react-select';
import Box from "@mui/material/Box";
import { useForm } from 'react-hook-form';
import { useUser } from '../Context/User.context.jsx';

const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3
};

function CreateWaiter({ onClose, onCreated }) {
    const { register, handleSubmit, formState: { errors, isValid }, setError } = useForm();
    const { createWaiter, user } = useUser();
    const [selectedType, setSelectedType] = useState({ label: 'Seleccione tipo', value: '', isDisabled: true });

    const typeOptions = [
        { label: 'Seleccione tipo', value: '', isDisabled: true },
        { label: 'Cédula de ciudadanía', value: 'CC' },
        { label: 'Cédula de extranjería', value: 'CE' },
        { label: 'Pasaporte', value: 'PB' },
    ];

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: state.isFocused ? '1px solid #201E1E' : '1px solid #201E1E',
            '&:hover': {
                border: '1px solid #201E1E',
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#e36209' : state.isFocused ? '#e36209' : 'white',
            color: state.isSelected ? 'white' : state.isFocused ? '#555' : '#201E1E',
            '&:hover': {
                backgroundColor: '#e36209',
                color: 'white',
            },
            cursor: state.isDisabled ? 'not-allowed' : 'default',
        }),
    };

    const onSubmit = handleSubmit(async (values) => {
        const isDocumentouplicate = user.some(waiters => waiters.Document === values.Document);

        if (isDocumentouplicate) {
            setError('Document', {
                type: 'manual',
                message: 'El documento del usuario ya existe.'
            });
            return;
        }

        if (!selectedType || selectedType.value === '') {
            setError('Type_Document', {
                type: 'manual',
                message: 'Debe seleccionar un tipo de documento.'
            });
            return;
        }

        values.Type_Document = selectedType.value;

        createWaiter(values);
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
                            <h5>Registro de mesero</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={onSubmit}>
                                <div className="control">
                                    <div className="form-group col-md-6 ml-3">
                                        <label htmlFor="Type_Document" className="form-label mt-3">
                                            Tipo de documento: <strong>*</strong>
                                        </label>
                                        <Select
                                            className="form-control"
                                            options={typeOptions}
                                            {...register("Type_Document")}
                                            value={selectedType}
                                            onChange={(selectedOption) => setSelectedType(selectedOption)}
                                            menuPlacement="auto"
                                            menuShouldScrollIntoView={false}
                                            maxMenuHeight={132}
                                            styles={customStyles}
                                            title='Se selecciona el tipo de documento del mesero.'
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary: '#201E1E',
                                                },
                                            })}
                                        />
                                        {errors.Type_Document && (
                                            <p className="text-red-500">
                                                {errors.Type_Document.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="form-group col-md-6 ml-3">
                                        <label htmlFor="Document" className="form-label">
                                            Número de identidad: <strong>*</strong>
                                        </label>
                                        <input
                                            type="number"
                                            {...register("Document", {
                                                required: "El documento es obligatorio",
                                                validate: (value) => {
                                                    const parsedValue = parseInt(value);
                                                    if (
                                                        isNaN(parsedValue) ||
                                                        parsedValue < 10000000 ||
                                                        parsedValue > 9999999999
                                                    ) {
                                                        return "El número no es valido, debe tener de 8 a 10 caracteres.";
                                                    }
                                                }
                                            })}
                                            className="form-control"
                                            title='Se ingresa el numero de identificacion del mesero.'
                                        />
                                        {errors.Document && (
                                            <p className="text-red-500">
                                                {errors.Document.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="control">
                                    <div className="form-group col-md-6 ml-3">
                                        <label htmlFor="Name_User" className="form-label">
                                            Nombres: <strong>*</strong>
                                        </label>
                                        <input
                                            {...register("Name_User", {
                                                required: "El nombre es obligatorio",
                                                pattern: {
                                                    value: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]*[a-záéíóúñ]$/,
                                                    message:
                                                        "El nombre del mesero debe tener la primera letra en mayúscula y solo letras."
                                                }
                                            })}
                                            type="text"
                                            className="form-control"
                                            title='Se ingresa el nombre del mesero.'
                                        />
                                        {errors.Name_User && (
                                            <p className="text-red-500">
                                                {errors.Name_User.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="form-group col-md-6 ml-3">
                                        <label htmlFor="LastName_User" className="form-label">
                                            Apellidos: <strong>*</strong>
                                        </label>
                                        <input
                                            {...register("LastName_User", {
                                                required: 'El apellido es obligatorio',
                                                pattern: {
                                                    value: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]*[a-záéíóúñ]$/,
                                                    message:
                                                        "El apellido del mesero debe tener la primera letra en mayúscula y solo letras."
                                                }
                                            })}
                                            type="text"
                                            className="form-control"
                                            title='Se ingresa el apellido del mesero.'
                                        />
                                        {errors.LastName_User && (
                                            <p className="text-red-500">
                                                {errors.LastName_User.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="control">
                                    <div className="form-group col-md-6 ml-3">
                                        <label htmlFor="Restaurant" className="form-label">
                                            Restaurante: <strong>*</strong>
                                        </label>
                                        <input
                                            {...register("Restaurant", {
                                                required: "El restaurante es obligatorio",
                                                pattern: {
                                                    value: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]*[a-záéíóúñ]$/,
                                                    message:
                                                        "El apellido del mesero debe tener la primera letra en mayúscula y solo letras."
                                                }
                                            })}
                                            type="text"
                                            className="form-control"
                                            title='Se ingresa el restaurante al que pertenece el mesero.'
                                        />
                                        {errors.Restaurant && (
                                            <p className="text-red-500">
                                                {errors.Restaurant.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="buttonconfirm">
                                    <div className="ml-3">
                                        <button
                                            className="btn btn-primary mr-5"
                                            type="submit"
                                            // disabled={!isValid}
                                            title='Se guardan los datos del nuevo mesero.'
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={onCancel}
                                            type="button"
                                            title='Se cancelan los datos del nuevo mesero.'
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

export default CreateWaiter