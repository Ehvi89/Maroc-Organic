import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPencilAlt, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import { Loader } from "./PlanningVisites";
import { useAuth } from '../components/AuthContext';
import ConfirmPopup from "../components/ConfirmationPopup";
import moment from "moment";
import {useFunctions} from "../components/SharedContext";
import PaginationControls from "../components/PaginationControls";

// Define styled components
const Checkbox = styled.input.attrs({ type: 'checkbox' })`
    margin: 10px;
`;
const Filter = styled.div`
    padding: 10px 15px;
    border-radius: 10px;
    margin: auto;
`;

function ShowCatalogueInformations({ id, catalogue, isEditable }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [localCatalogue, setLocalCatalogue] = useState(catalogue);
    const inputRefs = useRef([]); // Tableau de références pour les inputs
    const { authToken, user } = useAuth();

    // Fonction pour gérer les changements de valeur des champs
    const handleInputChange = (index, field, value) => {
        const updatedCatalogue = [...localCatalogue];
        if (index === -1) { // Nouvel élément ajouté
            const newItem = {
                name: '',
                sentDate: '',
                sentBy: ''
            };
            newItem[field] = value;
            updatedCatalogue.push(newItem);
        } else {
            updatedCatalogue[index][field] = value;
        }
        setLocalCatalogue(updatedCatalogue);
    };

    // Fonction pour mettre à jour les données sur le serveur
    const updateDataOnServer = async (updatedCatalogue) => {
        try {
            // Créez un nouvel objet contenant uniquement les données nécessaires pour la mise à jour
            const dataToSend = {
                catalogue: updatedCatalogue.map(item => ({
                    name: item.name,
                    sentDate: item.sentDate,
                    sentBy: item.sentBy
                })),
                userEmail: user.email
            };

            await fetch(`http://localhost:5000/api/client/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(dataToSend),
            });
            // Gérer la réponse de l'API si nécessaire
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    // Fonction pour supprimer un catalogue
    const deleteCatalogue = async (index) => {
        const updatedCatalogue = [...localCatalogue];
        updatedCatalogue.splice(index,   1);
        setLocalCatalogue(updatedCatalogue);
        // Mettre à jour les données sur le serveur après la suppression locale
        await updateDataOnServer(updatedCatalogue);
    };


    return (
        <div style={{width:'100%', alignItems:'center'}}>
            {localCatalogue.map((item, index) => (
                <div key={index} className={"clientShowToolTip"} onMouseEnter={() => setShowTooltip(true)}
                     onMouseLeave={() => {
                         setShowTooltip(false);
                     }}>
                    {showTooltip && isEditable?
                        (<div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                            {item.name}
                            <button style={{
                                padding: '5px',
                                background: 'none',
                                color: '#E73541',
                                border:'1px solid',
                                borderRadius: '10px'
                            }} onClick={async () => {
                                await deleteCatalogue(index)
                                updateDataOnServer();
                            }}><FontAwesomeIcon icon={faTrash}/>
                            </button>
                        </div>) : item.name
                    }
                    {showTooltip && <div className="tooltips">
                        {isEditable ? (
                            <>
                                <select ref={ref => inputRefs.current[index * 3] = ref} value={item.name || ''}
                                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                        onBlur={() => updateDataOnServer([...localCatalogue])}>
                                    <option value={"Dragon"}>Dragon</option>
                                    <option value={"Emblica-je suis bio"}>Emblica-je suis bio</option>
                                    <option value={"Cailleau"}>Cailleau</option>
                                    <option value={"Terre de couleur"}>Terre de couleur</option>
                                </select>
                                <select ref={ref => inputRefs.current[index * 3 + 1] = ref} value={item.sentBy || ''}
                                        onChange={(e) => handleInputChange(index, 'sentBy', e.target.value)}
                                        onBlur={() => updateDataOnServer([...localCatalogue])}>
                                    <option value={"Pas envoyé"}>Pas envoyé</option>
                                    <option value={"Whatsapp"}>Whatsapp</option>
                                    <option value={"E-mail"}>E-mail</option>
                                    <option value={"Autre"}>Autre</option>
                                </select>
                                <input ref={ref => inputRefs.current[index * 3 + 2] = ref} type="date"
                                       value={item.sentDate || ''}
                                       onChange={(e) => handleInputChange(index, 'sentDate', e.target.value)}
                                       onBlur={() => updateDataOnServer([...localCatalogue])}/>
                            </>
                        ) : (
                            <>
                                {item.sentBy && <div>Envoyé via: {item.sentBy}</div>}
                                {item.sentDate && <div>Envoyé le: {moment(item.sentDate).format('DD/MM/YYYY')}</div>}
                            </>
                            )}
                    </div>}

                </div>
            ))}
            {/* Bouton pour ajouter un nouvel élément */}
            {isEditable && (
                <button
                    style={{padding: '5px', color: '#8FB570', margin: '0   50%', borderRadius: '10px'}}
                    onClick={async () => {
                        // Ajoutez un nouveau catalogue avec un nom initialisé à 'Dragon'
                        const updatedCatalogue = [...localCatalogue];
                        const newItem = {name: 'Dragon', sentDate: '', sentBy: ''}; // Initialisez tous les champs avec des valeurs par défaut
                        updatedCatalogue.push(newItem);
                        setLocalCatalogue(updatedCatalogue);
                        // Mettre à jour les données sur le serveur après l'ajout local
                        await updateDataOnServer(updatedCatalogue);
                    }}
                >
                    <FontAwesomeIcon icon={faPlus}/>
                </button>


            )}
        </div>
    );
}

// Component to show contact informations
function ShowContactInformations({id, contact, isEditable}) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [localContact, setLocalContact] = useState(contact);
    const inputRefs = useRef([null, null, null, null]); // Tableau de références pour les inputs
    const {authToken, user} = useAuth();

    // Fonction pour gérer les changements de valeur des champs
    const handleInputChange = (field, value) => {
        setLocalContact({...localContact, [field]: value});
    };

    // Fonction pour mettre à jour les données sur le serveur
    const updateDataOnServer = async (field, value) => {
        try {
            // Préparez l'objet contenant toutes les données à mettre à jour
            const contactToUpdate = {...localContact, [field]: value};
            const res = await fetch(`http://localhost:5000/api/client/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({contact: contactToUpdate, userEmail: user.email}),
            });
            console.log(res.json())
            // Gérer la réponse de l'API si nécessaire
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    // Fonction pour perdre le focus de l'input
    const blurInput = (index) => {
        if (inputRefs.current[index]) {
            inputRefs.current[index].blur();
        }
    };
    return (
        <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => { setShowTooltip(false); blurInput(0); blurInput(1); blurInput(2); }}>
            {contact.fixe !== '' || contact.name !== '' || contact.whatsapp !== '' || contact.role ? (
                <p>Contact</p>
            ) : (isEditable &&
                <p>Contact</p>
            )}
            {showTooltip && <div className="tooltips">
                {isEditable ? (
                    <>
                        <input ref={ref => inputRefs.current[0] = ref} type="tel" placeholder="Fixe"
                               value={localContact.fixe} onChange={(e) => handleInputChange('fixe', e.target.value)}
                               onBlur={() => updateDataOnServer('fixe', localContact.fixe)}/>
                        <input ref={ref => inputRefs.current[1] = ref} type="tel" placeholder="Whatsapp"
                               value={localContact.whatsapp}
                               onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                               onBlur={() => updateDataOnServer('whatsapp', localContact.whatsapp)}/>
                        <input ref={ref => inputRefs.current[2] = ref} type="text" placeholder="Nom"
                               value={localContact.name} onChange={(e) => handleInputChange('name', e.target.value)}
                               onBlur={() => updateDataOnServer('name', localContact.name)}/>
                        <input ref={ref => inputRefs.current[3] = ref} type="text" placeholder="Fonction"
                               value={localContact.role} onChange={(e) => handleInputChange('role', e.target.value)}
                               onBlur={() => updateDataOnServer('name', localContact.role)}/>
                    </>
                ) : (
                    <>
                        {contact.fixe !== "" && (<div>Fixe: {contact.fixe}</div>)}
                        {contact.whatsapp !== "" && (<div>Whatsapp: {contact.whatsapp}</div>)}
                        {contact.name !== "" && (<div>Nom: {contact.name}</div>)}
                        {contact.role && (<div>Fonction: {contact.role}</div>)}
                    </>
                )}
            </div>}
        </div>
    );
}


