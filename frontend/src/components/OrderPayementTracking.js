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

// Component to show check information
function ShowCheckInformations({ numeroCheque, dateReceptionCheque, dateEcheanceCheque, dateDepotABanque }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} >
            Chèque
            {showTooltip && <div className="tooltip">
                <div>
                    Numéro du chèque: {numeroCheque}
                </div>
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
    const [isDataLoading, setDataLoading] = useState(false);
    const [surveyData, setSurveyData] = useState([]); // Initialisez avec un tableau vide
    const [pageNumber, setPageNumber] = useState(1); // État pour suivre la page actuelle
    const itemsPerPage = 10; // Nombre d'éléments par page

    useEffect(() => {
        setDataLoading(true);
        fetch(`http://localhost:5000/api/order?page=${pageNumber}&limit=${itemsPerPage}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((apiResponse) => {
                // Extraire les données de l'API
                const data = apiResponse.docs;
                // Concaténez les nouvelles données avec celles existantes
                setSurveyData(prevData => [...data]);
                setDataLoading(false);
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
                setDataLoading(false);
            });
    }, [pageNumber]); // Dépendance de l'effet sur pageNumber

    // Logique pour charger plus de données (par exemple, lorsqu'un bouton "Load More" est cliqué)
    const loadMoreData = () => {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
    };
    const loadLessData = () => {
        setPageNumber(prevPageNumber => prevPageNumber - 1);
    }

    console.log(surveyData)

    const uniqueVilles = [...new Set(surveyData.map(row => row.city))];
    const uniqueModesPaiement = [...new Set(surveyData.map(row => row.paymentMethod))];

    const [selectedVilles, setSelectedVilles] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const filteredData = surveyData.filter(row => selectedVilles.length === 0 || selectedVilles.includes(row.city))
        .filter(row => selectedPaymentMethod.length === 0 || selectedPaymentMethod.includes(row.paymentMethod));

    return(
        <div>
            {isDataLoading ? (
                <Loader />
            ) : (
                <div>
                    <div style={{display: "flex", justifyContent: 'space-between', alignItems: 'top'}}>
                        <Filter className={"orderPayementFilter"}>
                            <button onClick={() => setShowFilters(!showFilters)}>Filtres</button>
                            {showFilters && (
                                <button style={{background: '#E73541'}} onClick={() => {
                                    setSelectedPaymentMethod([]);
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
                                                          checked={selectedPaymentMethod.includes(modePaiement)}
                                                          onChange={() => setSelectedPaymentMethod(prev => prev.includes(modePaiement) ? prev.filter(m => m !== modePaiement) : [...prev, modePaiement])}/>
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
                            {filteredData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.date}</td>
                                    <td>
                                        <div className={"cellule"}>{row.client}</div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>{row.city}</div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>{row.amount}</div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>{row.paymentConfirmation}</div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>
                                            {row.paymentMethod === "cheque" ?
                                                <ShowCheckInformations numeroCheque={row.chequeNumber}
                                                                       dateReceptionCheque={row.DateChequeReceived}
                                                                       dateEcheanceCheque={row.chequeDueDate}
                                                                       dateDepotABanque={row.DateChequeDepositedAtBank}/> : row.paymentMethod}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>{row.trackingNumber}</div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>{row.billNumber}</div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>{row.paymentTerms}</div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>{row.ConfimReception}</div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>{row.numberPackagesAndDisplays}</div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>{row.comment}</div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={loadLessData}>prev</button>
                    <button onClick={loadMoreData}>next</button>
                </div>
            )}
        </div>
    )
}

// Export OrderPayementTracking component
            export default OrderPayementTracking;
