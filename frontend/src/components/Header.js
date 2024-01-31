// Importez les modules nécessaires
import logoMarocOragnic from "../assets/Logo_MAROC-ORGANIC-removebg-preview.png";
import {Link, useLocation} from "react-router-dom";
import Login from "./Login"
import { useState, useEffect, useRef } from "react"

// Définissez le composant Header
function Header(){
    // État pour gérer l'authentification de l'utilisateur
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // État pour gérer l'affichage de la pop-up de connexion
    const [showLogin, setShowLogin] = useState(false);
    // État pour gérer l'ouverture du menu burger
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Utilisez useRef pour obtenir une référence à l'élément racine
    const node = useRef();

    // Fonction pour gérer la connexion de l'utilisateur
    const handleLogin = () => {
        setIsAuthenticated(true);
        setShowLogin(false);
    };

    // Récupérez l'URL de la page actuelle
    const { pathname } = useLocation();

    // Fonction pour gérer les clics en dehors du menu
    const handleClickOutside = (event) => {
        if (node.current.contains(event.target)) {
            // Le clic a eu lieu à l'intérieur du menu, donc ne faites rien
            return;
        }
        // Le clic a eu lieu en dehors du menu, donc fermez le menu
        setIsMenuOpen(false);
    };

    // Fonction pour gérer les clics sur l'overlay
    const handleOverlayClick = () => {
        // Le clic a eu lieu sur l'overlay, donc fermez le menu
        setIsMenuOpen(false);
    };

    // Ajoutez l'écouteur d'événements lorsque le composant est monté
    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        // Supprimez l'écouteur d'événements lorsque le composant est démonté
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Retournez le JSX pour le composant
    return(
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
                            <Link to="clients" className={`nav-link ${pathname === '/clients' ? 'active' : ''}`}>Clients</Link>
                        </li>
                        <li>
                            <Link to="/planningVisits" className={`nav-link ${pathname === '/planningVisits' ? 'active' : ''}`}>Planning des visites</Link>
                        </li>
                        <li>
                            <Link to="orderPayementTracking" className={`nav-link ${pathname === '/orderPayementTracking' ? 'active' : ''}`}>Suivi des commandes</Link>
                        </li>
                        <li id="btn" className="user">
                            {!isAuthenticated && <Link onClick={() => setShowLogin(true)}>Connexion</Link>}
                            {isAuthenticated && <div>User name</div>}
                        </li>
                    </ul>
                </div>
            </header>
            {showLogin && <Login onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
        </div>
    );
}

// Exportez le composant Header
export default Header;
