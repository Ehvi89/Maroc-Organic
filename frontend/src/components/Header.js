import logoMarocOragnic from "../assets/Logo_MAROC-ORGANIC-removebg-preview.png";
import {Link} from "react-router-dom";
import Login from "./Login"
import { useState, useEffect } from "react"

function Header(){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const handleLogin = () => {
        // Mettez à jour le state isAuthenticated
        setIsAuthenticated(true);
        // Fermez la pop-up de connexion
        setShowLogin(false);
    };

    return(
        <div className="header">
            <header>
                <div className="logo-marocOrganic">
                    <Link to="/"><img src={logoMarocOragnic} alt="logo Maroc Organic"/></Link>
                </div>
                <div className="list-menu">
                    <ul>
                        <li>
                            <Link to="clients">Clients</Link>
                        </li>
                        <li>
                            <Link to="/planningVisits">Planning des visites</Link>
                        </li>
                        <li>
                            <Link to="orderPayementTracking">Suivi des commandes</Link>
                        </li>
                        <li id="btn" className="user">
                            {!isAuthenticated && <Link onClick={() => setShowLogin(true)}>Connexion</Link>}
                            {isAuthenticated && <div>User name</div>}
                        </li>
                    </ul>
                    {showLogin && <Login onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
                </div>
            </header>
        </div>
    );
}

export default Header;