import React, { useState, useEffect } from 'react';
import { BiEdit } from 'react-icons/bi';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useSupplies } from '../Context/Supplies.context';
import { useCategorySupplies } from '../Context/CategorySupplies.context';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    '@media (max-width: 770px)': {
        width: '75%',
    },
    '@media (max-width: 315px)': {
        width: '240px',
    },
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

function UpdateSupplies({
    buttonProps = {
        buttonClass: 'btn btn-primary',
        buttonText: <BiEdit />,
        isDisabled: false,
    },
    supplyToEdit = null,
}) {
    const { Category_supplies } = useCategorySupplies();
    const { updateSupplies, supplies } = useSupplies();
    const [open, setOpen] = useState(false);
    const [selectedMeasure, setSelectedMeasure] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        setError,
    } = useForm();

    useEffect(() => {
        if (supplyToEdit) {
            setValue('Name_Supplies', supplyToEdit.Name_Supplies);
            setValue('Unit', supplyToEdit.Unit);
            setValue('Stock', supplyToEdit.Stock);

            setSelectedMeasure({
                value: supplyToEdit.Measure,
                label: supplyToEdit.Measure,
            });

            const category = Category_supplies.find(
                (cat) => cat.ID_SuppliesCategory === supplyToEdit.SuppliesCategory_ID
            );
            if (category) {
                setSelectedCategory({
                    value: category.ID_SuppliesCategory,
                    label: category.Name_SuppliesCategory,
                });
            }
        }
    }, [supplyToEdit, Category_supplies]);


    function removeAccentsAndSpaces(str) {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\s]/g, "");
    }

    const onSubmit = handleSubmit(async (values) => {
        if (supplyToEdit) {
            const normalizedInputName = removeAccentsAndSpaces(values.Name_Supplies);
            const normalizedExistingNames = supplies
                .filter((supply) => supply.ID_Supplies !== supplyToEdit.ID_Supplies)
                .map((supply) => removeAccentsAndSpaces(supply.Name_Supplies));

            const isNameDuplicate = normalizedExistingNames.includes(normalizedInputName);

            if (isNameDuplicate) {
                setError('Name_Supplies', {
                    type: 'manual',
                    message: 'El nombre del insumo ya existe.',
                });
                return;
            }

            const supplie = { ...supplyToEdit, ...values };
            supplie.Measure = selectedMeasure.value;
            supplie.SuppliesCategory_ID = selectedCategory.value;

            try {
                await updateSupplies(supplie.ID_Supplies, supplie);
                setOpen(false);
            } catch (error) {
                console.error('Error al actualizar el insumo', error);
            }
        }
    });

    const onCancel = () => {
        setOpen(false);
    };

    const options = Category_supplies
        .filter(category => category.State)
        .map(category => ({
            value: category.ID_SuppliesCategory,
            label: category.Name_SuppliesCategory,
        }));

    return (
        <React.Fragment>
            <button
                type="button"
                className={buttonProps.buttonClass}
                onClick={() => {
                    setOpen(true);
                }}
                disabled={buttonProps.isDisabled}
                title="Este botón sirve para editar el insumo"
            >
                {buttonProps.buttonText}
            </button>

            <Modal
                open={open}
                onClose={onCancel}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 600 }}>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>Edición de insumos</h5>
                            </div>
                            <div className="card-body">
                                <form
                                    onSubmit={(event) => onSubmit(event)}
                                >
                                    <div className="control">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="Name_Supplies" className="form-label">
                                                Nombre:
                                            </label>
                                            <input
                                                {...register('Name_Supplies', {
                                                    required: 'Este campo es obligatorio',
                                                    pattern: {
                                                        value: /^[A-Za-zÁÉÍÓÚÑáéíóúñ]+(\s[A-Za-zÁÉÍÓÚÑáéíóúñ]+)?$/,
                                                        message:
                                                            'Solo se permiten letras, tildes y hasta un espacio entre letras.',
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
                                            {errors.Name_Supplies && (
                                                <p className="text-red-500">
                                                    {errors.Name_Supplies.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="Unit" className="form-label">
                                                Cantidad:
                                            </label>
                                            <input
                                                {...register('Unit', {
                                                    required: 'Este campo es obligatorio',
                                                    validate: {
                                                        isDouble: (value) => {
                                                            const parsedValue = parseFloat(value);
                                                            if (isNaN(parsedValue)) {
                                                                return 'Debe ser un número positivo.';
                                                            }
                                                        },
                                                        validRange: (value) => {
                                                            const parsedValue = parseFloat(value);
                                                            if (parsedValue < 0 || parsedValue > 99999999) {
                                                                return 'La cantidad debe estar entre 0 y 99999999.';
                                                            }
                                                        },
                                                    },
                                                })}
                                                maxLength={8}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/[^\d.]/g, '');
                                                }}
                                                type="text"
                                                className="form-control"
                                            />
                                            {errors.Unit && (
                                                <p className="text-red-500">{errors.Unit.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="control">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="Measure" className="form-label">
                                                Medida:
                                            </label>
                                            <Controller
                                                control={control}
                                                name="Measure"
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <Select
                                                        options={[
                                                            { value: 'Unidad(es)', label: 'Unidad(es)' },
                                                            { value: 'Kilogramos (kg)', label: 'Kilogramos (kg)' },
                                                            { value: 'Gramos (g)', label: 'Gramos (g)' },
                                                            { value: 'Litros (L)', label: 'Litros (L)' },
                                                            { value: 'Mililitros (ml)', label: 'Mililitros (ml)' },
                                                        ]}
                                                        value={selectedMeasure}
                                                        onChange={(selectedOption) => {
                                                            setSelectedMeasure(selectedOption);
                                                            field.onChange(selectedOption.value);
                                                        }}
                                                        styles={customStyles}
                                                        className="form-selects"
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary: '#e36209',
                                                            },
                                                        })}
                                                    />
                                                )}
                                            />
                                            {errors.Measure && (
                                                <p className="text-red-500">{errors.Measure.message}</p>
                                            )}
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="Stock" className="form-label">
                                                Existencia mínima:
                                            </label>
                                            <input
                                                {...register('Stock', {
                                                    required: 'Este campo es obligatorio',
                                                    validate: {
                                                        isDouble: (value) => {
                                                            const parsedValue = parseFloat(value);
                                                            if (isNaN(parsedValue)) {
                                                                return 'Debe ser un número positivo.';
                                                            }
                                                        },
                                                        validRange: (value, { Unit }) => {
                                                            const parsedValue = parseFloat(value);
                                                            const parsedUnit = parseFloat(Unit);

                                                            if (parsedValue < 0 || parsedValue > 9999) {
                                                                return 'La existencia mínima debe estar entre 0 y 9999.';
                                                            }

                                                            if (parsedValue > parsedUnit) {
                                                                return `No puede ser mayor que la cantidad: ${parsedUnit}.`;
                                                            }
                                                        },
                                                    },
                                                })}
                                                maxLength={4}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/[^\d.]/g, '');
                                                }}
                                                type="text"
                                                className="form-control"
                                            />
                                            {errors.Stock && (
                                                <p className="text-red-500">{errors.Stock.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="city">
                                        <div className="form-group col-md-6 select-rebeld">
                                            <label htmlFor="SuppliesCategory_ID" className="form-label">
                                                Categoría:
                                            </label>
                                            <Controller
                                                control={control}
                                                name="SuppliesCategory_ID"
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <Select
                                                        options={options}
                                                        value={selectedCategory}
                                                        onChange={(selectedOption) => {
                                                            setSelectedCategory(selectedOption);
                                                            field.onChange(selectedOption.value);
                                                        }}
                                                        styles={customStyles}
                                                        className="form-selects"
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary: '#e36209',
                                                            },
                                                        })}
                                                    />
                                                )}
                                            />
                                            {errors.SuppliesCategory_ID && (
                                                <p className="text-red-500">
                                                    {errors.SuppliesCategory_ID.message}
                                                </p>
                                            )}
                                            <div className="invalid-feedback">Ingrese la categoría</div>
                                        </div>
                                    </div>

                                    <div className="buttonconfirm">
                                        <div className="mb-3">
                                            <button
                                                className="btn btn-primary mr-5"
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

export default UpdateSupplies;
