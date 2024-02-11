// Import necessary modules
import logoMarocOragnic from "../assets/Logo_MAROC-ORGANIC-removebg-preview.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useFunctions} from "./SharedContext";
import ChangePassword from "./changePassword";

// Define Header component
function Header() {
    // State to manage user authentication
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // State to manage login popup display
    const [showLogin, setShowLogin] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    // State to manage burger menu opening
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Use useRef to get a reference to the root element
    const node = useRef();
    const { authToken, removeToken, user } = useAuth();
    const navigate = useNavigate();


    // Update the useEffect hook to set isAuthenticated based on the presence of authToken
    useEffect(() => {
        // If authToken exists, set isAuthenticated to true
        if (authToken) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [authToken]);

    // Function to handle user login
    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setShowLogin(false);
    };

    const handleLogout = () => {
        removeToken(); // Remove the authentication token
        setIsAuthenticated(false); // Update the authentication state
        // Redirect the user to the home page or login page
        // You can use useHistory from react-router-dom for this
    }

    // Get the URL of the current page
    const { pathname } = useLocation();

    // Function to handle clicks outside the menu
    const handleClickOutside = (event) => {
        if (node.current && !node.current.contains(event.target)) {
            // The click happened outside the menu, so close the menu
            setIsMenuOpen(false);
        }
    };

    // Add event listener when component is mounted
    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        // Remove event listener when component is unmounted
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);


    // Function to handle clicks on the overlay
    const handleOverlayClick = () => {
        // The click happened on the overlay, so close the menu
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
            // Redirige vers la page /planningVisits si l'utilisateur a les droits nécessaires
            navigate('/orderPayementTracking')
        }
    };

    const closePopup = () => {
        setShowError(false); // Ferme le popup d'erreur
    };

    // Return the JSX for the component
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
                            {!isAuthenticated && <Link onClick={() => setShowLogin(true)}>Connexion</Link>}
                            {isAuthenticated && <Link
                                onClick={() => setShowMenu(!showMenu)}>{user?.name}</Link>} {/* Use optional chaining to safely access user properties */}
                            {showMenu &&
                                <div className={'menuConnecte'}>
                                    {user.role !== 'Administrateur' &&
                                        <Link style={{margin: '5px', color:'black'}} onClick={() => {toggleEditMode(); setShowMenu(false)}} to={'#'}>Modifier</Link>}
                                    {user.role === 'Administrateur' &&
                                        <Link style={{margin: '5px', color:'black'}} to={'/dashboard'} onClick={() => setShowMenu(false)}>DashBoard</Link>}
                                    <Link style={{margin: '5px', color:'#E73541'}} to={'/'} onClick={() => {
                                        handleLogout();
                                        setShowMenu(false)
                                    }}>Deconnexion</Link>
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
