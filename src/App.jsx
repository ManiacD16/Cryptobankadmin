import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import ManageMerchant from './components/Pages/ManageMerchant'
import FeeManagement from './components/Pages/FeeManagement'
import Transactions from './components/Pages/transactionmanagement'

const App = () => {
  const location = useLocation();

  // If on Login page, don't render Header
  const showHeader = location.pathname !== "/";

  return (
    <div className="min-h-screen bg-gray-100">
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/manage" element={<ManageMerchant />} />
        <Route path="/fees" element={<FeeManagement />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </div>
  );
};

export default App;
