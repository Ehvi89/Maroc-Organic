// Importation des modules nécessaires
import logoMarocOragnic from "../assets/Logo_MAROC-ORGANIC-removebg-preview.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import ChangePassword from "./changePassword";

// Définition du composant Header
function Header() {
    // État pour gérer l'authentification de l'utilisateur
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // État pour gérer l'affichage du popup de connexion
    const [showLogin, setShowLogin] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    // État pour gérer l'ouverture du menu hamburger
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Utilisation d'useRef pour obtenir une référence à l'élément racine
    const node = useRef();
    const { authToken, removeToken, user } = useAuth();
    const navigate = useNavigate();

    // Mise à jour du hook useEffect pour définir isAuthenticated en fonction de la présence authToken
    useEffect(() => {
        // Si authToken existe, set isAuthenticated à true
        if (authToken) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [authToken]);

    // Fonction pour gérer la connexion de l'utilisateur
    const handleLogin = () => {
        setIsAuthenticated(true);
        setShowLogin(false);
    };

    const handleLogout = () => {
        removeToken(); // Supprime le token d'authentification
        setIsAuthenticated(false); // Met à jour l'état d'authentification
        // Redirige l'utilisateur vers la page d'accueil ou la page de connexion
    }

    // Obtention de l'URL de la page actuelle
    const { pathname } = useLocation();

    // Fonction pour gérer les clics en dehors du menu
    const handleClickOutside = (event) => {
        if (node.current && !node.current.contains(event.target)) {
            // Le clic s'est produit en dehors du menu, donc fermez le menu
            setIsMenuOpen(false);
        }
    };

    // Ajoutez un écouteur d'événements lorsque le composant est monté
    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        // Supprimez l'écouteur d'événements lorsque le composant est démonté
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Fonction pour gérer les clics sur overlay
    const handleOverlayClick = () => {
        // Le clic s'est produit sur overlay, donc fermez le menu
        setIsMenuOpen(false);
        setIsEditing(false);
    };

    const [isEditing, setIsEditing] = useState(false);
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const [showError, setShowError] = useState(false);

    const handleOverClick = (event) => {
        event.preventDefault(); // Empêche la navigation par défaut
        if (user.role === 'Stagiaire') {
            setShowError(true); // Affiche le message d'erreur
        } else {
            setIsMenuOpen(false);
            // Redirige vers la page /planningVisits si l'utilisateur aux droits nécessaires
            navigate('/orderPayementTracking')
        }
    };

    const closePopup = () => {
        setShowError(false); // Ferme le popup d'erreur
    };

    // Retourne le JSX pour le composant
    return (
        <div ref={node} className="header">
            <header>
                <div className="logo-marocOrganic">
                    <Link to="/"><img src={logoMarocOragnic} alt="logo Maroc Organic"/></Link>
                </div>
                <div className="burger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className={`overlay ${isMenuOpen && !showLogin ? 'open' : ''}`} onClick={handleOverlayClick}></div>
                <div className={`list-menu ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li>
                            <Link to="clients"
                                  className={`nav-link ${pathname === '/clients' ? 'active' : ''}`}
                                  onClick={handleOverlayClick}>
                                Clients
                            </Link>
                        </li>
                        <li>
                            <Link to="/planningVisits"
                                  className={`nav-link ${pathname === '/planningVisits' ? 'active' : ''}`}
                                  onClick={handleOverlayClick}>
                                Planning des visites
                            </Link>
                        </li>
                        <li>
                            {showError && (
                                <div className="popup">
                                    <div className="popup-content">
                                        <h2>Non autorisé(e)</h2>
                                        <p>Vous ne disposez des droits nécessaire pour accéder à cette fenêtre</p>
                                        <button onClick={closePopup}>Fermer</button>
                                    </div>
                                </div>
                            )}
                            <Link to="orderPayementTracking"
                                  className={`nav-link ${pathname === '/orderPayementTracking' ? 'active' : ''}`}
                                  onClick={handleOverClick}>
                                Suivi des commandes
                            </Link>
                        </li>
                        <li id="btn" className="user">
                            {!isAuthenticated && <Link onClick={() => setShowLogin(true)} to={'#'}>Connexion</Link>}
                            {isAuthenticated && <Link
                                onClick={() => setShowMenu(!showMenu)} to={'#'}>{user?.name}</Link>} {/* Use optional chaining to safely access user properties */}
                            {showMenu &&
                                <div className={'menuConnecte'}>
                                    {user.role !== 'Administrateur' &&
                                        <Link style={{margin: '5px', color:'black'}} onClick={() => {toggleEditMode(); setShowMenu(false)}} to={'#'}>Modifier l'utilisateur</Link>}
                                    {user.role === 'Administrateur' &&
                                        <Link style={{margin: '5px', color:'black'}} to={'/dashboard'} onClick={() => setShowMenu(false)}>DashBoard</Link>}
                                    <Link style={{margin: '5px', color:'#E73541'}} to={'/'} onClick={() => {
                                        handleLogout();
                                        setShowMenu(false)
                                    }}>Déconnexion</Link>
                                </div>
                            }
                        </li>
                    </ul>
                </div>
            </header>
            {showLogin && <Login onClose={() => setShowLogin(false)} onLogin={handleLogin}/>}
            {isEditing && (
                <ChangePassword onClose={handleOverlayClick}/>
            )}
        </div>
    );
}

// Export Header component
export default Header;
