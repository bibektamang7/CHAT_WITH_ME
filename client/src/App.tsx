import React from "react";
import {Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function App() {

  const token = '';
  const user = {};
  return (
    <Routes>
      <Route path="/" element={token && user ? (<Navigate to={'/chat'}/>) : (<Navigate to={'/login'}/>)}></Route>
      <Route path="/chat" element={<Chat/>} />
      <Route path="/login" element={<Login/>} />
    </Routes>
  )
}

export default App;
