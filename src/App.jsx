import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import './index.css'
import ProtectedRoute from './ProtectedRoute.jsx'

//Context
import { Role } from './Context/Role.context.jsx'
import { User } from './Context/User.context.jsx'
import { Supplier } from './Context/Supplier.context.jsx'
import { ShoppingProvider } from './Context/Shopping.context.jsx'
import { Supplies } from './Context/Supplies.context.jsx'
import { CategorySupplies } from './Context/CategorySupplies.context.jsx'
import { CategoryProducts } from './Context/CategoryProducts.context.jsx'
import { SaleProvider } from './Context/SaleContext.jsx'
import { DashboardProvider } from './Context/Dashboard.context.jsx'
import { Product } from './Context/Product.context.jsx'
import { ProductCategoriesProvider } from './Context/ProductCategoriesContext'
import { ProductProvider } from './Context/ProductContext.jsx'
import { Module } from './Context/Module.context.jsx'
import { Losses } from './Context/Losses.context.jsx'

// Pages
import UserPage from './Pages/UserPage.jsx'
import RolePage from './Pages/RolePage.jsx'
import SupplierPage from './Pages/SupplierPage.jsx'
import SuppliesPage from './Pages/SuppliesPage.jsx'
import SuppliesCategoryPage from './Pages/SuppliesCategoryPage.jsx'
import ShoppingPage from './Pages/ShoppingPage.jsx'
import Login from './Pages/Login.jsx'
import ProductCategoryPage from './Pages/ProductCategoryPage.jsx'
import WaiterPage from './Pages/WaiterPage.jsx'
import DashBoard from './Pages/Dashboard.jsx'
import ResetPassword from './Pages/ResetPassword.jsx'
import NewPassword from './Pages/NewPassword.jsx'
import NewPurchase from './Pages/newPurchase.jsx'
import ProductPage from './Pages/ProductPage.jsx'
import Alert from './Pages/Alert.jsx'
import Instruction from './Pages/Instruction.jsx'
import ProductDetails from './Pages/ProductDetails.jsx'
import ViewSales from './Pages/ViewSales'
import Sales from './Pages/sales'

// Menu & Header
import Navbar from './Components/Navbar.jsx'
import Header from './Components/Header.jsx'
import ErrorBoundary from './Components/ErrorBoundary.jsx'
import { useEffect, useRef } from 'react'

function App() {

  return (
    <BrowserRouter>
      <Role>
        <User>
          <Module>
            <DashboardProvider>
              <CategorySupplies>
                <CategoryProducts>
                  <Product>
                    <Supplies>
                      <Losses>
                        <ShoppingProvider>
                          <SaleProvider>
                            <ProductCategoriesProvider>
                              <ProductProvider>
                                <Supplier>
                                  <Header />
                                  <Navbar />
                                  <ErrorBoundary>
                                    <Routes>
                                      <Route path='/' element={<Login />} />
                                      <Route path='/resetPassword' element={<ResetPassword />} />
                                      <Route path='/newPassword/:idUser' element={<NewPassword />} />
                                      <Route element={<ProtectedRoute />}>

                                        <Route path='/dashboard' element={<DashBoard />} />
                                        <Route path='/setting' element={<RolePage />} />
                                        <Route path='/user' element={<UserPage />} />
                                        <Route path='/category_supplies' element={<SuppliesCategoryPage />} />
                                        <Route path='/supplies' element={<SuppliesPage />} />
                                        <Route path='/supplier' element={<SupplierPage />} />
                                        <Route path='/shopping' element={<ShoppingPage />} />
                                        <Route path='/shop' element={<NewPurchase />} />
                                        <Route path='/category_product' element={<ProductCategoryPage />} />
                                        <Route path='/product' element={<ProductPage />} />
                                        <Route path='/waiter' element={<WaiterPage />} />
                                        <Route path='/alert' element={<Alert />} />
                                        <Route path='/instructions' element={<Instruction />} />
                                        <Route path='/create_product' element={<ProductDetails />} />
                                        <Route path='/sale' element={<ViewSales></ViewSales>} />
                                        <Route path='/sales' element={<Sales />} />
                                      </Route>
                                    </Routes>
                                  </ErrorBoundary>
                                </Supplier>
                              </ProductProvider>
                            </ProductCategoriesProvider>
                          </SaleProvider>
                        </ShoppingProvider>
                      </Losses>
                    </Supplies>
                  </Product>
                </CategoryProducts>
              </CategorySupplies>
            </DashboardProvider>
          </Module>
        </User>
      </Role>
    </BrowserRouter>
  )
}

export default App
