import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Box from "@mui/material/Box";
import { useForm } from 'react-hook-form';
import { useUser } from '../Context/User.context.jsx';
import { useRole } from '../Context/Role.context';

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

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        '&:hover': {
            border: state.isFocused ? '1px solid #e36209' : '1px solid #ced4da',
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

function CreateUser({ onClose, onCreated }) {
    const { register, handleSubmit, formState: { errors, isValid }, setError } = useForm();
    const { createUser, user } = useUser();
    const [selectedType, setSelectedType] = useState({ label: 'Seleccione tipo', value: '', isDisabled: true });
    const { role, getRoles } = useRole();
    const [selectRole, setSelectRol] = useState(null);

    const typeOptions = [
        { label: 'Seleccione tipo', value: '', isDisabled: true },
        { label: 'Cédula de ciudadanía', value: 'CC' },
        { label: 'Cédula de extranjería', value: 'CE' },
        { label: 'Pasaporte', value: 'PB' },
    ];

    useEffect(() => {
        getRoles();
    }, []);

    const handleRolChange = (selectedOption) => {
        setSelectRol(selectedOption);
    };

    function removeAccentsAndSpaces(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f\s]/g, '');
    }

    const onSubmit = handleSubmit(async (values) => {
        const normalizedInputName = removeAccentsAndSpaces(
            values.Email
        );
        const normalizedExistingNames = role.map((rol) =>
            removeAccentsAndSpaces(rol.Email)
        );

        const isEmailDuplicate = normalizedExistingNames.includes(
            normalizedInputName
        );

        const isDocumentouplicate = user.some(users => users.Document === values.Document);
        
        if (isDocumentouplicate) {
            setError('Document', {
                type: 'manual',
                message: 'El documento del usuario ya existe.'
            });
            return;
        }

        if (isEmailDuplicate) {
            setError('Email', {
                type: 'manual',
                message: 'El correo del usuario ya existe.'
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

        if (!selectRole || selectRole.value === '') {
            setError('Role_ID', {
                type: 'manual',
                message: 'Debe seleccionar un rol.'
            });
            return;
        }

        values.Type_Document = selectedType.value;
        values.Role_ID = selectRole.value;

        createUser(values);
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
                            <h5>Registro de empleado</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={onSubmit}>
                                <div className="control">
                                    <div className="form-group col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="Type_Document" className="form-label mt-3">
                                                Tipo de documento: <strong>*</strong>
                                            </label>
                                            <Select
                                                options={typeOptions}
                                                {...register("Type_Document")}
                                                value={selectedType}
                                                onChange={(selectedOption) => setSelectedType(selectedOption)}
                                                styles={customStyles}
                                                className='form-selects'
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary: '#e36209',
                                                    },
                                                })}
                                            />
                                            {errors.Type_Document && (
                                                <p className="text-red-500">
                                                    {errors.Type_Document.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label htmlFor="Document" className="form-label">
                                            N° de documento: <strong>*</strong>
                                        </label>
                                        <input
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
                                            type="number"
                                            placeholder='N° documento'
                                            className="form-control"
                                        />
                                        {errors.Document && (
                                            <p className="text-red-500">
                                                {errors.Document.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="control">
                                    <div className="form-group col-md-6">
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
                                            placeholder='Nombre'
                                            className="form-control"
                                        />
                                        {errors.Name_User && (
                                            <p className="text-red-500">
                                                {errors.Name_User.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="form-group col-md-6">
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
                                            placeholder='Apellido'
                                            className="form-control"
                                        />
                                        {errors.LastName_User && (
                                            <p className="text-red-500">
                                                {errors.LastName_User.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="control">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="Email" className="form-label">
                                            Correo electrónico: <strong>*</strong>
                                        </label>
                                        <input
                                            {...register("Email", {
                                                required: 'El correo es obligatorio',
                                                pattern: {
                                                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
                                                    message: 'El correo electrónico no es válido'
                                                }
                                            })}
                                            type="email"
                                            placeholder='Correo electrónico'
                                            className="form-control"
                                        />
                                        {errors.Email && (
                                            <p className="text-red-500">
                                                {errors.Email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label htmlFor="Password" className="form-label">
                                            Contraseña: <strong>*</strong>
                                        </label>
                                        <input
                                            {...register("Password", {
                                                required: 'La contraseña es obligatorio',
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?=.*\w).*$/,
                                                    message: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.'
                                                },
                                                minLength: {
                                                    value: 5,
                                                    message: 'La contraseña debe tener al menos 5 caracteres'
                                                },
                                                maxLength: {
                                                    value: 35,
                                                    message: 'La contraseña no puede tener más de 35 caracteres'
                                                }
                                            })}
                                            type="password"
                                            placeholder='Contraseña'
                                            className="form-control"
                                        />
                                        {errors.Password && (
                                            <p className="text-red-500">
                                                {errors.Password.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="control">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="Role_ID" className="form-label">
                                            Rol: <strong>*</strong>
                                        </label>
                                        <Select
                                            options={role.map((rol) => ({
                                                value: rol.ID_Role,
                                                label: rol.Name_Role,
                                            }))}
                                            {...register("Role_ID")}
                                            value={selectRole}
                                            onChange={handleRolChange}
                                            styles={customStyles}
                                            className='form-selects'
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary: '#e36209',
                                                },
                                            })}
                                        />
                                        {errors.Role_ID && (
                                            <p className="text-red-500">
                                                {errors.Role_ID.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="buttonconfirm">
                                    <div className="mb-3">
                                        <button
                                            className="btn btn-primary mr-5"
                                            type="submit"
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={onCancel}
                                            type="button"
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

export default CreateUser