import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useShoppingContext } from '../Context/Shopping.context';
import { useSupplier } from "../Context/Supplier.context";
import { useUser } from '../Context/User.context';
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import ShoppingView from '../Components/ShoppingView';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import '../css/style.css';
import "../css/landing.css";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


function ShoppingPage() {
  const { getOneShopping, shopping: Shopping, selectAction, disableShopping, getShopingByProvider } = useShoppingContext();
  const [searchTerm, setSearchTerm] = useState("");
  const { getCurrentUser } = useUser();
  const [currentUser, setCurrentUser] = useState({})
  const [shoppingData, setShoppingData] = useState([])
  const [showEnabledOnly, setShowEnabledOnly] = useState(
    localStorage.getItem("showEnabledOnly") === "true"
  );

  useEffect(() => {
    localStorage.setItem("showEnabledOnly", showEnabledOnly);
  }, [showEnabledOnly]);


  useLayoutEffect(() => {
    return async () => {
      const user = await getCurrentUser()
      const data = await getShopingByProvider();
      setShoppingData(Array.isArray(data) ? data : [data]);
      setCurrentUser(user)
    };
  }, []);

  const status = Shopping.State ? "" : "desactivado";

  //función para mostrar solo los inhabilitados

  const handleCheckboxChange = (event) => {
    setShowEnabledOnly(event.target.checked);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredShopping = shoppingData?.filter((shoppingItem) => {
    const {
      ID_Shopping,
      Total,
      State,
      Supplier: { Name_Supplier },
    } = shoppingItem;

    const itemDate = new Date(shoppingItem.Datetime).toLocaleDateString('en-CA');
    const searchDate = new Date(searchTerm).toLocaleDateString('en-CA');

    if (showEnabledOnly) {
      // Filtrar por proveedores habilitados que coincidan con la búsqueda
      return (
        shoppingItem.State && // Verificar si el proveedor está habilitado
        (itemDate === searchDate.toLowerCase() || // Comparar fechas
          `${ID_Shopping} ${itemDate} ${Total} ${State} ${Name_Supplier} `
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) // Comparar términos de búsqueda
      );
    }

    // Si showEnabledOnly no está marcado, mostrar todos los proveedores que coincidan con la búsqueda
    return (
      itemDate === searchDate.toLowerCase() ||
      `${ID_Shopping} ${itemDate} ${Total} ${State} ${Name_Supplier}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const itemsForPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const enabledUsers = filteredShopping.filter((shop) => shop.State);
  const disabledUsers = filteredShopping.filter((shop) => !shop.State);
  const sortedUsers = [...enabledUsers, ...disabledUsers];

  const pageCount = Math.ceil(sortedUsers.length / itemsForPage);

  const startIndex = (currentPage - 1) * itemsForPage;
  const endIndex = startIndex + itemsForPage;
  const visibleUsers = sortedUsers.slice(startIndex, endIndex);

  console.log("visibleUsers", visibleUsers)

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  const generatePDF = () => {
    const tableBody = shoppingData?.map((shoppingItem) => {
      const {
        ID_Shopping,
        Datetime,
        Total,
        Invoice_Number,
        Supplier: { Name_Supplier },
      } = shoppingItem;

      return [
        { text: ID_Shopping, bold: true, alignment: 'center' },
        { text: `${currentUser.Name_User} ${currentUser.LastName_User}`, alignment: 'center' }, // Agregar información del usuario
        { text: Invoice_Number },
        { text: Name_Supplier, alignment: 'center' },
        { text: new Date(Datetime).toLocaleDateString(), alignment: 'center' },
        { text: Total, alignment: 'center' },


      ];
    });

    const documentDefinition = {
      content: [
        { text: 'Reporte de compras', fontSize: 16, margin: [0, 10, 0, 10] }, // Margen superior ajustado
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', '*', 'auto', '*'], // Ajuste de anchos de columnas
            body: [
              [
                'ID',
                'Usuario',
                'N. factura',
                'Proveedor',
                'Fecha',
                'Total',
              ],
              ...tableBody,
            ],
          },
          layout: {
            defaultBorder: false, // Si no necesitas bordes en cada celda
            fontSize: 12,
            fillColor: (rowIndex) => (rowIndex % 2 === 0 ? '#CCCCCC' : null),
            paddingTop: () => 5, // Espaciado superior de cada celda
            paddingBottom: () => 5, // Espaciado inferior de cada celda
          },
        },
      ],
      styles: {
        table: {
          width: '100%',
          margin: [0, 10, 0, 15], // Margen inferior ajustado para la tabla
        },
      },
    };

    pdfMake.createPdf(documentDefinition).download('shopping_report.pdf');
  };

  const handleDisableShopping = async (id) => {
    const disabledShopping = await disableShopping(id)

    if (disabledShopping == null) return

    setShoppingData(prev =>
      prev.map((data) =>
        data.ID_Shopping === disabledShopping.ID_Shopping
          ? { ...data, State: !data.State }
          : data
      ))
  }

  return (
    <section className="pc-container">
      <div className="pcoded-content">
        <div className="row w-100">
          <div className="col-md-12">
            <div className=" w-100 col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h5>Visualización de compras</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <Link to="/shop">
                        <button type="button" className="btn btn-primary" onClick={() => { selectAction(1) }}>
                          Registrar compra
                        </button>
                      </Link>

                      <button title='Presiona para generar el pdf ' className="btn btn-outline-secondary p-2 ml-1" onClick={generatePDF}>Generar Reporte </button>



                    </div>
                    <div className="col-md-6">
                      <div className="form-group">


                        <input
                          type="search"
                          title='Presiona para buscar la compra'
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder="Buscador"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-check ml-4 mt-1" >
                    <input
                      type="checkbox"
                      title='Presiona para mostrar solo las compras habilitadas'
                      className="form-check-input"
                      id="showEnabledOnly"
                      checked={showEnabledOnly}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="showEnabledOnly">
                      Mostrar solo habilitados
                    </label>
                  </div>


                  <div className="card-body table-border-style">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Usuario</th>
                            <th>N Factura</th>
                            <th>Proveedor</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleUsers.map((
                            {
                              ID_Shopping,
                              Invoice_Number,
                              Datetime,
                              Total,
                              State,
                              Supplier: {
                                Name_Supplier,
                                ID_Supplier
                              }
                            }
                          ) => (
                            <tr key={ID_Shopping}>
                              <td>{new Date(Datetime).toLocaleDateString()}</td>
                              <td>{`${currentUser.Name_User} ${currentUser.LastName_User}`}</td>
                              <td>{Invoice_Number}</td>
                              <td>{Name_Supplier}</td>
                              <td>{Total}</td>
                              <td className={`${status}`}>
                                {State ? "Habilitado" : "Deshabilitado"}
                              </td>

                              <td className="flex items-center" title='Presiona para ver el detalle de la compra'>
                                <ShoppingView id={ID_Supplier} date={Datetime} />

                                <button
                                  type="button"
                                  title='Presiona para inhabilitar o habilitar la compra'
                                  className={`btn  btn-icon btn-success ${status}`}
                                  onClick={() => handleDisableShopping(ID_Shopping)}

                                >
                                  {State ? (
                                    <MdToggleOn className={`estado-icon active${status}`} />
                                  ) : (
                                    <MdToggleOff className={`estado-icon inactive${status}`} />

                                  )}
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
      <div
        className="pagination-container pagination"
        title='Para moverse mas rapido por el modulo cuando hay varios registros en el sistema.'
      >
        <Stack spacing={2}>
          <Pagination
            count={pageCount}
            page={currentPage}
            siblingCount={2}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      </div>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, title: 'Muestra la pagina en la que se encuentra actualmente de las paginas en total que existen.' }}>
        <Typography variant="body2" color="text.secondary">
          Página {currentPage} de {pageCount}
        </Typography>
      </Box>

    </section>
  );
}

export default ShoppingPage