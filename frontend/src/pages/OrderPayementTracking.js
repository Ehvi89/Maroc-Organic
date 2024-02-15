// Importation des modules nécessaires
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from 'styled-components';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import { useAuth } from '../components/context/AuthContext';
import ConfirmPopup from "../components/ConfirmationPopup";
import { useFunctions } from "../components/context/SharedContext";
import PaginationControls from "../components/PaginationControls";

// Définition des animations keyframes pour rotation
const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`;

// Définition des composants styled
export const Loader = styled.div`
    padding:  10px;
    border:  6px solid #8FB570;
    border-bottom-color: transparent;
    border-radius:  22px;
    animation: ${rotate}  1s infinite linear;
    height:  0;
    width:  0;
    position: fixed;
    left:  50%;
    top:  50%;
    transform: translate(-50%, -50%);
`;

const Filter = styled.div`
    padding: 10px 15px;
    border-radius: 10px;
    margin: auto;
`

const Checkbox = styled.input.attrs({type: 'checkbox'})`
    margin: 10px;
`;

// Composant pour afficher les informations de paiement
function ShowInformations({ numeroCheque, methodePaiement, dateReceptionCheque, dateEcheanceCheque, dateDepotABanque, isEditing, id, paymentMethod }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const { authToken, user } = useAuth();
    const [localInformation, setLocalInformation] = useState({
        chequeNumber: numeroCheque,
        paymentMethod: methodePaiement,
        DateChequeReceived: dateReceptionCheque,
        chequeDueDate: dateEcheanceCheque,
        DateChequeDepositedAtBank: dateDepotABanque
    });
    const previousValues = useRef(localInformation); // Stockage des valeurs précédentes

    // Function to handle input changes
    const handleInputChange = (field, value) => {
        setLocalInformation(prevInfo => ({ ...prevInfo, [field]: value }));
    };

    // Function to update data on the server
    const updateDataOnServer = async (field, value) => {
        if (previousValues.current[field] !== value) {
            try {
                const updatedFields = { [field]: value };
                updatedFields.emailUser = user.email;

                const res = await fetch(`http://localhost:5000/api/order/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(updatedFields),
                });
                if (!res.ok) {
                    throw new Error('Failed to update data');
                }
                const jsonRes = await res.json();
                console.log(jsonRes);
                previousValues.current = { ...previousValues.current, [field]: value };
            } catch (error) {
                console.error('Error updating data:', error);
            }
        }
    };

    return (
        <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            {methodePaiement}
            {showTooltip && <div className="tooltip">
                {isEditing ? (
                    <div>
                        {paymentMethod === 'Chèque' ?
                            <div>
                                <input type='number' value={localInformation.chequeNumber}
                                       onChange={(e) => handleInputChange('chequeNumber', e.target.value)}
                                       onBlur={() => updateDataOnServer('chequeNumber', localInformation.chequeNumber)}/>
                                <input type='date' value={localInformation.DateChequeReceived}
                                       onChange={(e) => handleInputChange('DateChequeReceived', e.target.value)}
                                       onBlur={() => updateDataOnServer('DateChequeReceived', localInformation.DateChequeReceived)}/>
                                <input type='date' value={localInformation.chequeDueDate}
                                       onChange={(e) => handleInputChange('chequeDueDate', e.target.value)}
                                       onBlur={() => updateDataOnServer('chequeDueDate', localInformation.chequeDueDate)}/>
                                <input type='date' value={localInformation.DateChequeDepositedAtBank}
                                       onChange={(e) => handleInputChange('DateChequeDepositedAtBank', e.target.value)}
                                       onBlur={() => updateDataOnServer('DateChequeDepositedAtBank', localInformation.DateChequeDepositedAtBank)}/>
                            </div> :
                            <input type='date' value={localInformation.DateChequeReceived}
                                   onChange={(e) => handleInputChange('DateChequeReceived', e.target.value)}
                                   onBlur={() => updateDataOnServer('DateChequeReceived', localInformation.DateChequeReceived)}/>
                        }
                        <button>Enregistrer</button>
                    </div>
                ) : (
                    <div>
                        {numeroCheque && (<div>Numéro du chèque: {numeroCheque}</div>)}
                        {dateReceptionCheque && (
                            <div>Date de reception: {moment(dateReceptionCheque).format('DD/MM/YYYY')}</div>)}
                        {dateEcheanceCheque && (
                            <div>Date d'echeance: {moment(dateEcheanceCheque).format('DD/MM/YYYY')}</div>)}
                        {dateDepotABanque && (<div>Date de depot à la banque: {moment(dateDepotABanque).format('DD/MM/YYYY')}</div>)}
                    </div>
                )}
            </div>}
        </div>
    );
}

// Composant principal pour le suivi des paiements des commandes
function OrderPayementTracking() {
    const [isDataLoading, setDataLoading] = useState(false);
    const [surveyData, setSurveyData] = useState([]); // Initialisez avec un tableau vide
    const [pageNumber, setPageNumber] = useState(1); // État pour suivre la page actuelle
    const [totalPageNumber, setTotalPageNumber] = useState(1)
    const itemsPerPage = 10; // Nombre d'éléments par page
    // État pour contrôler l'affichage de la pop-up
    const {authToken} = useAuth();
    const {user} = useAuth();

    useEffect(() => {
        setDataLoading(true);
        fetch(`http://localhost:5000/api/order?page=${pageNumber}&limit=${itemsPerPage}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            }
        })
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
                setTotalPageNumber(apiResponse.totalPages)
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
                setDataLoading(false);
            });
    }, [pageNumber, authToken]); // Dépendance de l'effet sur pageNumber


    const uniqueVilles = [...new Set(surveyData.map(row => row.city))];
    const uniqueModesPaiement = [...new Set(surveyData.map(row => row.paymentMethod))];

    const [selectedVilles, setSelectedVilles] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const filteredData = surveyData.filter(row => selectedVilles.length === 0 || selectedVilles.includes(row.city))
        .filter(row => selectedPaymentMethod.length === 0 || selectedPaymentMethod.includes(row.paymentMethod));

    // État pour suivre si l'application est en mode édition
    const [isEditing, setIsEditing] = useState(false);
    // État pour suivre la cellule en cours d'édition
    const [editingCellId, setEditingCellId] = useState(null);

    // Fonction pour mettre à jour la valeur de la cellule en cours d'édition
    const updateCellValue = async (id, column, value) => {
        // Mettre à jour la valeur dans l'état local
        setSurveyData(prevData => prevData.map(row => row._id === id ? { ...row, [column]: value } : row));
        // Réinitialiser l'ID de la cellule en cours d'édition
        setEditingCellId(null);
        // Envoyer les données mises à jour à l'API
        try {
            const response = await fetch(`http://localhost:5000/api/order/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ [column]: value, userEmail: user.email }),
            });

            if (!response.ok) {
                // Gérer les erreurs HTTPS, par exemple en affichant un message d'erreur
                const errorData = await response.json();
                console.error('Error updating data:', errorData);
                // Ici, vous pouvez également mettre à jour l'état de l'interface utilisateur pour informer l'utilisateur de l'échec
            } else {
                // Gérer le succès de la mise à jour, par exemple en actualisant la liste des commandes
                console.log('Order updated successfully');
                // Rafraîchir la page après la mise à jour réussie si nécessaire
                // window.location.reload();
            }
        } catch (error) {
            console.error('Network error:', error);
            // Gérer les erreurs réseau, par exemple en informant l'utilisateur que la requête n'a pas pu être effectuée
        }
    };

    // Fonction pour basculer entre le mode normal et le mode édition
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    // Fonction pour démarrer l'édition d'une cellule
    const startEditingCell = (id) => {
        setEditingCellId(id);
    };
    const { handleMouseDown, handleMouseUp, handleConfirm, handleCancel, showPopup, export2excel } = useFunctions();

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
                                <div className={'filter'}>
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault(); // Empêche le comportement par défaut du lien
                                        setSelectedPaymentMethod([]);
                                        setSelectedVilles([]);
                                    }}>
                                        Effacer les filtres
                                    </Link>
                                    <div>
                                        <div className={"categorie"}>
                                            <p>Ville:</p>
                                            {uniqueVilles.map(ville => (
                                                <div key={ville}>
                                                    <label htmlFor={ville}>{ville}</label>
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
                                                    <label htmlFor={modePaiement}>{modePaiement}</label>
                                                    <Checkbox id={modePaiement} value={modePaiement}
                                                              checked={selectedPaymentMethod.includes(modePaiement)}
                                                              onChange={() => setSelectedPaymentMethod(prev => prev.includes(modePaiement) ? prev.filter(m => m !== modePaiement) : [...prev, modePaiement])}/>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Filter>

                        <button className="responsive-button" id={'btn'} style={{margin: "50px auto"}}>
                            <Link to={"/addOrder"}><FontAwesomeIcon icon={faPlus}/></Link>
                            <span><Link to={"/addOrder"}>Ajouter une commande</Link></span>
                        </button>
                    </div>

                    <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {user && (user.role === 'Administrateur' || user.role === 'Employé') &&
                            <button onClick={toggleEditMode} className={'editButton'}>
                                {isEditing ? 'Quitter' : 'Modifier'}
                            </button>
                        }

                        <button onClick={() => export2excel('order')} className={'editButton'}>
                            Exporter
                        </button>
                    </div>

                    <ConfirmPopup
                        show={showPopup}
                        title="Supprimer la ligne"
                        message="Êtes-vous sûr de vouloir supprimer cette ligne ?"
                        onConfirm={() => handleConfirm('order')}
                        onCancel={handleCancel}
                    />
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
                                <tr key={index} style={{backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2'}}
                                    onMouseDown={(event) => handleMouseDown(event, row._id)}
                                    onMouseUp={handleMouseUp}
                                    onClick={() => startEditingCell(row._id)}>
                                    <td className={'cellule'} onClick={() => startEditingCell(row._id)}>
                                        <div className={'contenu'}>
                                            {isEditing && editingCellId === row._id ? (
                                                <>
                                                    <input type={'date'}
                                                           defaultValue={moment(row.date).format('DD/MM/YYYY')}
                                                           onBlur={(e) => updateCellValue(row._id, 'date', e.target.value)}/>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPencilAlt} style={{position: 'absolute', right: '5%'}}/>
                                                    </div>
                                                </>
                                            ) : (
                                                <span>{moment(row.date).format('DD/MM/YYYY')}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {isEditing && editingCellId === row._id ? (
                                                <select defaultValue={row.client}
                                                        onBlur={(e) => updateCellValue(row._id, 'city', e.target.value)}
                                                        onClick={() => startEditingCell(row._id)}>
                                                    <option value="agadir">Agadir</option>
                                                    <option value="asilah">Asilah</option>
                                                    <option value="azrou">Azrou</option>
                                                    <option value="azilal">Azilal</option>
                                                    <option value="azemour">Azemour</option>
                                                    <option value="beniMellal">Beni Mellal</option>
                                                    <option value="berkane">Berkane</option>
                                                    <option value="benTaib">Ben Taib</option>
                                                    <option value="casablanca">Casablanca</option>
                                                    <option value="chefchaouen">Chefchaouen</option>
                                                    <option value="darOuldZidouh">Dar Ould Zidouh</option>
                                                    <option value="elJadida">El Jadida</option>
                                                    <option value="erRachidia">Er Rachidia</option>
                                                    <option value="essaouira">Essaouira</option>
                                                    <option value="figuig">Figuig</option>
                                                    <option value="fes">Fès</option>
                                                    <option value="guelmim">Guelmim</option>
                                                    <option value="alHoceima">Al Hoceima</option>
                                                    <option value="ifrane">Ifrane</option>
                                                    <option value="imouzer">Imouzer</option>
                                                    <option value="imzouren">Imzouren</option>
                                                    <option value="inzegen">Inzegen</option>
                                                    <option value="kenitra">Kenitra</option>
                                                    <option value="khemisset">Khemisset</option>
                                                    <option value="khenifra">Khenifra</option>
                                                    <option value="khouribga">Khouribga</option>
                                                    <option value="ksarElKebir">Ksar el Kebir</option>
                                                    <option value="larache">Larache</option>
                                                    <option value="marrakech">Marrakech</option>
                                                    <option value="meknes">Meknès</option>
                                                    <option value="mohammedia">Mohammedia</option>
                                                    <option value="nador">Nador</option>
                                                    <option value="ouarzazate">Ouarzazate</option>
                                                    <option value="ouezzane">Ouezzane</option>
                                                    <option value="oujda">Oujda</option>
                                                    <option value="rabat">Rabat</option>
                                                    <option value="safi">Safi</option>
                                                    <option value="salé">Salé</option>
                                                    <option value="sefrou">Sefrou</option>
                                                    <option value="settat">Settat</option>
                                                    <option value="tangier">Tangier</option>
                                                    <option value="tanTan">Tan Tan</option>
                                                    <option value="tarfaya">Tarfaya (Cabo Juby)</option>
                                                    <option value="taroudant">Taroudant</option>
                                                    <option value="taza">Taza</option>
                                                    <option value="tetouan">Tétouan</option>
                                                    <option value="tiznit">Tiznit</option>
                                                    <option value="zagora">Zagora</option>
                                                </select>
                                            ) : (
                                                <span>{row.client}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {isEditing && editingCellId === row._id ? (
                                                <select defaultValue={row.city}
                                                        onBlur={(e) => updateCellValue(row._id, 'city', e.target.value)}
                                                        onClick={() => startEditingCell(row._id)}>
                                                    <option value="Agadir">Agadir</option>
                                                    <option value="Asilah">Asilah</option>
                                                    <option value="Azrou">Azrou</option>
                                                    <option value="Azilal">Azilal</option>
                                                    <option value="Azemour">Azemour</option>
                                                    <option value="Beni Mellal">Beni Mellal</option>
                                                    <option value="Berkane">Berkane</option>
                                                    <option value="Ben Taib">Ben Taib</option>
                                                    <option value="Casablanca">Casablanca</option>
                                                    <option value="Chefchaouen">Chefchaouen</option>
                                                    <option value="Dar Ould Zidouh">Dar Ould Zidouh</option>
                                                    <option value="El Jadida">El Jadida</option>
                                                    <option value="Er Rachidia">Er Rachidia</option>
                                                    <option value="Essaouira">Essaouira</option>
                                                    <option value="Figuig">Figuig</option>
                                                    <option value="Fes">Fès</option>
                                                    <option value="Guelmim">Guelmim</option>
                                                    <option value="Al Hoceima">Al Hoceima</option>
                                                    <option value="Ifrane">Ifrane</option>
                                                    <option value="Imouzer">Imouzer</option>
                                                    <option value="Imzouren">Imzouren</option>
                                                    <option value="Inzegen">Inzegen</option>
                                                    <option value="Kenitra">Kenitra</option>
                                                    <option value="Khemisset">Khemisset</option>
                                                    <option value="Khenifra">Khenifra</option>
                                                    <option value="Khouribga">Khouribga</option>
                                                    <option value="Ksar ElKebir">Ksar el Kebir</option>
                                                    <option value="Larache">Larache</option>
                                                    <option value="Marrakech">Marrakech</option>
                                                    <option value="Meknes">Meknès</option>
                                                    <option value="Mohammedia">Mohammedia</option>
                                                    <option value="Nador">Nador</option>
                                                    <option value="Ouarzazate">Ouarzazate</option>
                                                    <option value="Ouezzane">Ouezzane</option>
                                                    <option value="Oujda">Oujda</option>
                                                    <option value="Rabat">Rabat</option>
                                                    <option value="Safi">Safi</option>
                                                    <option value="Salé">Salé</option>
                                                    <option value="Sefrou">Sefrou</option>
                                                    <option value="Settat">Settat</option>
                                                    <option value="Tangier">Tangier</option>
                                                    <option value="Tan Tan">Tan Tan</option>
                                                    <option value="Tarfaya">Tarfaya (Cabo Juby)</option>
                                                    <option value="Taroudant">Taroudant</option>
                                                    <option value="Taza">Taza</option>
                                                    <option value="Tetouan">Tétouan</option>
                                                    <option value="Tiznit">Tiznit</option>
                                                    <option value="Zagora">Zagora</option>
                                                </select>
                                            ) : (
                                                <span>{row.city}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {isEditing && editingCellId === row._id ? (
                                                <input type={'number'} defaultValue={row.amount}
                                                       onBlur={(e) => updateCellValue(row._id, 'amount', e.target.value)}
                                                       onClick={() => startEditingCell(row._id)}/>
                                            ) : (
                                                <span>{row.amount}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {isEditing && editingCellId === row._id ? (
                                                <select defaultValue={row.paymentConfirmation}
                                                        onBlur={(e) => updateCellValue(row._id, 'paymentConfirmation', e.target.value)}
                                                        onClick={() => startEditingCell(row._id)}>
                                                    <option value={false}>Non</option>
                                                    <option value={true}>Oui</option>
                                                </select>
                                            ) : (
                                                <span>{row.paymentConfirmation === false && 'Non'} {row.paymentConfirmation === true && 'Oui'}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>
                                            {row.paymentMethod === "Chèque" ?
                                                <ShowInformations numeroCheque={row.chequeNumber}
                                                                       methodePaiement={row.paymentMethod}
                                                                       dateReceptionCheque={row.DateChequeReceived}
                                                                       dateEcheanceCheque={row.chequeDueDate}
                                                                       dateDepotABanque={row.DateChequeDepositedAtBank}
                                                                       paymentMethod={row.paymentMethod}
                                                                       id={row._id}
                                                                       isEditing={isEditing}/> :
                                                <ShowInformations methodePaiement={row.paymentMethod}
                                                                       paymentMethod={row.paymentMethod}
                                                                       id={row._id}
                                                                       isEditing={isEditing}
                                                                       dateReceptionCheque={row.DateChequeReceived}/>
                                            }
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>{row.trackingNumber}</div>
                                    </td>
                                    <td>
                                        <div className={"cellule"}>{row.billNumber}</div>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {isEditing && editingCellId === row._id ? (
                                                <textarea defaultValue={row.paymentTerms}
                                                          onBlur={(e) => updateCellValue(row._id, 'paymentTerms', e.target.value)}
                                                          onClick={() => startEditingCell(row._id)}/>
                                            ) : (
                                                <span>{row.paymentTerms}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {isEditing && editingCellId === row._id ? (
                                                <select defaultValue={row.receptionConfirmation}
                                                        onBlur={(e) => updateCellValue(row._id, 'receptionConfirmation', e.target.value)}
                                                        onClick={() => startEditingCell(row._id)}>
                                                    <option value={false}>Non</option>
                                                    <option value={true}>Oui</option>
                                                </select>
                                            ) : (
                                                <span>{row.receptionConfirmation === false && 'Non'} {row.receptionConfirmation === true && 'Oui'}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {isEditing && editingCellId === row._id ? (
                                                <input type={'text'} defaultValue={row.numberPackagesAndDisplays}
                                                       onBlur={(e) => updateCellValue(row._id, 'numberPackagesAndDisplays', e.target.value)}
                                                       onClick={() => startEditingCell(row._id)}/>
                                            ) : (
                                                <span>{row.numberPackagesAndDisplays}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {isEditing && editingCellId === row._id ? (
                                                <textarea defaultValue={row.comment}
                                                          onBlur={(e) => updateCellValue(row._id, 'comment', e.target.value)}
                                                          onClick={() => startEditingCell(row._id)}/>
                                            ) : (
                                                <span>{row.comment}</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <PaginationControls currentPage={pageNumber} totalPages={totalPageNumber} selectPage={setPageNumber}/>
                </div>
            )}
        </div>
    )
}

// Exportation du composant OrderPayementTracking
export default OrderPayementTracking;
