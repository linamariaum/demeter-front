import React, { useState, useEffect, useLayoutEffect } from "react";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { useCategorySupplies } from '../Context/CategorySupplies.context.jsx';
import { useSupplies } from "../Context/Supplies.context.jsx";
import CreateSuppliesCategory from "../Components/CreateSuppliesCategory.jsx";
import UpdateSuppliesCategory from "../Components/UpdateSuppliesCategory.jsx";
import DeleteSuppliesCategory from "../Components/DeleteSuppliesCategory.jsx";
import CannotDeleteCategory from "../Components/CannotDeleteSuppliesCategory.jsx";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import "../css/style.css";
import "../css/landing.css";

function SuppliesCategoryPage() {
  const { Category_supplies, getCategory_supplies, deleteCategory_supplies, toggleCategorySupplyStatus } = useCategorySupplies();
  const { supplies, getSupplies } = useSupplies();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSupplyCategoryToDelete, setSelectedSupplyCategoryToDelete] = useState(null);
  const [selectedSupplyCategoryToUpdate, setSelectedSupplyCategoryToUpdate] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showEnabledOnly, setShowEnabledOnly] = useState(
    localStorage.getItem("showEnabledOnly") === "true"
  );
  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);


  useLayoutEffect(() => {
    getCategory_supplies();
    getSupplies();
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    localStorage.setItem("showEnabledOnly", showEnabledOnly);
  }, [showEnabledOnly]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = () => {
    setShowEnabledOnly(!showEnabledOnly);
  };

  const filteredSuppliesCategory = Category_supplies.filter((suppliesCategory) => {
    const {
      Name_SuppliesCategory,
    } = suppliesCategory;
    const searchString =
      `${Name_SuppliesCategory}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const enabledSuppliesCategory = filteredSuppliesCategory.filter((suppliesCategory) => suppliesCategory.State);
  const disabledSuppliesCategory = filteredSuppliesCategory.filter((suppliesCategory) => !suppliesCategory.State);
  const sortedSuppliesCategory = [...enabledSuppliesCategory, ...disabledSuppliesCategory];

  const pageCount = Math.ceil(sortedSuppliesCategory.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleSuppliesCategory = sortedSuppliesCategory.slice(startIndex, endIndex);

  const handleDelete = async (supplyCategory) => {
    const categoryID = supplyCategory.ID_SuppliesCategory;

    const suppliesInCategory = supplies.filter((supply) => supply.SuppliesCategory_ID === categoryID);

    if (suppliesInCategory.length > 0) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      setSelectedSupplyCategoryToDelete(supplyCategory);
      setDeleteModalOpen(true);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedSupplyCategoryToDelete(null);
    setShowWarning(false);
  };

  const handleUpdateSupplyCategory = (supplyCategory) => {
    setSelectedSupplyCategoryToUpdate(supplyCategory);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <section className="pc-container">
      <div className="pcoded-content">
        <div className="row w-100">
          <div className="col-md-12">
            <div className=" w-100 col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h5>Visualización de categoría de insumos</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <CreateSuppliesCategory />
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
                        />
                      </div>
                    </div>
                    <div className="form-check ml-4 mt-1">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="showEnabledOnly"
                        checked={showEnabledOnly}
                        onChange={handleCheckboxChange}
                        title="Este interruptor sirve para visualizar únicamente las categorías habilitadas."
                      />
                      <label className="form-check-label" htmlFor="showEnabledOnly">
                        Mostrar solo habilitados
                      </label>
                    </div>
                  </div>

                  <div className="card-body table-border-style">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleSuppliesCategory.map((suppliesCategory) => (
                            <tr key={suppliesCategory.ID_SuppliesCategory}>
                              <td>{suppliesCategory.Name_SuppliesCategory}</td>
                              <td>{suppliesCategory.State ? 'Habilitado' : 'Deshabilitado'}</td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <UpdateSuppliesCategory
                                    buttonProps={{
                                      buttonClass: `ml-1 btn btn-icon btn-primary ${!suppliesCategory.State ? "text-gray-400 cursor-not-allowed" : ""}`,
                                      isDisabled: !suppliesCategory.State,
                                      buttonText: <BiEdit />,
                                    }}
                                    supplyCategoryToEdit={suppliesCategory}
                                    onUpdate={handleUpdateSupplyCategory}
                                  />
                                  <button
                                    onClick={() => handleDelete(suppliesCategory)}
                                    className={`ml-1 btn btn-icon btn-danger ${!suppliesCategory.State ? "text-gray-400 cursor-not-allowed" : ""}`}
                                    disabled={!suppliesCategory.State}
                                    title="Este botón sirve para eliminar la categoría."
                                  >
                                    <AiFillDelete />
                                  </button>
                                  <button
                                    type="button"
                                    className={`ml-1 btn btn-icon btn-success ${suppliesCategory.State ? 'active' : 'inactive'}`}
                                    onClick={() => toggleCategorySupplyStatus(suppliesCategory.ID_SuppliesCategory)}
                                    title="Este botón sirve para cambiar el estado de la categoría."
                                  >
                                    {suppliesCategory.State ? (
                                      <MdToggleOn className={`estado-icon active`} />
                                    ) : (
                                      <MdToggleOff className={`estado-icon inactive`} />
                                    )}
                                  </button>
                                </div>
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

      {isDeleteModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <DeleteSuppliesCategory
            onClose={closeDeleteModal}
            onDelete={() => {
              if (selectedSupplyCategoryToDelete) {
                deleteCategory_supplies(selectedSupplyCategoryToDelete.ID_SuppliesCategory);
                closeDeleteModal();
              }
            }}
          />
        </div>
      )}

      {showWarning && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <CannotDeleteCategory
            onClose={closeDeleteModal}
          />
        </div>
      )}

      {selectedSupplyCategoryToUpdate && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <UpdateSuppliesCategory
            supplyCategoryToEdit={selectedSupplyCategoryToUpdate}
            onUpdate={() => {
              setSelectedSupplyCategoryToUpdate(null);
            }}
          />
        </div>
      )}

    </section>
  );
}

export default SuppliesCategoryPage;
