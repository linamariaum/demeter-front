import React, { useState, useEffect } from 'react';
import { useSupplies } from '../Context/Supplies.context';
import StoreIcon from '@mui/icons-material/Store';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../css/style.css'
import '../css/landing.css'

function Alert() {
  const { supplies, getSupplies } = useSupplies();
  const [lowStockSupplies, setLowStockSupplies] = useState([]);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getSupplies();
  }, []);


  useEffect(() => {
    // Intenta obtener los datos almacenados de localStorage
    const storedLowStockSupplies = localStorage.getItem('lowStockSupplies');

    // Verifica si el valor recuperado no es nulo ni indefinido
    if (storedLowStockSupplies !== null && storedLowStockSupplies !== undefined) {
      try {
        // Intenta analizar el valor recuperado como JSON
        const parsedData = JSON.parse(storedLowStockSupplies);

        // Actualiza el estado con los datos analizados
        setLowStockSupplies(parsedData);
      } catch (error) {
        console.error('Error al analizar JSON desde localStorage:', error);
      }
    }

    // Calcula lowStock y actualiza el estado
    const lowStock = supplies.filter((supply) => supply.Unit <= supply.Stock);
    setLowStockSupplies(lowStock);

    // Almacena los datos actualizados en localStorage
    localStorage.setItem('lowStockSupplies', JSON.stringify(lowStock));

  }, [supplies]);

  
  const pageCount = Math.ceil(lowStockSupplies.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleLowStockSupplies = lowStockSupplies.slice(startIndex, endIndex);

  const handleNavigate = () => {
    navigate('/shopping');
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <section className="pc-container">
      <div className="pcoded-content">
        <div className="row w-100">
          <div className="col-md-12">
            <div className="w-100 col-sm-12">
              <div className="card">
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-6">
                      <h5>Notificación</h5>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 ml-3">
                      <h5>Suministros con Existencias Bajas</h5>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Existencias</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleLowStockSupplies.map((supply) => (
                            <tr key={supply.ID_Supplies}>
                              <td>{supply.Name_Supplies}</td>
                              <td>{supply.Unit}</td>
                              <td>{supply.Stock}</td>
                              <td>
                                <button
                                  onClick={handleNavigate}
                                  className="btn btn-icon btn-primary"
                                  title='Este boton lo llevará a la pestaña de compras'
                                >
                                  <StoreIcon />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pagination-container pagination">
        <Stack spacing={2}>
          <Pagination
            count={pageCount}
            page={currentPage}
            siblingCount={2}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            title="Este botón sirve para cambiar de página."
          />
        </Stack>
      </div>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Página {currentPage} de {pageCount}
        </Typography>
      </Box>
    </section>
  );
}

export default Alert;