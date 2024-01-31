import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

//Importations des styles
import './styles/index.css';
import './styles/header.css'
import './styles/Form.css'
import './styles/banner.css'

//Importation des pages
import Header from "./components/Header";
import AddReport from "./components/AddReport";
import Home from "./components/Home";
import ProgramPlanning from "./components/ProgramPlanning";
import PlanningVisites from "./components/PlanningVisites";
import Error from "./components/Error";
import Clients from "./components/Clients";
import OrderPayementTracking from "./components/OrderPayementTracking";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Router>
          <Header/>
          <Routes>
              <Route path={"/"} element={<Home/>}/>
              <Route path={"addReport"} element={<AddReport/>}/>
              <Route path={"programPlanning"} element={<ProgramPlanning/>}/>
              <Route path={"planningVisits"} element={<PlanningVisites/>}/>
              <Route path={"clients"} element={<Clients/>}/>
              <Route path={"orderPayementTracking"} element={<OrderPayementTracking/>}/>
              <Route path="*" element={<Error/>} />
          </Routes>
      </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
