import { createContext } from "react";

const AuthContext = createContext({
    token: "",
    user: {}
});

const AuthProvider = AuthContext.Provider;


