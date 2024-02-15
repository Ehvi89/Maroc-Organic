import React, { createContext, useState, useContext, useEffect } from 'react';
import { FunctionProvider } from './SharedContext';
import {jwtDecode} from 'jwt-decode';

// Création d'un contexte pour gérer l'authentification
const AuthContext = createContext();

// Composant Provider pour le contexte d'authentification
export const AuthProvider = ({ children }) => {
    // Récupération du token d'authentification stocké localement
    const [authToken, setAuthToken] = useState(() => {
        const storedToken = window.localStorage.getItem('authToken');
        return storedToken ? storedToken : null;
    });

    // Récupération des données de l'utilisateur stockées localement
    const [user, setUser] = useState(() => {
        const storedUser = window.localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Fonction pour vérifier si le token a expiré
    const isTokenExpired = () => {
        try {
            const decodedToken = jwtDecode(authToken);
            const currentTime = Math.floor(Date.now() /  1000);
            const tokenIssuedTime = decodedToken.iat;
            const tokenDuration =  24 *  60 *  60; // Durée du token en secondes (24 heures)
            return (currentTime - tokenIssuedTime) > tokenDuration;
        } catch (err) {
            return false;
        }
    };

    // Effet pour effacer les informations de l'utilisateur si le token a expiré
    useEffect(() => {
        if (isTokenExpired()) {
            removeToken();
        }
    }, [authToken, isTokenExpired]); // Note: isTokenExpired() devrait être passé sans les parenthèses

    // Fonction pour définir le token et le sauvegarder dans le stockage local
    const setToken = (token, userData) => {
        window.localStorage.setItem('authToken', token);
        window.localStorage.setItem('user', JSON.stringify(userData));
        setAuthToken(token);
        setUser(userData);
    };

    // Fonction pour supprimer le token et le retirer du stockage local
    const removeToken = () => {
        window.localStorage.removeItem('authToken');
        window.localStorage.removeItem('user');
        setAuthToken(null);
        setUser(null);
    };

    // Fourniture du contexte aux composants enfants
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
