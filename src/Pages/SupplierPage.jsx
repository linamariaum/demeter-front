import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { BiEdit } from "react-icons/bi";
import { AiOutlineEye, AiFillDelete } from "react-icons/ai";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { useSupplier } from "../Context/Supplier.context";
import "../css/style.css";
import "../css/landing.css";
import "../fonts/cryptofont.css";
import "../fonts/feather.css";
import "../fonts/fontawesome.css";
import "../fonts//material.css";
import CreateSupplier from "../Components/CreateSupplier.jsx";
import DeleteSupplier from "../Components/DeleteSupplier.jsx";
import LinkedSupplier from "../Components/LinkedSupplier.jsx";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useUser } from "../Context/User.context.jsx";



function SupplierPage() {
  const { supplier, getSupplierByState, updateSupplier, getSupplie, toggleSupplyStatus } = useSupplier();
  const { existSupplierByEmailOrId } = useUser()
  const [searchTerm, setSearchTerm] = useState("");
  const currentSupplierDataRef = useRef({
    email: "",
    document: ""
  })

  const [showEnabledOnly, setShowEnabledOnly] = useState(
    localStorage.getItem("showEnabledOnly") === "true"
  );

  useEffect(() => {
    localStorage.setItem("showEnabledOnly", showEnabledOnly);
  }, [showEnabledOnly]);


  useLayoutEffect(() => {
    getSupplierByState();
  }, []);

  const onSupplierChangeState = () => {
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }
  //funcion para inhabilitar proveedor
  const status = supplier.State ? "" : "desactivado";

  //función para mostrar solo los habilitdos
  const handleCheckboxChange = (event) => {
    setShowEnabledOnly(event.target.checked);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSuppliers = supplier.filter((supplierItem) => {
    const {
      Type_Document,
      Document,
      Name_Supplier,
      Name_Business,
      Phone,
      City,
      Email,
      State
    } = supplierItem;


    if (showEnabledOnly) {
      return (
        supplierItem.State && // Verificar si el proveedor está habilitado
        `${Type_Document} ${Document} ${Name_Supplier} ${Name_Business} ${City}  ${Phone}  ${Email}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Si showEnabledOnly no está marcado, mostrar todos los proveedores que coincidan con la búsqueda
    return (
      `${Type_Document} ${Document} ${Name_Supplier} ${Name_Business} ${City}  ${Phone}  ${Email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });
  //   const searchString =
  //     `${Type_Document} ${Document} ${Name_Supplier} ${Name_Business} ${Phone} ${City} ${Email} ${State}`.toLowerCase();
  //   return searchString.includes(searchTerm.toLowerCase());
  // });

  //paginación

  const itemsForPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const enabledUsers = filteredSuppliers.filter((supplier) => supplier.State);
  const disabledUsers = filteredSuppliers.filter((supplier) => !supplier.State);
  const sortedUsers = [...enabledUsers, ...disabledUsers];

  const pageCount = Math.ceil(sortedUsers.length / itemsForPage);

  const startIndex = (currentPage - 1) * itemsForPage;
  const endIndex = startIndex + itemsForPage;
  const visibleUsers = sortedUsers.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  const onUpdate = (data, id, modalView) => {

    updateSupplier(id, data);
    modalView(false);
  };

  const onOpenComponent = async (id, { setValue }) => {
    const supplierById = await getSupplie(id);

    for (const key in supplierById) {
      setValue(key, supplierById[key]);
    }
  };

  const beforeUpdate = async ({ Email, Document }, errorSetter) => {
    const { existingUser: { Email: e_email }, existUser } = await existSupplierByEmailOrId(Email, Document)
    const { email } = currentSupplierDataRef.current

    const condition = existUser && email !== e_email
    if (condition) {
      errorSetter("Email", {
        type: "manual",
        message: "El correo y/o documento del proveedor ya existe."
      });

      errorSetter("Document", {
        type: "manual",
        message: "El correo y/o documento del proveedor ya existe."
      });

    }

    return !condition
  }

  return (
    <section className="pc-container">
      <div className="pcoded-content">
        <div className="row w-100">
          <div className="col-md-12">
            <div className=" w-100 col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h5>Visualización del proveedor</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6" title="Presiona para registrar un proveedor">
                      <CreateSupplier whenSubmit={onSupplierChangeState} />
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
                          onChange={handleSearchChange}
                          title="Presiona para buscar el proveedor"
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
                            <th>Tipo de documento</th>
                            <th>Documento</th>
                            <th>Nombre</th>
                            <th>Empresa</th>
                            <th>Telefono</th>
                            <th>Ciudad</th>
                            <th>Email</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleUsers.map((supplierItem) => (
                            <tr key={supplierItem.ID_Supplier}>
                              <td>{supplierItem.Type_Document}</td>
                              <td>{supplierItem.Document}</td>
                              <td>{supplierItem.Name_Supplier}</td>
                              <td>{supplierItem.Name_Business}</td>
                              <td>{supplierItem.Phone}</td>
                              <td>{supplierItem.City}</td>
                              <td>{supplierItem.Email}</td>
                              <td className={`${status}`}>
                                {supplierItem.State ? "Habilitado" : "Deshabilitado"}
                              </td>
                              <td className="flex items-center">
                                <button onClick={() => {
                                  currentSupplierDataRef.current = {
                                    ...currentSupplierDataRef.current,
                                    email: supplierItem.Email,
                                    document: supplierItem.Document
                                  }
                                }}>

                                  <CreateSupplier
                                    isDisabled={!supplierItem.State}
                                    key={supplierItem.ID_Supplier}
                                    onDefaultSubmit={(event, setOpen) =>
                                      onUpdate(
                                        event,
                                        supplierItem.ID_Supplier,
                                        setOpen
                                      )
                                    }
                                    onOpen={(params) =>
                                      onOpenComponent(
                                        supplierItem.ID_Supplier,
                                        params
                                      )
                                    }
                                    buttonProps={{
                                      buttonText: (
                                        <i data-feather="thumbs-up" title="Presiona para editar el proveedor">
                                          <BiEdit />
                                        </i>
                                      ),
                                      buttonClass: "btn btn-icon btn-primary mr-1",
                                    }}

                                    whenSubmit={onSupplierChangeState}
                                    beforeSubmit={beforeUpdate}
                                  />
                                </button>
                                <div title="Presiona para eliminar el proveedor">
                                  <DeleteSupplier
                                    currentSupplier={supplierItem}
                                    isDisabled={!supplierItem.State}
                                  />

                                </div>

                                <button
                                  type="button"
                                  title='Presiona para inhabilitar o habilitar el proveedor'
                                  className={`btn  btn-icon btn-success ml-1 ${status}`}
                                  onClick={() => toggleSupplyStatus(supplierItem.ID_Supplier)}

                                >
                                  {supplierItem.State ? (
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

export default SupplierPage;