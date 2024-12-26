import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import SignupForm from "./auth/SignUp";
import LoginForm from "./auth/LoginPage";
import ProfilePage from "./auth/ProfilePage";
// import CarEditForm from "./auth/vehicles/car/CarEditForm";
import SingleCarPage from "./auth/vehicles/car/SingleCarPage";
// import CarFormPage from "./auth/car/CarFormPage";
// import CarListPage from "./auth/vehicles/car/CarListPage";
import CartPage from "./auth/vehicles/car/CartPage";

import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import ModeratorPage from "./pages/ModeratorPage";
// import Layout from "./components/Layout";
import PurchasePage from "./auth/purchase/purchasePage";
import ItemFormPage from "./auth/item/ItemFormPage";
import Dashboard from "./auth/dashboard/Dashboard";
import EditItemPage from "./auth/item/EditItemPage";
import CarFormPage from "./auth/vehicles/car/CarFormPage";
import FormPage from "./auth/item/FormPage";
import PurchaseListPage from "./auth/admin/PurchaseListPage ";
import ItemListPage from "./auth/item/ItemListPage";
import SingleItemPage from "./auth/item/SingleItemPage";
import PurchaseHistory from "./auth/purchase/purchaseHistory";
import ItemTypeEditPage from "./auth/item/ItemTypeEditPage";
import ItemPage from "./components/Items/ItemPage";
import UserPurchasePage from "./auth/purchase/UserPurchasePage";




const App = () => {
  return (
    <Router future={{ startTransition: true }}>

      {/* <Layout> */}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* <Route path="/upload" element={<CarFormPage />} /> */}
        <Route path="/cart" element={<CartPage />} />
        {/* <Route path="/edit/:id" element={<CarEditForm />} /> */}
        <Route path="/item/:itemTypeId" element={<SingleItemPage />} />
        <Route path="/car/:id" element={<SingleCarPage />} />
        <Route path="/purchase/:Id" element={<PurchasePage />} />
        <Route path="/edit-item/:itemId" element={<EditItemPage />} />
        <Route path="/edit/:itemTypeId" element={<ItemTypeEditPage />} />
        <Route path="items-by-type" element={<ItemPage />} />

        <Route path="/adminpage" element={<AdminPage />}>
          <Route path="items-by-type" element={<ItemListPage />} />

          {/* <Route path="add" element={<CarFormPage />} /> */}
          {/* <Route path="list" element={<CarListPage />} /> */}
          <Route path="item" element={<ItemFormPage />} />
          <Route path="details" element={<PurchaseListPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="car" element={<CarFormPage />} />
          <Route path="form" element={<FormPage />} />
          <Route path="purchase-history" element={<PurchaseHistory />} />
        </Route>
        <Route path="/userpage" element={<UserPage />} >
          <Route path="orders" element={<UserPurchasePage/>} />
        </Route>
        <Route path="/moderatorpage" element={<ModeratorPage />} />
      </Routes>
      {/* </Layout> */}
    </Router>
  );
};

export default App;