// Main component
function Clients() {
    const [isDataLoading, setDataLoading] = useState(false);
    const [surveyData, setSurveyData] = useState([]); // Initialize with an empty array
    const [pageNumber, setPageNumber] = useState(1); // State to track the current page
    const [totalPageNumber, setTotalPageNumber] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const itemsPerPage = 10; // Number of items per page
    const [showFilters, setShowFilters] = useState(false);
    const { authToken } = useAuth();
    const { user } =useAuth();


    useEffect(() => {
        setDataLoading(true);
        fetch(`http://localhost:5000/api/client?page=${pageNumber}&limit=${itemsPerPage}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((apiResponse) => {
                // Extract data from the API
                const data = apiResponse.docs;
                // Concatenate new data with existing data
                setSurveyData(prevData => [...data]);
                setDataLoading(false);
                setTotalPageNumber(apiResponse.totalPages);

                setHasNextPage(apiResponse.hasNextPage);
                setHasPrevPage(apiResponse.hasPrevPage);
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
                setDataLoading(false);
            });
    }, [pageNumber]); // Dependency of the effect on pageNumber

    // Logic to load more data (for example, when a "Load More" button is clicked)
    const loadMoreData = () => {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
    };

    const loadLessData = () => {
        setPageNumber(prevPageNumber => prevPageNumber - 1);
    }

    const handleFirst = () => {
        setPageNumber(1);
    };

    const handleLast = () => {
        setPageNumber(totalPageNumber);
    };

    const uniqueVilles = [...new Set(surveyData.map(row => row.city))];
    const uniqueCategories = [...new Set(surveyData.map(row => row.category))];

    const [selectedVilles, setSelectedVilles] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const filteredData = surveyData.filter(row => selectedVilles.length === 0 || selectedVilles.includes(row.city))
        .filter(row => selectedCategories.length === 0 || selectedCategories.includes(row.category));


    // État pour suivre si l'application est en mode édition
    const [isEditing, setIsEditing] = useState(false);
    // État pour suivre la cellule en cours d'édition
    const [editingCellId, setEditingCellId] = useState(null);

    // Fonction pour mettre à jour la valeur de la cellule en cours d'édition
    const updateCellValue = async (id, column, value) => {
        // Mettez à jour la valeur dans votre état local
        setSurveyData(prevData => prevData.map(row => row._id === id ? { ...row, [column]: value } : row));
        // Réinitialiser l'ID de la cellule en cours d'édition
        setEditingCellId(null);
        // Envoyer les données mises à jour à l'API
        try {
            await fetch(`http://localhost:5000/api/client/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ [column]: value, userEmail: user.email }),
            });
            // Gérer la réponse de l'API si nécessaire
        } catch (error) {
            console.error('Error updating data:', error);
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


    return (
        <div>
            {isDataLoading ? (
                <Loader />
            ) : (
                <div>
                    <div style={{display: "flex", alignItems: 'center', margin: "auto"}}>
                        <Filter className={"orderPayementFilter"}>
                            <button onClick={() => setShowFilters(!showFilters)}>Filtres</button>
                            {showFilters &&
                                <div className={'filter'}>
                                    <Link onClick={() => {
                                        setSelectedVilles([]);
                                        setSelectedCategories([]);
                                    }}>
                                        Effacer les filtres
                                    </Link>
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
                                        <p>Catégorie:</p>
                                        {uniqueCategories.map(categorie => (
                                            <div key={categorie}>
                                                <label htmlFor={categorie}>{categorie}</label>
                                                <Checkbox id={categorie} value={categorie}
                                                          checked={selectedCategories.includes(categorie)}
                                                          onChange={() => setSelectedCategories(prev => prev.includes(categorie) ? prev.filter(m => m !== categorie) : [...prev, categorie])}/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                        </Filter>

                        <button className="responsive-button" id={'btn'} style={{margin: "50px auto"}}>
                            <Link to={"/addClients"}><FontAwesomeIcon icon={faPlus}/></Link>
                            <span><Link to={"/addClients"}>Ajouter un client</Link></span>
                        </button>
                    </div>

                    <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {user && (user.role === 'Administrateur' || user.role === 'Employé') &&
                            <button onClick={toggleEditMode} className={'editButton'}>
                                {isEditing ? 'Quitter' : 'Modifier'}
                            </button>
                        }

                        <button onClick={() => export2excel('client')} className={'editButton'}>
                            Exporter
                        </button>
                    </div>

                    <ConfirmPopup
                        show={showPopup}
                        title="Supprimer la ligne"
                        message="Êtes-vous sûr de vouloir supprimer cette ligne ?"
                        onConfirm={() => handleConfirm('client')}
                        onCancel={handleCancel}
                    />

                    <div className={"conteneurTable"}>
                        <table>
                            <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Catégorie</th>
                                <th>Ville</th>
                                <th>Client</th>
                                <th>Catalogue</th>
                                <th>Contact</th>
                                <th>Adress</th>
                                <th>Commentaire</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredData.map((row, index) => (
                                <tr key={index} style={{backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2'}}
                                    onMouseDown={(event) => handleMouseDown(event, row._id)}
                                    onMouseUp={handleMouseUp}>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {isEditing && editingCellId === row._id ? (
                                                <input type="text" defaultValue={row.client}
                                                       onBlur={(e) => updateCellValue(row._id, 'client', e.target.value)}/>
                                            ) : (
                                                <span>{row.client}</span>
                                            )}
                                            {isEditing && editingCellId !== row._id && (
                                                <button onClick={() => startEditingCell(row._id)}>
                                                    <FontAwesomeIcon icon={faPencilAlt}/>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {row.category}
                                            {isEditing && editingCellId === row._id ? (
                                                <select defaultValue={row.category}
                                                        onChange={(e) => updateCellValue(row._id, 'category', e.target.value)}
                                                        onBlur={() => setEditingCellId(null)}>
                                                    <option value="Pharmacie">Pharmacie</option>
                                                    <option value="Parapharmacie">Parapharmacie</option>
                                                    <option value="Épicerie fine">Épicerie fine</option>
                                                </select>
                                            ) : null}
                                            {isEditing && editingCellId !== row._id && (
                                                <button onClick={() => startEditingCell(row._id)}>
                                                    <FontAwesomeIcon icon={faPencilAlt}/>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {row.city}
                                            {isEditing && editingCellId === row._id ? (
                                                <select defaultValue={row.city}
                                                        onChange={(e) => updateCellValue(row._id, 'city', e.target.value)}
                                                        onBlur={() => setEditingCellId(null)}>
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
                                            ) : null}
                                            {isEditing && editingCellId !== row._id && (
                                                <button onClick={() => startEditingCell(row._id)}>
                                                    <FontAwesomeIcon icon={faPencilAlt}/>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {row.type}
                                            {isEditing && editingCellId === row._id ? (
                                                <select defaultValue={row.type}
                                                        onChange={(e) => updateCellValue(row._id, 'type', e.target.value)}
                                                        onBlur={() => setEditingCellId(null)}>
                                                    <option value={"aucun"}>Non définit</option>
                                                    <option value={"Dragon"}>Dragon</option>
                                                    <option value={"Terre de couleur"}>Terre de couleur</option>
                                                </select>
                                            ) : null}
                                            {isEditing && editingCellId !== row._id && (
                                                <button onClick={() => startEditingCell(row._id)}>
                                                    <FontAwesomeIcon icon={faPencilAlt}/>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className={'cellule'}>
                                        <ShowCatalogueInformations id={row._id} catalogue={row.catalogue}
                                                                   isEditable={isEditing} style={{width: '100%'}}/>
                                    </td>
                                    <td className={'cellule'}>
                                        <ShowContactInformations id={row._id} contact={row.contact}
                                                                 isEditable={isEditing}/>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {row.contact.address}
                                            {isEditing && editingCellId === row._id ? (
                                                <input type="text" defaultValue={row.contact.address}
                                                       onBlur={(e) => updateCellValue(row._id, 'contact.email', e.target.value)}/>
                                            ) : null}
                                            {isEditing && editingCellId !== row._id && (
                                                <button onClick={() => startEditingCell(row._id)}>
                                                    <FontAwesomeIcon icon={faPencilAlt}/>
                                                </button>)}
                                        </div>
                                    </td>
                                    <td className={'cellule'}>
                                        <div className={'contenu'}>
                                            {isEditing && editingCellId === row._id ? (
                                                <textarea defaultValue={row.comment}
                                                          onBlur={(e) => updateCellValue(row._id, 'comment', e.target.value)}/>
                                            ) : (
                                                <span>{row.comment}</span>
                                            )}
                                            {isEditing && editingCellId !== row._id && (
                                                <button onClick={() => startEditingCell(row._id)}>
                                                    <FontAwesomeIcon icon={faPencilAlt}/>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <PaginationControls currentPage={pageNumber} totalPages={totalPageNumber} onNext={loadMoreData} onPrevious={loadLessData}/>

                </div>
            )}
        </div>
    );
}

export default Clients;