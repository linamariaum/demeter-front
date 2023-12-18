import React, { useState, useEffect, useLayoutEffect } from "react";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { useCategoryProducts } from '../Context/CategoryProducts.context.jsx';
// import { useProduct } from '../Context/Product.context.jsx';
import CreateProductCategory from "../Components/CreateProductCategory.jsx";
import UpdateProductCategory from "../Components/UpdateProductCategory.jsx";
import DeleteProductCategory from "../Components/DeleteProductCategory.jsx";
import CannotDeleteCategory from "../Components/CannotDeleteProductsCategory.jsx";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import "../css/style.css";
import "../css/landing.css";

function ProductCategoryPage() {
  const { Category_products, getCategory_products, deleteCategory_products, toggleCategoryProductStatus } = useCategoryProducts();
  // const { Product, getProduct } = useProduct();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductCategoryToDelete, setSelectedProductCategoryToDelete] = useState(null);
  const [selectedProductCategoryToUpdate, setSelectedProductCategoryToUpdate] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showEnabledOnly, setShowEnabledOnly] = useState(
    localStorage.getItem("showEnabledOnlyProduct") === "true"
  );
  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);

  useLayoutEffect(() => {
    getCategory_products();
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    localStorage.setItem("showEnabledOnlyProduct", showEnabledOnly);
  }, [showEnabledOnly]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = () => {
    setShowEnabledOnly(!showEnabledOnly);
  };

  const filteredSupplies = supplies.filter((supply) => {
    const searchString = searchTerm.toLowerCase();
  
    if (showEnabledOnly) {
      return supply.State && Object.values(supply)
        .filter(value => typeof value === 'string') // Filter only string values
        .some(value => value.toLowerCase().includes(searchString));
    }
  
    return Object.values(supply)
      .filter(value => typeof value === 'string') // Filter only string values
      .some(value => value.toLowerCase().includes(searchString));
  });

  const enabledProductsCategory = filteredProductsCategory.filter((productCategory) => productCategory.State);
  const disabledProductsCategory = filteredProductsCategory.filter((productCategory) => !productCategory.State);
  const sortedProductsCategory = [...enabledProductsCategory, ...disabledProductsCategory];

  const pageCount = Math.ceil(sortedProductsCategory.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleProductsCategory = sortedProductsCategory.slice(startIndex, endIndex);

  const handleDelete = async (productCategory) => { 
      setShowWarning(false);
      setSelectedProductCategoryToDelete(productCategory);
      setDeleteModalOpen(true);
    
  };


  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedProductCategoryToDelete(null);
    setShowWarning(false);
  };

  const handleUpdateProductCategory = (productCategory) => {
    setSelectedProductCategoryToUpdate(productCategory);
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
                  <h5>Visualización de categoría de productos</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <CreateProductCategory />
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
                          {visibleProductsCategory.map((productCategory) => (
                            <tr key={productCategory.ID_ProductCategory}>
                              <td>{productCategory.Name_ProductCategory}</td>
                              <td>{productCategory.State ? 'Habilitado' : 'Deshabilitado'}</td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <UpdateProductCategory
                                    buttonProps={{
                                      buttonClass: `ml-1 btn btn-icon btn-primary ${!productCategory.State ? "text-gray-400 cursor-not-allowed" : ""}`,
                                      isDisabled: !productCategory.State,
                                      buttonText: <BiEdit />,
                                    }}
                                    productCategoryToEdit={productCategory}
                                    onUpdate={handleUpdateProductCategory}
                                  />
                                  <button
                                    onClick={() => handleDelete(productCategory)}
                                    className={`ml-1 btn btn-icon btn-danger ${!productCategory.State ? "text-gray-400 cursor-not-allowed" : ""}`}
                                    disabled={!productCategory.State}
                                    title="Este botón sirve para eliminar la categoría."
                                  >
                                    <AiFillDelete />
                                  </button>
                                  <button
                                    type="button"
                                    className={`ml-1 btn btn-icon btn-success ${productCategory.State ? "active" : "inactive"}`}
                                    onClick={() => toggleCategoryProductStatus(productCategory.ID_ProductCategory)}
                                    title="Este botón sirve para cambiar el estado de la categoría."
                                  >
                                    {productCategory.State ? (
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
        <DeleteProductCategory
          onClose={closeDeleteModal}
          onDelete={() => {
            if (selectedProductCategoryToDelete) {
              deleteCategory_products(selectedProductCategoryToDelete.ID_ProductCategory);
              closeDeleteModal();
            }
          }}
        />
      )}

      {showWarning && (
        <CannotDeleteCategory
          onClose={closeDeleteModal}
        />
      )}

      {selectedProductCategoryToUpdate && (
        <UpdateProductCategory
          productCategoryToEdit={selectedProductCategoryToUpdate}
          onUpdate={() => {
            setSelectedProductCategoryToUpdate(null);
          }}
        />
      )}

    </section>
  );
}

export default ProductCategoryPage;
