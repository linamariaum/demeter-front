import React, { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { AiFillDelete } from "react-icons/ai";
import ShoppingBill from '../Components/ShoppingBill';
import { useSupplies } from '../Context/Supplies.context'
import '../css/style.css'
import '../css/general.css'
import { useShoppingContext } from '../Context/Shopping.context';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Select from 'react-select';
import CreateSupplies from '../Components/CreateSupplies';
import useLocaStorage from '../hooks/useLocaStorage';



function NewPurchase() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { createMultipleShopping } = useShoppingContext()
  const [error, setError] = useState("")
  const [selectedSupplies, setSelectedSupplies, destroy] = useLocaStorage("suppliesTable", [])
  const [shoppingBillState, setShoppingBillState] = useState({
    total: 0
  })
  const [refreshPage, setRefreshPage] = useState(false);

  const [availableSupplies, setAvailableSupplies] = useState([]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // const [selectedSupplies, setSelectedSupplies] = useState([{
  //   Lot: "",
  //   medida1: "",
  //   Price_Supplier: "",
  //   supplieName: "",
  //   ID_Supplies: ""
  // }])

  //   [
  //     {
  //         "Lot": "12",
  //         "medida1": "kg",
  //         "Price_Supplier": "5000",
  //         "supplieName": "Panes",
  //         "ID_Supplies": "1"
  //     }
  // ]

  // {
  //   "value": 2,
  //   "label": "Jorge"
  // }
  const onConfirm = async ({ value, uuidv4 }) => {
    const data = selectedSupplies.map(({ ID_Supplies, ...data }) => ({
      shoppingDetails: {
        ...data,
        Supplies_ID: ID_Supplies
      },
      Total: shoppingBillState.total,
      State: 1,
      Supplier_ID: value,
      User_ID: 1,
      Invoice_Number: uuidv4
    }))

    await createMultipleShopping(data)
    destroy()

  }

  const onClose = () => {
    console.log("Close")
    destroy()
  }

  const [suppliesState, setSuppliesState] = useState([{
    ID_Supplies: "",
    Name_Supplies: "",
    Unit: 0,
    Measure: 0
  }])

  useEffect(() => {
    const updatedAvailableSupplies = suppliesState.filter(
      (supply) => !selectedSupplies.find((selected) => selected.ID_Supplies === supply.ID_Supplies)
    );
    setAvailableSupplies(updatedAvailableSupplies);
  }, [suppliesState, selectedSupplies]);

  const supplierRef = useRef(null)

  const onSubmit = (data) => {
    const { Name_Supplies = "" } = suppliesState.find(v => v.ID_Supplies == supplierRef.current) || {}
    const newData = {
      ...data,
      supplieName: Name_Supplies,
      ID_Supplies: supplierRef.current
    }

    if (Object.values(newData).some(v => !v)) {
      const message = "Llena todos los campos"
      setError(message)
      return
    }
    else if (error) {
      setError("")
    }
    reset()
    const element = selectedSupplies.findIndex(val => val.ID_Supplies == supplierRef.current)
    if (element != -1) {
      updateTotalValue(selectedSupplies.splice(element, 1, newData))
      setSelectedSupplies(prev => prev.splice(element, 1, newData))
    }
    else {
      updateTotalValue([...selectedSupplies, newData])
      setSelectedSupplies(prev => [...prev, newData])
    }

  };

  const { getShopSupplies } = useSupplies()

  const updateTotalValue = (array = selectedSupplies) => {
    setShoppingBillState(prev => ({
      ...prev,
      total: array.reduce((acc, curr) => acc + (curr.Price_Supplier * curr.Lot), 0)
    }))
  }
  useEffect(() => {
    // setSuppliesState(getSupplies())
    // console.log("Supplies")
    updateTotalValue()
    return async () => {
      const newSupplies = await Promise.resolve(getShopSupplies())
      setSuppliesState(newSupplies)
    }
    // console.log(getSupplies())
  }, [])

  /**
   * @param {Object} target
   * @param {Document} target.target
   */
  const onSelectSupplie = (option) => {
    // console.log(target.querySelector("selected").value)
    supplierRef.current = option.value
  }

  const onDeleteSupplie = (id) => {
    updateTotalValue(selectedSupplies.filter(el => el.ID_Supplies != id))
    setSelectedSupplies(prev => prev.filter(el => el.ID_Supplies != id))
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '200px',
      minHeight: '30px',
      fontSize: '14px',
      marginLeft: '20px',
      border: `1px solid ${state.isFocused ? '#FFA500' : 'black'}`,
      height: '34px',
      borderColor: state.isFocused ? '#FFA500' : 'black',
      boxShadow: state.isFocused ? '0 0 0 1px #FFA500' : 'none',
      "&:focus-within": {
        borderColor: '#FFA500',
      }
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: '14px',
      width: '200px',
      marginLeft: '20px',
    }),
  };

  const setCreatedSupplie = (data) => {
    // setAvailableSupplies(prev => [...prev, data])
    window.location.reload()
  }

  const inputValidation = (type, text) => {
    let parsedValue = text.replace(/\w+/g, "")
    let newValue = ""

    for (let i = 0; i <= parsedValue.length; i++) {

      if (i % 3 === 0) {
        newValue += "."
      }

      newValue += parsedValue[i]
    }

    setValue(type, newValue)
  }

  const floatValidation = (text, type) => {
    const newValue = text.replace(/[^0-9.]+/g, '')
    setValue(type, newValue)
  }
  return (

    <div className='position-shop'>
      <div className="flex justify-between mb-5 mx-10 mr-5 ">
        <div className="card">
          <div className="card-header">
            <h5>Detalle de compras</h5>
          </div>
          <div className=" card-body table-border-style mt-5 ">
            <form onSubmit={handleSubmit(onSubmit)} >
              <div className='position-shoppping'>
                <div className="flex flex-row mb-5 ml-5">
                  <div className="mr-5">
                    <label className='mt-1'>
                      Insumo:
                      <Select
                        className=" custom-select  "
                        onChange={(option) => onSelectSupplie(option)}
                        options={availableSupplies.map(({ ID_Supplies, Name_Supplies }) => ({
                          value: ID_Supplies,
                          label: Name_Supplies,

                        }))}
                        placeholder=""
                        styles={customStyles}
                      />
                    </label>

                  </div>
                  <div className=''>
                    <label>
                      Cantidad:
                      <input className="custom-input" type="number" {...register("Lot")} onInput={e => floatValidation(e.target.value, "Lot")} />
                    </label>
                  </div>
                  <div className='ml-2'>
                    <CreateSupplies setCreatedSupplie={setCreatedSupplie} />
                  </div>
                </div>

                <div className="flex mb-3">

                  <div className="mr-5 ml-5">
                    <label>
                      Medida:
                      <select className="select-measure  rounded-md p-1 mr-5 ml-3" {...register("Measure")}>
                        <option value="unidad(es)">Unidad(es)</option>
                        <option value="kg">Kilogramo(kg)</option>
                        <option value="g">gramos(g)</option>
                        <option value="L">Litros(L)</option>
                        <option value="ml">Mililitros(ml)</option>

                      </select>
                    </label>
                  </div>

                  <div>
                    <label className='ml-4'>
                      Precio:
                      <input className=" custom-input  " type="number" {...register("Price_Supplier")} onInput={e => floatValidation(e.target.value, "Price_Supplier")} />
                    </label>
                  </div>
                  <div className='flex flex-column ml-3  '>
                    <div className=''>
                      <button title='Presiona para agregar el insumo' type="submit" className="btn btn-icon btn-primary ">Agregar insumo</button>

                    </div>

                  </div>



                </div>
                {error && <p className='ml-5'>{error}</p>}
              </div>

            </form>

            <div className="position-table ">
              <table className="table table-sm ml-2 table-static ">
                <thead>
                  <tr>
                    <th>Insumo</th>
                    <th>Cantidad</th>
                    <th>Medida</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    selectedSupplies.slice(startIndex, endIndex).map(({ Lot, Price_Supplier, supplieName, Measure, ID_Supplies }) => (
                      <tr key={ID_Supplies}>
                        <td>{supplieName}</td>
                        <td>{Lot}</td>
                        <td>{Measure}</td>
                        <td>{Price_Supplier}</td>
                        <td>
                          <button type="button" className="btn btn-icon btn-danger" onClick={() => onDeleteSupplie(ID_Supplies)}>
                            <AiFillDelete />
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <div className="pagination-container">
                <Stack spacing={2} direction="row" justifyContent="center">
                  <Pagination
                    count={Math.ceil(selectedSupplies.length / itemsPerPage)}
                    color="secondary"
                    page={page}
                    onChange={handleChangePage}
                  />
                </Stack>
              </div>
            </div>
          </div>
        </div>
        <div className='position-facture ml-5 '>

          <ShoppingBill {...shoppingBillState} onConfirm={onConfirm} onClose={onClose} />
        </div>
      </div>
    </div>
  )
}

export default NewPurchase;