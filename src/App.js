import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DocRepo from "./components/management-rep/doc-repo";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DocRepo />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
