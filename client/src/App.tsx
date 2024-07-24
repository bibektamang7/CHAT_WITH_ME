import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";

import { UserMessages } from "./pages/widgets/UserMessages";

function App() {
  const token = "";
  const user = {};
  return (
    <Routes>
      <Route
        path="/"
        element={
          token && user ? <Navigate to={"/chat/message"} /> : <Navigate to={"/login"} />
        }
      ></Route>
      <Route
        path="/chat/"
        element={<Chat/>}
      >
        <Route
          path="user"
          element={<p>Hello user</p>}
        />
        <Route
          path="setting"
          element={<p>Hello setting</p>}
        />
        <Route
          path="message"
          element={<UserMessages/>}
        />
      </Route>
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
