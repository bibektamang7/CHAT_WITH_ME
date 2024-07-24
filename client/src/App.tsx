import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";

function App() {
  const token = "";
  const user = {};
  return (
    <Routes>
      <Route
        path="/"
        element={
          token && user ? <Navigate to={"/chat"} /> : <Navigate to={"/login"} />
        }
      ></Route>
      <Route
        path="/chat"
        element={<Chat />}
      />
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />
      <Route
        path="*"
        element={<p>404 Not found</p>}
      />
    </Routes>
  );
}

export default App;
