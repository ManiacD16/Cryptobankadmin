import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
// import QRCodeGenerator from "./components/QRCodeGenerator";
import AdminPanel from "./components/AdminPanel";
import ManageMerchant from './components/Pages/ManageMerchant'
import FeeManagement from './components/Pages/FeeManagement'

const App = () => {
  return (
    // <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        {/* <div className="container mx-auto mt-6"> */}
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/payment" element={<QRCodeGenerator />} /> */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/manage" element={<ManageMerchant />} />
            <Route path="/fees" element={<FeeManagement />} />
          </Routes>
        {/* </div> */}
      </div>
    //  </Router>
  );
};

export default App;
