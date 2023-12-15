import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useCategorySupplies } from '../Context/CategorySupplies.context';
import { useForm } from 'react-hook-form';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    '@media (max-width: 770px)': {
        width: '50%',
    },
    '@media (max-width: 410px)': {
        width: '200px',
    },
};

function CreateCategory_supplies({
    onDefaultSubmit = null,
    buttonProps = {
        buttonClass: 'btn btn-primary',
        buttonText: 'Registrar',
    },
}) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm();

    const { Category_supplies, createCategory_supplies } = useCategorySupplies();
    const [open, setOpen] = useState(false);

    function removeAccentsAndSpaces(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f\s]/g, '');
    }

    const onSubmit = handleSubmit(async (values) => {
        const normalizedInputName = removeAccentsAndSpaces(
            values.Name_SuppliesCategory
        );
        const normalizedExistingNames = Category_supplies.map((category) =>
            removeAccentsAndSpaces(category.Name_SuppliesCategory)
        );

        const isNameDuplicate = normalizedExistingNames.includes(
            normalizedInputName
        );

        if (isNameDuplicate) {
            setError('Name_SuppliesCategory', {
                type: 'manual',
                message: 'El nombre de la categoría ya existe.',
            });
            return;
        }

        const dataToSend = {
            ...values,
            Name_SuppliesCategory: values.Name_SuppliesCategory,
        };

        createCategory_supplies(dataToSend);
        setOpen(false);
        reset();
    });

    const onCancel = () => {
        setOpen(false);
        reset();
    };

    return (
        <React.Fragment>
            <button
                type="button"
                className={buttonProps.buttonClass}
                onClick={() => setOpen(true)}
            >
                {buttonProps.buttonText}
            </button>

            <Modal
                open={open}
                onClose={onCancel}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>Registro de categoría de insumos</h5>
                            </div>
                            <div className="card-body">
                                <form
                                    onSubmit={(event) =>
                                        typeof onDefaultSubmit === 'function'
                                            ? onDefaultSubmit(event, setOpen)
                                            : onSubmit(event)
                                    }
                                >
                                    <div className="city-two">
                                        <div className="form-group col-md-6">
                                            <label
                                                htmlFor="Name_SuppliesCategory"
                                                className="form-label"
                                            >
                                                Nombre: <strong>*</strong>
                                            </label>
                                            <input
                                                {...register('Name_SuppliesCategory', {
                                                    required: 'Este campo es obligatorio',
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
                                                className="form-control"
                                            />
                                            {errors.Name_SuppliesCategory && (
                                                <p className="text-red-500">
                                                    {errors.Name_SuppliesCategory.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="buttonconfirm-two">
                                        <div className="mb-3">
                                            <button
                                                className="btn btn-primary mr-4"
                                                type="submit"
                                                title="Este botón sirve para guardar la información y cerrar la ventana modal."
                                            >
                                                Confirmar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={onCancel}
                                                type="submit"
                                                title="Este botón sirve para cerrar la ventana modal sin guardar la información."
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default CreateCategory_supplies;

