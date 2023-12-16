import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useCategoryProducts } from '../Context/CategoryProducts.context';
import { useForm } from 'react-hook-form';

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

function UpdateProductCategory({
  buttonProps = {
    buttonClass: 'btn btn-primary',
    buttonText: <BiEdit />,
    isDisabled: false,
  },
  productCategoryToEdit = null,
}) {
  const { updateCategory_products, Category_products } = useCategoryProducts();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm();

  useEffect(() => {
    if (productCategoryToEdit) {
      setValue('Name_ProductCategory', productCategoryToEdit.Name_ProductCategory);

    }
  }, [productCategoryToEdit]);

  function removeAccentsAndSpaces(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f\s]/g, '');
  }

  const onSubmit = handleSubmit(async (values) => {
    if (productCategoryToEdit) {
      const normalizedInputName = removeAccentsAndSpaces(values.Name_ProductCategory);
      const normalizedExistingNames = Category_products
        .filter(category => category.ID_ProductCategory !== productCategoryToEdit.ID_ProductCategory)
        .map(category => removeAccentsAndSpaces(category.Name_ProductCategory));

      const isNameDuplicate = normalizedExistingNames.includes(normalizedInputName);

      if (isNameDuplicate) {
        setError('Name_ProductCategory', {
          type: 'manual',
          message: 'El nombre de la categoría ya existe.',
        });
        return;
      }

      const productCategory = { ...productCategoryToEdit, ...values };
      try {
        await updateCategory_products(productCategory.ID_ProductCategory, productCategory);
        setOpen(false);
      } catch (error) {
        console.error('Error al actualizar la categoría de producto', error);
      }
    }
  });

  const onCancel = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <button
        type="button"
        className={buttonProps.buttonClass}
        onClick={() => {
          setOpen(true);
        }}
        disabled={buttonProps.isDisabled}
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
                <h5>Edición de categoria de producto</h5>
              </div>
              <div className="card-body">
                <form
                  onSubmit={(event) => onSubmit(event)}
                >
                  <div className="city">
                    <div className="form-group col-md-6">
                      <label htmlFor="Name_ProductCategory" className="form-label">
                        Nombre:
                      </label>
                      <input
                        {...register('Name_ProductCategory', {
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
                      {errors.Name_ProductCategory && (
                        <p className="text-red-500">
                          {errors.Name_ProductCategory.message}
                        </p>
                      )}
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

export default UpdateProductCategory;
