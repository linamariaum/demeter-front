import React, { useLayoutEffect, useState } from 'react';
import Select from 'react-select';
import { useSupplies } from "../Context/Supplies.context.jsx";
import { useProduct } from '../Context/Product.context.jsx'
import { useForm, Controller } from 'react-hook-form';

const CreateDetailProduct = () => {
  const { CurrentProd, createDetailP, getDetailProduct, detailP } = useProduct();
  const { supplies } = useSupplies();
  const [selectedMeasure, setSelectedMeasure] = useState('');
  const [selectedSupply, setSelectedSupply] = useState(null);
  const { control, register, handleSubmit, setError, formState: { errors }, reset, } = useForm();

  useLayoutEffect(() => {
    getDetailProduct(CurrentProd)
  }, [])

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

  const suppliesOptions = supplies
    .filter(supply => supply.State && !detailP.some(d => d.Supply.Name_Supplies === supply.Name_Supplies))
    .map(supply => ({
      value: supply.ID_Supplies,
      label: supply.Name_Supplies,
      Measure: supply.Measure,
    }));

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedSupply || selectedSupply.value === '') {
      setError('Supplies_ID', {
        type: 'manual',
        message: 'Debe seleccionar un insumo para el producto.'
      });
      return;
    }

    values.Supplies_ID = selectedSupply.value;
    values.Product_ID = CurrentProd;

    // createDetailP(values)
  });

  return (
    <form onSubmit={onSubmit}>

      <div className="control">
        <div className="form-group col-md-6">
          <label htmlFor="Supplies_ID" className="form-label">
            Insumo: <strong>*</strong>
          </label>
          <Controller
            control={control}
            name="Supplies_ID"
            rules={{ required: 'Este campo es obligatorio' }}
            render={({ field }) => (
              <Select
                options={suppliesOptions}
                value={selectedSupply}
                onChange={(selectedOption) => {
                  setSelectedSupply(selectedOption);
                  field.onChange(selectedOption);
                  setSelectedMeasure(selectedOption.Measure);
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
          {errors.Supplies_ID && (
            <p className="text-red-500">{errors.Supplies_ID.message}</p>
          )}
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="Lot_ProductDetail" className="form-label">
            Cantidad: <strong>*</strong>
          </label>
          <input
            {...register("Lot_ProductDetail", {
              required: "La cantidad es obligatoria",
              // validate: (value) => {
              //   const parsedValue = parseFloat(value.replace(',', '.')); // Reemplaza la coma por un punto antes de convertir a número
              //   if (isNaN(parsedValue) || !isFinite(parsedValue)) {
              //     return 'El valor debe ser un número válido.';
              //   }
              // },
            })}
            type="text"
            placeholder='Cantidad del insumo'
            className="form-control"
          />
          {errors.Lot_ProductDetail && (
            <p className="text-red-500">
              {errors.Lot_ProductDetail.message}
            </p>
          )}

          {selectedMeasure && (
            <p className="text-muted">{`Medida: ${selectedMeasure}`}</p>
          )}
        </div>
      </div>

      <div className="buttonconfirm">
        <div className="mb-3">
          <button
            className="btn btn-primary mr-5"
            type="submit"
          >
            Agregar ingrediente
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateDetailProduct;
