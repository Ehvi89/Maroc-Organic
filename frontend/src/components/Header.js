// Import necessary modules
import logoMarocOragnic from "../assets/Logo_MAROC-ORGANIC-removebg-preview.png";
import {Link, useLocation} from "react-router-dom";
import Login from "./Login"
import { useState, useEffect, useRef } from "react"

// Define Header component
function Header(){
    // State to manage user authentication
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // State to manage login popup display
    const [showLogin, setShowLogin] = useState(false);
    // State to manage burger menu opening
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Use useRef to get a reference to the root element
    const node = useRef();

    // Function to handle user login
    const handleLogin = () => {
        setIsAuthenticated(true);
        setShowLogin(false);
    };

    // Get the URL of the current page
    const { pathname } = useLocation();

    // Function to handle clicks outside the menu
    const handleClickOutside = (event) => {
        if (node.current.contains(event.target)) {
            // The click happened inside the menu, so do nothing
            return;
        }
        // The click happened outside the menu, so close the menu
        setIsMenuOpen(false);
    };

    // Function to handle clicks on the overlay
    const handleOverlayClick = () => {
        // The click happened on the overlay, so close the menu
        setIsMenuOpen(false);
    };

    // Add event listener when component is mounted
    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        // Remove event listener when component is unmounted
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Return the JSX for the component
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

// Export Header component
export default Header;
