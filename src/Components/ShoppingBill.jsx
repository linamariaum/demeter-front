import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import '../css/style.css'
import ConfirmShop from './confirmShop';
import CancelShop from './CancelShop';
import { useSupplier } from '../Context/Supplier.context';
import { useUser } from '../Context/User.context';
import Select from 'react-select';
import useLocaStorage from '../hooks/useLocaStorage';



function ShoppingBill({ total = 0, onConfirm, onClose, ...confirmValues }) {
  const { register, handleSubmit } = useForm();
  const [uuidv4, setUuidv4] = useState("")
  const { getSupplier } = useSupplier()

  const [currentUser, setCurrentUser] = useState({})

  const { getCurrentUser } = useUser()

  // const uuidv4 = useMemo(() => v4(), [])
  const [supplierState, setSupplierState] = useState([{
    Name_Supplier: "",
    ID_Supplier: "",
    Name_Business: "",
  }])
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSupplier, setSelectedSupplier, destroy] = useLocaStorage("supplier", {});

  useLayoutEffect(() => {
    return async () => {
      const newSupplier = await Promise.resolve(getSupplier());
      const filteredSuppliers = newSupplier.filter((supplierItem) => supplierItem.State);
      setSupplierState(filteredSuppliers);
    };
  }, []);


  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '177px',
      minHeight: '30px',
      fontSize: '14px',
      borderColor: state.isFocused ? '#FFA500' : 'black',
      boxShadow: state.isFocused ? '0 0 0 1px #FFA500' : 'none',
      "&:focus-within": {
        borderColor: '#FFA500',
      }
    }),
  };

  const beforeConfirm = (data) => {
    onConfirm(data)
    destroy()
  }

  const beforeCancel = () => {
    onClose()
    destroy()
  }

  //para enviar los datos con useform
  const onSubmit = handleSubmit(data => {
    console.log(data)
  })
  //se utilizará para actualizar la fecha cada segundo o en intervalos regulares, llamando ka función tick  
  useLayoutEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return async () => {
      clearInterval(timerID);
      const user = await getCurrentUser()

      setCurrentUser(user)
    };
  }, []);

  //La fecha se muestra dinámicamente en el componente usando currenteDate
  const tick = () => {
    setCurrentDate(new Date());
  };

  const handleChange = (value, name) => {
    setSelectedSupplier(value);
  };

  const options = supplierState.map(({ ID_Supplier, Name_Supplier, Name_Business }) => ({
    value: ID_Supplier,
    label: Name_Supplier,
  }));

  const confirmShopData = {
    ...confirmValues,
    uuidv4
  }


  return (

    <div className="facture flex justify-between gap-20 w-full h-full ">
      <form className="w-full max-w-xs p-6" onSubmit={onSubmit}>
        <div className="text-center">
          <h2>Factura</h2>
          <h5 className='mt-3'>{currentDate.toLocaleDateString()}</h5>
          <h5>Usuario: {`${currentUser.Name_User} ${currentUser.LastName_User}`}</h5>
          <hr className="ml-2" />
        </div>
        <div className="flex mb-2 mr-2">
          <h5 className=' mt-2'>N. factura:</h5>
          <input className='custom-input-facture' type="text"
            value={uuidv4.length > 20 ? uuidv4.slice(0, 20) + "..." : uuidv4}
            onChange={e => setUuidv4(e.target.value)}
            placeholder='Identificador de la factura'
          />
          {/* <input className='custom-input-facture' type="text" value={uuidv4.length > 20 ? uuidv4.slice(0, 20) + "..." : uuidv4} /> */}

        </div>
        <div className="flex mt-3 mr-2">
          <h5 className=' mt-2'>Proveedor: </h5>
          <Select
            required
            className='ml-3'
            options={options}
            value={selectedSupplier}
            onChange={handleChange}
            placeholder=""
            styles={customStyles}
          />

        </div>
        <hr className='ml-2 mt-4' />
        <div>
          <h1 className='text-center mt-5'>$ {total}</h1>
          <p className='text-center mt-1'>Total</p>
        </div>

        <div className="mt-auto ">
          <hr className="ml-2 mt-4 " />
          <div className="flex justify-between pt-3">
            <ConfirmShop {...confirmShopData} data={selectedSupplier}
              onConfirm={beforeConfirm} />
            <CancelShop onClose={beforeCancel} />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ShoppingBill