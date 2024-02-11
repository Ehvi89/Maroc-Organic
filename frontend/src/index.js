import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext'; // Assurez-vous que le chemin est correct

// Importations des styles
import './styles/index.css';
import './styles/header.css';
import './styles/Form.css';
import './styles/banner.css';
import './styles/options.css';

// Importation des pages
import Header from "./components/Header";
import AddReport from "./pages/AddReport";
import Home from "./pages/Home";
import PlanningVisites from "./pages/PlanningVisites";
import Error from "./pages/Error";
import Clients from "./pages/Clients";
import OrderPayementTracking from "./pages/OrderPayementTracking";
import AddOrder from "./pages/AddOrder";
import AddClient from "./pages/AddClient";
import DashBoard from "./pages/DashBoard";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <Router>
                <Header/>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path={"addReport"} element={<AddReport/>}/>
                    <Route path={"planningVisits"} element={<PlanningVisites/>}/>
                    <Route path={"clients"} element={<Clients/>}/>
                    <Route path={"orderPayementTracking"} element={<OrderPayementTracking/>}/>
                    <Route path={"addOrder"} element={<AddOrder/>}/>
                    <Route path={"addClients"} element={<AddClient/>}/>
                    <Route path={'dashboard'} element={<DashBoard/>} />
                    <Route path="*" element={<Error/>} />
                </Routes>
            </Router>
        </AuthProvider>
    </React.StrictMode>
);

// Si vous voulez commencer à mesurer les performances dans votre application, passez une fonction
// pour enregistrer les résultats (par exemple : reportWebVitals(console.log))
// ou envoyez-les à un point de terminaison d'analyse. Apprenez-en davantage : https://bit.ly/CRA-vitals
reportWebVitals();