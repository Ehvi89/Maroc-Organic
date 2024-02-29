// Importation des modules nécessaires
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from '../components/context/AuthContext';
import { useFunctions } from "../components/context/SharedContext";

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

const Filter = styled.select`
    padding: 10px 15px;
    border-radius: 10px;
    margin: 50px auto 25px;
    right: 0 !important;
`
const Row = styled.div`
    display: flex;
    margin: auto;
`;

const Elmt = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 5px;
    border-radius: 10px;
    margin: auto;
`;

// Composant pour afficher les détails d'un rapport individuel
function ShowReport({ report, user }) {
    const [localReport, setLocalReport] = useState(report);
    const [showTooltip, setShowTooltip] = useState(false);
    const { authToken } = useAuth();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLocalReport({ ...localReport, [name]: value });
    };
    const handleLineChange = (index, event) => {
        const newLines = [...lines];
        newLines[index].name = event.target.value;
        setLines(newLines);
    };
    const updateDataOnServer = async () => {
        try {
            // Mettre à jour localReport avec les nouvelles marques concurrentes
            const updatedReport = {
                ...localReport,
                competingBrands: lines.map(line => ({ name: line.name })),
            };
            updatedReport.userEmail = user.email;

            await fetch(`http://localhost:5000/api/report/${report._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(updatedReport),
            });
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const deleteRow = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/report/${report._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({userEmail: user.email})
            });

            if (!response.ok) {
                // Gérer les erreurs HTTPS, par exemple en affichant un message d'erreur
                const errorData = await response.json();
                console.error('Error deleting data:', errorData);
                // Ici, vous pouvez également mettre à jour l'état de l'interface utilisateur pour informer l'utilisateur de l'échec
            } else {
                // Gérer le succès de la suppression, par exemple en actualisant la liste des rapports
                console.log('Report deleted successfully');
                // Rafraîchir la page après la suppression réussie
                window.location.reload();
            }
        } catch (error) {
            console.error('Network error:', error);
            // Gérer les erreurs réseau, par exemple en informant l'utilisateur que la requête n'a pas pu être effectuée
        }
    };


    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSelectedCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };
    // État pour stocker les lignes
    const [lines, setLines] = useState([]);

    // Fonction pour ajouter une nouvelle ligne
    const addCompetingBrands = () => {
        setLines([...lines, {
            name: ''
        }]);
    };

    // Nouvel état pour contrôler l'affichage du popup
    const [showModal, setShowModal] = useState(false);

    // Fonction pour ouvrir le popup
    const openModal = () => {
        setShowModal(true);
    };

    // Fonction pour fermer le popup
    const closeModal = () => {
        setShowModal(false);
    };


    return (
        <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            {report.author.email === user.email && showTooltip ?
                (<div style={{display: "flex", justifyContent:'space-between', alignItems:'center', fontWeight: 'bold'}}>
                    {`${report.author.name}`.toUpperCase()}
                    <div className={'options'}>
                        <button onClick={openModal}><FontAwesomeIcon icon={faPencil}/></button>
                        <button onClick={deleteRow} value={'trash'}><FontAwesomeIcon icon={faTrash}/></button>
                    </div>
                </div>):
                (
                    <div style={{fontWeight: 'bold', textAlign:'center'}}>
                        {`${report.author.name}`.toUpperCase()}
                    </div>
                )
            }
            {showTooltip && (
                <section className="report-section">
                    {report.client && (
                        <div className="report-item">
                            <label>Client:</label>
                            <p>{report.client}</p>
                        </div>
                    )}
                    {report.type && (
                        <div className="report-item">
                            <label>Type:</label>
                            <p>{report.type}</p>
                        </div>
                    )}
                    {report.city && (
                        <div className="report-item">
                            <label>Ville:</label>
                            <p>{report.city}</p>
                        </div>
                    )}
                    <div style={{display:'flex', justifyContent:'center', width:'105%'}}>
                        {report.hour && (
                            <div className="report-item">
                                <label>Heure:</label>
                                <p>{report.hour}</p>
                            </div>
                        )}
                        {report.duration && (
                            <div className="report-item">
                                <label>Durée:</label>
                                <p>{report.duration} min</p>
                            </div>
                        )}
                    </div>
                    {report.person && (
                        <div className="report-item">
                            <label>Personne rencontrée:</label>
                            <p>{report.person}</p>
                        </div>
                    )}
                    {report.contact.name && (
                        <div className="report-item">
                            <label>Nom contact:</label>
                            <p>{report.contact.name}</p>
                        </div>
                    )}
                    {report.contact.whatsapp && (
                        <div className="report-item">
                            <label>Whatsapp:</label>
                            <p>{report.contact.whatsapp}</p>
                        </div>
                    )}
                    {report.clientFollow && (
                        <div className="report-item">
                            <label>Client a follow:</label>
                            <p>{report.clientFollow === true ? 'Oui' : 'Non'}</p>
                        </div>
                    )}
                    {report.contactMOGiven && (
                        <div className="report-item">
                            <label>Contact MO donnée:</label>
                            <p>{report.contactMOGiven === true ? 'Oui' : 'Non'}</p>
                        </div>
                    )}
                    {report.comment && (
                        <div className="report-item">
                            <label>Commentaire:</label>
                            <p>{report.comment}</p>
                        </div>
                    )}
                    {report.alreadyClient && (
                        <div className="report-item">
                            <label>Déjà client:</label>
                            <p>{report.alreadyClient === true ? 'Oui' : 'Non'}</p>
                        </div>
                    )}
                    {report.competingBrands && report.competingBrands.length > 0 && (
                        <div className="report-item">
                            <label>Marques concurrentes:</label>
                            <ul>
                                {report.competingBrands.map((brand, index) => (
                                    <li key={index}>{brand.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            )}
            {showModal && (
                <div className="modal">
                    <div className={'modal-overlay'}></div>
                    <div style={{
                        width: '80%',
                        margin: '50px auto',
                        display: 'flex',
                    }}>
                        <form className="modal-content">
                            <Row>
                                <Elmt>
                                    <label htmlFor={'client'}>Client</label>
                                    <input type="text" name="client" value={localReport.client}
                                           onChange={handleInputChange}
                                           onBlur={updateDataOnServer}
                                           required
                                           pattern="^[a-zA-Z\s]+$"
                                           title="Le nom du client doit contenir uniquement des lettres et des espaces"/>

                                </Elmt>
                                <Elmt>
                                    <label htmlFor={'type'}>Catégorie</label>
                                    <select name="type" value={localReport.type} onChange={(event) => {
                                        handleInputChange(event);
                                        handleSelectedCategoryChange(event);
                                    }} required>
                                        <option value={'Pharmacie'}>Pharmacie</option>
                                        <option value={'Parapharmacie'}>Parapharmacie</option>
                                        <option value={'Epicerie fine'}>Epicerie fine</option>
                                        <option value={'other'}>Autre</option>
                                    </select>

                                </Elmt>
                            </Row>
                            {selectedCategory === 'other' && (
                                <Row>
                                    <Elmt>
                                    <input type={"text"} name={'type'} value={localReport.type}
                                               placeholder={'Autre catégorie'}
                                               onChange={handleInputChange}/>
                                    </Elmt>
                                </Row>
                            )}
                            <Row>
                                <Elmt>
                                    <label htmlFor={'city'}>Ville</label>
                                    <select name="city" value={localReport.city} onChange={handleInputChange} required>
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
                                </Elmt>
                                <Elmt>
                                    <label htmlFor={'date'}>Date</label>
                                    <input type="date" name="date" value={localReport.date}
                                           onChange={handleInputChange}/>
                                </Elmt>
                            </Row>
                            <Row>
                                <Elmt>
                                    <label htmlFor={'hour'}>Heure</label>
                                    <input type="time" name="hour" value={localReport.hour}
                                           onChange={handleInputChange}
                                           required/>
                                </Elmt>
                                <Elmt>
                                    <label htmlFor={'duration'}>Durée</label>
                                    <input type="number" name="duration" value={localReport.duration}
                                           onChange={handleInputChange}
                                           min="0"
                                           step="1"
                                           title="La durée doit être un nombre positif"/>
                                </Elmt>
                            </Row>
                            <Row>
                                <Elmt>
                                    <label htmlFor={'person'}>Personne rencontrée</label>
                                    <input type="text" name="person" value={localReport.person}
                                           onChange={handleInputChange}
                                           pattern="^[a-zA-Z\s]+$"
                                           title="Le nom de la personne doit contenir uniquement des lettres et des espaces"/>

                                </Elmt>
                                <Elmt>
                                    <label htmlFor={'alreadyClient'}>Déjà client</label>
                                    <select name="alreadyClient" value={localReport.alreadyClient}
                                            onChange={handleInputChange}>
                                        <option value={true}>Oui</option>
                                        <option value={false}>Non</option>
                                    </select>
                                </Elmt>
                            </Row>
                            <Row>
                                <Elmt>
                                    <label style={{display: 'flex', justifyContent: 'space-between'}}
                                           onClick={addCompetingBrands} htmlFor={'competingBrands'}>
                                        <p>Marques concurente</p>
                                        <FontAwesomeIcon icon={faPlus}/>
                                    </label>
                                    {lines.map((line, index) => (
                                        <input key={index} type={'text'} name={`marque${index}`} value={line.name}
                                               onChange={(event) => handleLineChange(index, event)}/>
                                    ))}
                                </Elmt>
                            </Row>
                            <Row>
                                <Elmt>
                                    <label htmlFor={'report'}>Compte rendu</label>
                                    <textarea name="report" placeholder="compte rendu" value={localReport.comment}
                                              onChange={handleInputChange}
                                              maxLength="500"
                                              title="Le compte rendu ne peut pas dépasser  500 caractères"/>
                                </Elmt>
                            </Row>
                            <Row>
                                <Elmt>
                                    <label htmlFor={'contactName'}>Nom du contact</label>
                                    <input type="text" name="contactName" placeholder="Contact"
                                           value={localReport.contact.name}
                                           onChange={handleInputChange}
                                           pattern="^[a-zA-Z\s]+$"
                                           title="Le nom du contact doit contenir uniquement des lettres et des espaces"/>

                                </Elmt>
                                <Elmt>
                                    <label htmlFor={'contactName'}>Numéro</label>
                                    <input type="tel" name="contactNumber" placeholder="Numéro whatsapp"
                                           value={localReport.contact.whatsapp}
                                           onChange={handleInputChange}
                                           pattern="^\d{10}+$"
                                           title="Le numéro doit contenir 10 chiffres"/>

                                </Elmt>
                            </Row>
                            <Row>
                                <Elmt>
                                    <label htmlFor={'contactMOGiven'}>Contact MAROC ORGANIC entré dans le téléphone du
                                        client</label>
                                    <select name={"contactMOGiven"} value={localReport.contactMOGiven}
                                            onChange={handleInputChange}>
                                        <option value={false}>Non</option>
                                        <option value={true}>Oui</option>
                                    </select>
                                </Elmt>
                            </Row>
                            <Row>
                                <Elmt>
                                    <label htmlFor={"follow"}>Client a follow sur Instagram</label>
                                    <select name={"follow"} value={localReport.follow}
                                            onChange={handleInputChange}>
                                        <option value={false}>Non</option>
                                        <option value={true}>Oui</option>
                                    </select>
                                </Elmt>
                            </Row>
                            <Row>
                                <button onClick={closeModal}>Fermer</button>
                                <button onClick={updateDataOnServer}>Enregistrer</button>
                            </Row>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}


// Composant principal pour le planning des visites
function PlanningVisits() {
    // État pour indiquer si les données sont en cours de chargement
    const [isDataLoading, setDataLoading] = useState(false);
    // État pour stocker les données des rapports
    const [surveyData, setSurveyData] = useState([]);
    // État pour stocker la semaine et l'année sélectionnées
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    // État pour stocker la liste des semaines filtrables
    const [weeksFilter, setWeeksFilter] = useState(null);
    // Récupération du token d'authentification et de l'utilisateur depuis le contexte
    const { authToken, user } = useAuth();
    // Récupération des fonctions partagées depuis le contexte
    const { export2excel } = useFunctions();

    // Timestamp pour déclencher le rechargement des données
    const [loadTimestamp, setLoadTimestamp] = useState(Date.now());

    // Effet pour charger la liste des semaines lors du montage du composant
    useEffect(() => {
        // Définition de la fonction asynchrone à l'intérieur d'useEffect
        const fetchWeeksList = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/report/weeks', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch weeks list');
                }

                const weeksList = await response.json();
                setWeeksFilter(weeksList);

                // Set the first week as the default selection
                if (weeksList.length >  0) {
                    setSelectedWeek(weeksList[0].week);
                    setSelectedYear(weeksList[0].year);
                }
            } catch (error) {
                console.error('Error fetching weeks list:', error);
            }
        };

        // Appel immédiat de la fonction asynchrone
        fetchWeeksList();

    }, []);


    // Effet pour déclencher le rechargement des données lorsque nécessaire
    useEffect(() => {
        setLoadTimestamp(Date.now());
    }, [weeksFilter]);

    // Effet pour charger les données des rapports
    useEffect(() => {
        setDataLoading(true);
        const url = new URL(`http://localhost:5000/api/report?week=${selectedWeek}&year=${selectedYear}`);

        fetch(url, {
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
                // Extract the data from the API
                const data = apiResponse.docs.flatMap(doc => doc.reports); // Flatten the array of reports
                // Update the survey data with the new data
                setSurveyData(data);
                // Extraction des heures uniques
                const uniqueHours = Array.from(new Set(data.map(record => record.hour)));

                // Tri des heures dans l'ordre croissant
                const sortedUniqueHours = uniqueHours.sort((a, b) => {
                    const timeA = a.split(':').map(Number);
                    const timeB = b.split(':').map(Number);
                    return timeA[0] - timeB[0] || timeA[1] - timeB[1];
                });

                // Mise à jour de l'état avec les heures triées
                setHeures(sortedUniqueHours);

                setDataLoading(false);
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
                setDataLoading(false);
            });
    }, [selectedWeek, selectedYear, authToken, loadTimestamp]); // Specify the dependencies

    // Fonction pour gérer la sélection de la semaine
    const handleWeekSelection = (event) => {
        //event.preventDefault();
        const selectedValue = event.target.value;
        const [year, week] = selectedValue.split('-').map(Number); // Convert strings to numbers
        setSelectedWeek(week);
        setSelectedYear(year);
    };

    // État pour stocker les heures uniques
    const [heures, setHeures] = useState([]);

    // Liste des jours de la semaine
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    // Divisez les heures en deux groupes : avant et après  13h
    const beforeNoonHours = heures.filter(heure => parseInt(heure.slice(0,  2)) <  13);
    const afternoonHours = heures.filter(heure => parseInt(heure.slice(0,  2)) >=  13);

    // Fonction pour obtenir le lundi de la semaine ISO pour une date donnée
    function getMondayOfISOWeek(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day ===  0 ? -6 :  1); // Ajuste pour le cas où le jour est dimanche
        return new Date(date.setDate(diff));
    }

    return (
        <div>
            {isDataLoading ? (
                <Loader/>
            ) : (
                <div>
                    <div style={{display: "flex"}}>
                        <button className="responsive-button" id={'btn'} style={{margin: "50px auto 25px"}}>
                            <Link to={"/addReport"}><FontAwesomeIcon icon={faPlus}/></Link>
                            <span><Link to={"/addReport"}>Ajouter rapport</Link></span>
                        </button>
                        <Filter value={`${selectedYear}-${selectedWeek}`} onChange={handleWeekSelection}>
                            {weeksFilter && weeksFilter.map((week, index) => {
                                // Calculez la date de début de la semaine ISO (lundi)
                                const startOfWeek = getMondayOfISOWeek(new Date(week.year,  0,  1 + ((week.week -  1) *  7)));

                                // Calculez la date de fin de la semaine ISO (vendredi)
                                const endOfWeek = new Date(startOfWeek.getTime());
                                endOfWeek.setDate(startOfWeek.getDate() +  4);

                                // Formattez les dates en français
                                const formattedStartDate = startOfWeek.toLocaleDateString('fr-FR');
                                const formattedEndDate = endOfWeek.toLocaleDateString('fr-FR');

                                return (
                                    <option key={index} value={`${week.year}-${week.week}`}>
                                        {`Semaine du ${formattedStartDate} au ${formattedEndDate}`}
                                    </option>
                                );
                            })}
                        </Filter>

                    </div>

                    <button onClick={() => export2excel('report')} className={'editButton'}>
                        Exporter
                    </button>

                    <div className={"conteneurTable"}>
                        <table>
                            <thead>
                            <tr>
                                <th>Heure</th>
                                {jours.map(jour => <th key={jour}>{jour}</th>)}
                            </tr>
                            </thead>
                            <tbody>
                            {beforeNoonHours.map((heure, index) => {
                                const elementsHeure = surveyData.filter(element => element.hour === heure);

                                // Créez une cellule de plage horaire seulement pour la première heure
                                const timeRangeCell = index ===  0 ? (
                                    <td rowSpan={beforeNoonHours.length} style={{ textAlign: 'center' }}>
                                        08:00 -  13:00
                                    </td>
                                ) : null;

                                return (
                                    <tr key={`heure-${heure}`}
                                        style={{backgroundColor: index %   2 ===   0 ? 'white' : '#f2f2f2'}}>
                                        {timeRangeCell}
                                        {jours.map(jour => {
                                            const rapports = elementsHeure.filter(element => {
                                                const elementDate = new Date(element.date);
                                                const elementDayOfWeek = elementDate.getUTCDay();
                                                return elementDayOfWeek === jours.indexOf(jour) +   1;
                                            });

                                            return (
                                                <td key={`jour-${jour}`}>
                                                    {rapports.map((rapport, index) => (
                                                        <div className={"cellule"} key={`rapport-${index}`}>
                                                            <ShowReport report={rapport} user={user}/>
                                                        </div>
                                                    ))}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}

                            {/* Séparateur optionnel pour distinguer les deux groupes d'heures */}
                            <tr>
                                <td colSpan={jours.length + 1} style={{textAlign:'center'}}>Pause déjeuné</td>
                            </tr>
                            {afternoonHours.map((heure, index) => {
                                const elementsHeure = surveyData.filter(element => element.hour === heure);

                                const timeRangeCell = index ===  0 ? (
                                    <td rowSpan={afternoonHours.length} style={{ textAlign: 'center' }}>
                                        14:00 -  18:00
                                    </td>
                                ) : null;

                                return (
                                    <tr key={`heure-${heure}`}
                                        style={{backgroundColor: index %  2 ===  0 ? 'white' : '#f2f2f2'}}>
                                        {timeRangeCell}
                                        {jours.map(jour => {
                                            const rapports = elementsHeure.filter(element => {
                                                const elementDate = new Date(element.date);
                                                const elementDayOfWeek = elementDate.getUTCDay();
                                                return elementDayOfWeek === jours.indexOf(jour) +  1;
                                            });

                                            return (
                                                <td key={`jour-${jour}`}>
                                                    {rapports.map((rapport, index) => (
                                                        <div className={"cellule"} key={`rapport-${index}`}>
                                                            <ShowReport report={rapport} user={user}/>
                                                        </div>
                                                    ))}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// Exportation du composant PlanningVisits
export default PlanningVisits;