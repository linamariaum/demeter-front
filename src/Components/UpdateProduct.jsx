import React, { useState } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { useProduct } from '../Context/Product.context.jsx';
import { useCategoryProducts } from '../Context/CategoryProducts.context.jsx';
import { Navigate } from 'react-router-dom';

function UpdateProduct() {

    const { control, register, handleSubmit, formState: { errors, isValid }, setError } = useForm();
    const { updateProduct, product } = useProduct();
    const { Category_products } = useCategoryProducts();
    const [selectedCategory, setSelectedCategory] = useState(null);

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
        const idNameProductDuplicate = product.some(products => products.Name_Products === values.Name_Products);

        if (idNameProductDuplicate) {
            setError('Name_Products', {
                type: 'manual',
                message: 'El nombre del producto ya existe.'
            });
            return;
        }

        if (!selectedCategory || selectedCategory.value === '') {
            setError('ProductCategory_ID', {
                type: 'manual',
                message: 'Debe seleccionar una categoria para el producto.'
            });
            return;
        }

        values.ProductCategory_ID = selectedCategory.value;

        updateProduct(values)
    });

    const options = Category_products
        .filter(category => category.State)
        .map(category => ({
            value: category.ID_ProductCategory,
            label: category.Name_ProductCategory,
        }));

    return (
        <form onSubmit={onSubmit}>
            <div className="control">
                <div className="form-group col-md-6">
                    <label htmlFor="Name_Products" className="form-label">
                        Nombre: <strong>*</strong>
                    </label>
                    <input
                        {...register("Name_Products", {
                            required: "El nombre es obligatorio",
                            pattern: {
                                value: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]*[a-záéíóúñ]$/,
                                message:
                                    "El nombre del mesero debe tener la primera letra en mayúscula y solo letras."
                            }
                        })}
                        type="text"
                        placeholder='Nombre del producto'
                        className="form-control"
                    />
                    {errors.Name_Products && (
                        <p className="text-red-500">
                            {errors.Name_Products.message}
                        </p>
                    )}
                </div>

                <div className="form-group col-md-6">
                    <label htmlFor="ProductCategory_ID" className="form-label">
                        Categoria: <strong>*</strong>
                    </label>
                    <Controller
                        control={control}
                        name="ProductCategory_ID"
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field }) => (
                            <Select
                                options={options}
                                value={selectedCategory}
                                onChange={(selectedOption) => {
                                    setSelectedCategory(selectedOption);
                                    field.onChange(selectedOption);
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
                    {errors.ProductCategory_ID && (
                        <p className="text-red-500">{errors.ProductCategory_ID.message}</p>
                    )}
                </div>
            </div>

            <div className="control">
                <div className="form-group col-md-6">
                    <label htmlFor="Price_Product" className="form-label">
                        Precio: <strong>*</strong>
                    </label>
                    <input
                        {...register("Price_Product", {
                            required: "El precio es obligatorio",
                            validate: (value) => {
                                const parsedValue = parseInt(value);
                                if (isNaN(parsedValue)) {
                                    return 'El precio debe ser un número válido.';
                                }
                            },
                        })}
                        type="text"
                        placeholder='Precio del producto'
                        className="form-control"
                    />
                    {errors.Price_Product && (
                        <p className="text-red-500">
                            {errors.Price_Product.message}
                        </p>
                    )}
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="Image" className="form-label">
                        Imagen: <strong>*</strong>
                    </label>
                    <input
                        {...register("Image", {
                            required: "La imagen es obligatorio",
                            validate: (value) => {
                                if (!value[0]) {
                                    return 'Por favor, selecciona una imagen.';
                                }

                                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                                const fileExtension = value[0].name
                                    .slice(((value[0].name.lastIndexOf(".") - 1) >>> 0) + 2)
                                    .toLowerCase();

                                if (!allowedExtensions.includes(fileExtension)) {
                                    return 'Formato de imagen no permitido. Utiliza archivos JPG, JPEG, PNG o GIF.';
                                }
                            },
                        })}
                        type="file"
                        placeholder='Imagen del producto'
                        className="form-control"
                    />
                    {errors.Image && (
                        <p className="text-red-500">
                            {errors.Image.message}
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
                </div>
            </div>
        </form>
    )
}

export default UpdateProduct