import React, { useEffect, useLayoutEffect, useState } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { useProduct } from '../Context/Product.context.jsx';
import { useCategoryProducts } from '../Context/CategoryProducts.context.jsx';

function UpdateProduct() {

    const { updateProduct, product, CurrentProd, getProductById } = useProduct();
    const { control, register, handleSubmit, reset, formState: { errors, isValid }, setError } = useForm();
    const { getCategory_products_without_state, Category_products } = useCategoryProducts();
    const [categoryProduct, setCategoryProduct] = useState([])
    const [selectedCategory, setSelectedCategory] = useState({});

    useEffect(() => {
        return async () => {
            const productData = await getProductById(CurrentProd);
            reset(productData);
            const categoryProducts = await getCategory_products_without_state(productData.ProductCategory_ID)

            setCategoryProduct(categoryProducts)
            setSelectedCategory({
                value: productData.ProductCategory_ID,
                label: categoryProducts,
            });

            // const categoryProductStructure = categoryProducts.map(c => ({
            //     value: c.ID_ProductCategory,
            //     label: c.Name_ProductCategory
            // }))

            // console.log("selectedCategory", categoryProductStructure)
        }

    }, [reset, getProductById, CurrentProd]);


    // return <h1>Hi</h1>

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
        values.ProductCategory_ID = selectedCategory.value;
        
        updateProduct(CurrentProd, values);
    });

    const options = categoryProduct
        .filter(category => category.State)
        .map(category => ({
            value: category.ID_ProductCategory,
            label: category.Name_ProductCategory,
        }));

    const onCancel = async () => {
        // Obtener los datos originales del producto
        const originalProductData = await getProductById(CurrentProd);

        // Establecer los valores originales en los campos del formulario
        setValue("Name_Products", originalProductData.Name_Products);
        setValue("ProductCategory_ID", {
            value: originalProductData.ProductCategory_ID,
            label: originalProductData.ProductCategory_Name, // Ajusta esto según la estructura real de tu categoría
        });
        setValue("Price_Product", originalProductData.Price_Product);
        // Restaurar cualquier otro campo que necesites

        // Otra opción: resetear todo el formulario a sus valores originales
        reset(originalProductData);
        navigate('/product');
    };

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
                        value={product.Name_Products}
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
                                // value={selectedCategory}
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
                        onClick={onCancel}
                        className="btn btn-danger mr-5"
                    >
                        Volver
                    </button>
                </div>
            </div>
        </form>
    )
}

export default UpdateProduct