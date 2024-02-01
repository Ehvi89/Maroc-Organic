// Import necessary modules
import {useEffect, useState} from "react";
import styled, { keyframes } from 'styled-components'
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

// Define keyframes for rotation
const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`

// Define styled components
export const Loader = styled.div`
    padding: 10px;
    border: 6px solid #8FB570;
    border-bottom-color: transparent;
    border-radius: 22px;
    animation: ${rotate} 1s infinite linear;
    height: 0;
    width: 0;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`

const Filter = styled.div`
    padding: 10px 15px;
    border-radius: 10px;
    margin: auto;
`

const Checkbox = styled.input.attrs({type: 'checkbox'})`
    margin: 10px;
`;

// Data array
const data = [
    {
        "date": "27/01/2022",
        "nom": "HERBORISTERIE PRINCIPALE",
        "ville": "Casablanca",
        "montant": "3 891,00",
        "modePaiement": "N 596034",
        "Paiement": "OUI",
        "#SuiviLogiphar": "1142258",
        "#Facture": "FAC-73",
        "PayementTerms": "",
        "ConfimReception": "OUI",
        "#Colis+Presentoire": "1 presentoir",
        "Commentaire": "Presentoire donné"
    },
    {
        "date": "31/03/2022",
        "nom": "GATOBEN",
        "ville": "Marackesh",
        "montant": "686,00",
        "modePaiement": "N 5660354",
        "Paiement": "OUI",
        "#SuiviLogiphar": "1142318",
        "#Facture": "FAC-112",
        "PayementTerms": "",
        "ConfimReception": "OUI",
        "#Colis+Presentoire": "3 presentoir",
        "Commentaire": "Presentoire donné"
    },
    {
        "date": "15/02/2022",
        "nom": "GO PRO",
        "ville": "Casablanca",
        "montant": "3 891,00",
        "modePaiement": "Cheque",
        "dateRecptionCheque": "24/02/2022",
        "dateEcheanceCheque": "27/04/2022",
        "dateDepotABanque": "25/02/2022",
        "Paiement": "OUI",
        "#SuiviLogiphar": "1142269",
        "#Facture": "FAC-73",
        "PayementTerms": "Paiement cheque avec echeance 31 jours",
        "ConfimReception": "OUI",
        "#Colis+Presentoire": "2 colis",
        "Commentaire": "Cheque reçu le même jour de la livraison"
    },
];

// Component to show check information
function ShowCheckInformations({ dateReceptionCheque, dateEcheanceCheque, dateDepotABanque }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} >
            Chèque
            {showTooltip && <div className="tooltip">
                <div>
                    Date de reception: {dateReceptionCheque}
                </div>
                <div>
                    Date d'echeance: {dateEcheanceCheque}
                </div>
                <div>
                    Date de depot à la banque: {dateDepotABanque}
                </div>
            </div>}
        </div>
    );
}

// Main component
function OrderPayementTracking(){
    const [isDataLoading, setDataLoading] = useState(false)
    const [surveyData, setSurveyData] = useState({})

    // Uncomment the following block to fetch data from server
    /*useEffect(() => {
        setDataLoading(true)
        fetch(`http://localhost:8000/survey`)
            .then((response) => response.json())
            .then(({ surveyData }) => {
                setSurveyData(surveyData)
                setDataLoading(false)
            })
    }, [])*/

    const uniqueVilles = [...new Set(data.map(row => row.ville))];
    const uniqueModesPaiement = [...new Set(data.map(row => row.modePaiement))];

    const [selectedVilles, setSelectedVilles] = useState([]);
    const [selectedModesPaiement, setSelectedModesPaiement] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const filteredData = data.filter(row => selectedVilles.length === 0 || selectedVilles.includes(row.ville))
        .filter(row => selectedModesPaiement.length === 0 || selectedModesPaiement.includes(row.modePaiement));

    const sortedData = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

    return(
        <div>
            {isDataLoading ? (
                <Loader />
            ) : (
                <div>
                    <div style={{display:"flex", justifyContent:'space-between', alignItems:'top'}}>
                        <Filter className={"orderPayementFilter"}>
                            <button onClick={() => setShowFilters(!showFilters)}>Filtres</button>
                            {showFilters && (
                                <button style={{background: '#E73541'}} onClick={() => {
                                    setSelectedModesPaiement([]);
                                    setSelectedVilles([]);
                                }}>Effacer</button>

                            )}
                            {showFilters && (
                                <div>
                                    <div className={"categorie"}>
                                        <p>Ville:</p>
                                        {uniqueVilles.map(ville => (
                                            <div key={ville}>
                                                <label for={ville}>{ville}</label>
                                                <Checkbox id={ville} value={ville}
                                                          checked={selectedVilles.includes(ville)}
                                                          onChange={() => setSelectedVilles(prev => prev.includes(ville) ? prev.filter(v => v !== ville) : [...prev, ville])}/>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={"categorie"}>
                                        <p>Mode de paiement:</p>
                                        {uniqueModesPaiement.map(modePaiement => (
                                            <div key={modePaiement}>
                                                <label for={modePaiement}>{modePaiement}</label>
                                                <Checkbox id={modePaiement} value={modePaiement}
                                                          checked={selectedModesPaiement.includes(modePaiement)}
                                                          onChange={() => setSelectedModesPaiement(prev => prev.includes(modePaiement) ? prev.filter(m => m !== modePaiement) : [...prev, modePaiement])}/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Filter>
                        <button className="responsive-button" id={'btn'} style={{margin: "50px auto"}}>
                            <Link to={"/addOrder"}><FontAwesomeIcon icon={faPlus}/></Link>
                            <span><Link to={"/addOrder"}>Ajouter une commande</Link></span>
                            </button>
                            </div>

                            <div className={"conteneurTable"}>
                            <table>
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Client</th>
                                    <th>Ville</th>
                                    <th>Montant</th>
                                    <th>Paiement</th>
                                    <th>Mode de paiement</th>
                                    <th># de suivi - Logiphar</th>
                                    <th>Numéro de facture</th>
                                    <th>Termes du paiement</th>
                                    <th>Réception de la commande</th>
                                    <th># de colis + présentoir de la commande</th>
                                    <th>Commentaire</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sortedData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.date}</td>
                                        <td>
                                            <div className={"cellule"}>{row.nom}</div>
                                        </td>
                                        <td>
                                            <div className={"cellule"}>{row.ville}</div>
                                        </td>
                                        <td>
                                            <div className={"cellule"}>{row.montant}</div>
                                        </td>
                                        <td>
                                            <div className={"cellule"}>{row.Paiement}</div>
                                        </td>
                                        <td>
                                            <div className={"cellule"}>
                                                {row.modePaiement === "Cheque" ?
                                                    <ShowCheckInformations dateReceptionCheque={row.dateRecptionCheque}
                                                                           dateEcheanceCheque={row.dateEcheanceCheque}
                                                                           dateDepotABanque={row.dateDepotABanque}/> : row.modePaiement}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={"cellule"}>{row["#SuiviLogiphar"]}</div>
                                        </td>
                                        <td>
                                            <div className={"cellule"}>{row["#Facture"]}</div>
                                        </td>
                                        <td>
                                            <div className={"cellule"}>{row.PayementTerms}</div>
                                        </td>
                                        <td>
                                            <div className={"cellule"}>{row.ConfimReception}</div>
                                        </td>
                                        <td>
                                            <div className={"cellule"}>{row["#Colis+Presentoire"]}</div>
                                        </td>
                                        <td>
                                            <div className={"cellule"}>{row.Commentaire}</div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                    </div>
                </div>
            )}
                </div>
                )
            }

            // Export OrderPayementTracking component
            export default OrderPayementTracking;
