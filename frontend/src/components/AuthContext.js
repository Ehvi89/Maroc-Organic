import React, { createContext, useState, useContext } from 'react';
import {FunctionProvider} from "./SharedContext";

// Créer un contexte pour l'authentification
const AuthContext = createContext();

// Provider pour le contexte d'authentification
// Provider pour le contexte d'authentification
export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => {
        const storedToken = window.localStorage.getItem('authToken');
        return storedToken ? storedToken : null;
    });

    const [user, setUser] = useState(() => {
        const storedUser = window.localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Function to set the token and save it to storage
    const setToken = (token, userData) => {
        window.localStorage.setItem('authToken', token);
        window.localStorage.setItem('user', JSON.stringify(userData));
        setAuthToken(token);
        setUser(userData);
    };

    // Function to remove the token and clear it from storage
    const removeToken = () => {
        window.localStorage.removeItem('authToken');
        window.localStorage.removeItem('user');
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, user, setToken, removeToken }}>
            <FunctionProvider>
                {children}
            </FunctionProvider>
        </AuthContext.Provider>
    );
};


// Hook personnalisé pour accéder au contexte d'authentification
export const useAuth = () => useContext(AuthContext);