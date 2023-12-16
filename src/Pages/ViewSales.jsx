import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSaleContext } from '../Context/SaleContext';
import { useProduct } from '../Context/Product.context.jsx'
import ReactPaginate from 'react-paginate';
import '../fonts/feather.css'; 
import '../fonts/fontawesome.css'; 
import '../fonts/material.css'; 
import '../css/style.css'; 
import { AiOutlineEye, AiFillDelete } from 'react-icons/ai'
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { BiEdit } from 'react-icons/bi'
import users from '../img/users.png'
import PaymentMethodModal from '../Components/PayModal.jsx'
import ReadSale from './ReadSale';
import { useUser } from "../Context/User.context.jsx";


function ViewSales() {
  const {  fetchSales, Sales, paySale, getOne, Sale , selectAction, CancelDet , newDetails, clearDet} = useSaleContext();
  const [pageNumber, setPageNumber] = useState(0);
  const [idSale, setID] = useState();
  const salesPerPage = 6;
  const pagesVisited = pageNumber * salesPerPage;
  const { getDetailProduct2 } = useProduct();
  const { user, getWaiters, toggleUserStatus } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };
  const [productIdsList, setProductIdsList] = useState([]);
  const pageCount = Math.ceil(Sales.length / salesPerPage);
  let isCleared = false;
  
  useLayoutEffect(() => {
    fetchSales();
    getWaiters();
    newDetails.forEach((detail, index) => {
      getDetailProduct2(detail.Product_ID);
      
      // Verificar si ya se ejecutó clearDet
      if (!isCleared) {
        clearDet();
        isCleared = true;
      }
    });
  }, []);
 

  const [isModalOpen, setIsModalOpen] = useState(false);

 
  const openModal = () => {
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };

    const [helloModalOpen, setHelloModalOpen] = useState(false);

    const openHelloModal = () => {
      setHelloModalOpen(true);
    };
  
    const closeHelloModal = () => {
      setHelloModalOpen(false);
    };
  
    const getUserById = (userId) => {
      return user.find(user => user.ID_User === userId);
     };
     

     const displaySales = Sales.filter(sale => 
      sale.User_ID 
       ? getUserById(sale.User_ID)?.Name_User.includes(searchTerm) 
       : false
     ).slice(pagesVisited, pagesVisited + salesPerPage);
     
  return (
    <div>
      <section className="pc-container">
        <div className="pcoded-content">
          <div className="row">
            <div className="col-md-12 w-[150vh]">
              <div className="card">
                <div className="card-header">
                  <h5>Visualización de Ventas</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <Link to="/sales">
                        <button type="button" className="btn bg-red-500" onClick={() =>{selectAction(1) }}>
                          Registrar Ventas
                        </button>
                      </Link>
                    </div>
                   
                    <div className="col-md-6">
                    <div className="form-group">
                    <input
                      type="search"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="Buscador"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-body table-border-style">
                    <div className="table-responsive">
                      <table className="table table-hover " >
                        <thead>
                          <tr>
                            <th >#</th>
                            <th>Estado</th>
                            <th>Total</th>
                            <th>SubTotal</th>
                            <th>Mesero</th>
                            <th className='flex flex-row  justify-center'>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                        {displaySales.map((sale, index) => (
                            <tr key={index}>
                              <td>{sale.ID_Sale}</td>
                              <td>{sale.StatePay ? 'Pendiente' : 'Pagado'}</td>
                              <td>{sale.Total}</td>
                              <td>{sale.Total}</td>
                              <td>{sale.User_ID ? getUserById(sale.User_ID)?.Name_User || 'Venta Rapida' : 'Venta Rapida'}</td>
                              <td className='flex flex-row justify-center space-x-[2vh]'>
                                <Link to= '/sales'>
                                <button type="button" className="btn btn-icon btn-primary" onClick={() =>{getOne(sale.ID_Sale), selectAction(2)}} >
                                  <i><BiEdit></BiEdit></i>
                                </button>
                                </Link>
                                <button type="button" className="btn btn-icon btn-secondary" onClick={()=>{getOne(sale.ID_Sale).then(openHelloModal()) }}>
                                  <i><AiOutlineEye></AiOutlineEye></i>
                                </button>
                                <button type="button" className="btn btn-icon btn-success" onClick={() =>{openModal(), setID(sale.ID_Sale)}}>
                                  <i><FaRegMoneyBillAlt></FaRegMoneyBillAlt></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="ml-[50vh]">
                    <ReactPaginate
                      previousLabel={'<'}
                      nextLabel={'>'}
                      pageCount={pageCount}
                      onPageChange={handlePageClick}
                      containerClassName={'pagination space-x-2 mt-4'}
                      previousLinkClassName={'text-gray-600 rounded-full p-2'}
                      nextLinkClassName={'text-gray-600 rounded-full p-2'}
                      disabledClassName={'text-gray-300 cursor-not-allowed'}
                      activeClassName={'bg-red-500 text-white rounded-full pl-2 pr-2'}
                    />
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </section>
      {helloModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="modal-container bg-white w-96 rounded-lg shadow-lg">
              <ReadSale></ReadSale>
            <div className="modal-actions flex justify-center pb-4">
              <button
                type="button"
                className="btn bg-red-500 text-white py-2 px-4 rounded-lg"
                onClick={closeHelloModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <PaymentMethodModal isOpen={isModalOpen} onRequestClose={() =>{closeModal(), fetchSales()}} id={idSale} />
    </div>
  );
}
export default ViewSales;