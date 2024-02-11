// Import necessary modules
import {Link} from 'react-router-dom'
import React, {useEffect, useState} from "react";
import styled, { keyframes } from 'styled-components'
import {faPencil, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useAuth } from '../components/AuthContext';
import {useFunctions} from "../components/SharedContext";

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

// const weeks = []

function ShowReport({ report, user }) {
    const [localReport, setLocalReport] = useState(report);
    const [isEditable, setIsEditable] = useState(false);
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
            setIsEditable(false); // Basculer vers le mode affichage après la mise à jour
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
                // Gérer les erreurs HTTP, par exemple en affichant un message d'erreur
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
                (<div style={{display: "flex", justifyContent:'space-between', alignItems:'center'}}>
                    {`${report.author.name}`.toUpperCase()}
                    <div className={'options'}>
                        <button onClick={openModal}><FontAwesomeIcon icon={faPencil}/></button>
                        <button onClick={deleteRow} value={'trash'}><FontAwesomeIcon icon={faTrash}/></button>
                    </div>
                </div>):
                (
                    `${report.author.name}`.toUpperCase()
                )
            }
            {showTooltip && (
                <div>
                    {report.client && (<div>Client: {report.client}</div>)}
                    {report.type && (<div>Type: {report.type}</div>)}
                    {report.city && (<div>Ville: {report.city}</div>)}
                    {report.hour && (<div>Heure: {report.hour}</div>)}
                    {report.duration && (<div>Durée: {report.duration} min</div>)}
                    {report.person && (<div>Personne rencontrée: {report.person}</div>)}
                    {report.contact.name && (<div>Nom contact: {report.contact.name}</div>)}
                    {report.contact.whatsapp && (<div>Whatsapp: {report.contact.whatsapp}</div>)}
                    {report.follow && (<div>Client a follow: {report.follow === 'true' ? 'Oui' : 'Non'}</div>)}
                    {report.contactMOGiven && (<div>Contact MO donnée: {report.contactMOGiven === 'true' ? 'Oui' : 'Non'}</div>)}
                    {report.comment && (<div>Commentaire: {report.comment}</div>)}

                    {report.alreadyClient && (
                        <div>Déjà client: {report.alreadyClient === 'true' ? 'Oui' : 'Non'}</div>)}
                    {report.competingBrands !== [] && (
                        <div>Marque concurente: {report.competingBrands.map((elmt, index) => (
                            <p key={index}>{elmt.name}</p>
                        ))}</div>
                    )}
                </div>
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
                                           onBlur={updateDataOnServer}/>
                                </Elmt>
                                <Elmt>
                                    <label htmlFor={'type'}>Catégorie</label>
                                    <select name="type" value={localReport.type} onChange={(event) => {
                                        handleInputChange(event);
                                        handleSelectedCategoryChange(event);
                                    }}>
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
                                    <select name="city" value={localReport.city} onChange={handleInputChange}>
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
                                           onChange={handleInputChange}/>
                                </Elmt>
                                <Elmt>
                                    <label htmlFor={'duration'}>Durée</label>
                                    <input type="number" name="duration" value={localReport.duration}
                                           onChange={handleInputChange}/>
                                </Elmt>
                            </Row>
                            <Row>
                                <Elmt>
                                    <label htmlFor={'person'}>Personne rencontrée</label>
                                    <input type="text" name="person" value={localReport.person}
                                           onChange={handleInputChange}/>
                                </Elmt>
                                <Elmt>
                                    <label htmlFor={'alreadyClient'}>Déjà client</label>
                                    <select name="alreadyClient" value={localReport.alreadyClient}
                                            onChange={handleInputChange}>
                                        <option value="true">Oui</option>
                                        <option value="false">Non</option>
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
                                    <textarea name={'report'} placeholder={"compte rendu"} value={localReport.comment}
                                              onChange={handleInputChange}/>
                                </Elmt>
                            </Row>
                            <Row>
                                <Elmt>
                                    <label htmlFor={'contactName'}>Nom du contact</label>
                                    <input type={"text"} name={'contactName'} placeholder={"Contact"}
                                           value={localReport.contact.name}
                                           onChange={handleInputChange}/>
                                </Elmt>
                                <Elmt>
                                    <label htmlFor={'contactName'}>Numéro</label>
                                    <input type={"number"} name={'contactNumber'} placeholder={"Numéro whatsapp"}
                                           value={localReport.contact.whatsapp}
                                           onChange={handleInputChange}/>
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


// Main component
function PlanningVisits() {
    const [isDataLoading, setDataLoading] = useState(false);
    const [surveyData, setSurveyData] = useState([]); // Initialisez avec un tableau vide
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [weeksFilter, setWeeksFilter] = useState(null);
    const {authToken, user} = useAuth();
    const {export2excel} = useFunctions();

    async function fetchWeeksList() {
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
            if (weeksList.length > 0) {
                setSelectedWeek(weeksList[0].week);
                setSelectedYear(weeksList[0].year);
            }
        } catch (error) {
            console.error('Error fetching weeks list:', error);
        }
    }

// Call this function when the component mounts or when necessary
    useEffect(() => {
        fetchWeeksList();
        // No cleanup needed for this effect since it only runs once
    }, []); // Empty dependency array means this effect runs once on mount


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
                setDataLoading(false);
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
                setDataLoading(false);
            });
    }, [selectedWeek, selectedYear, authToken]); // Specify the dependencies

    const handleWeekSelection = (event) => {
        //event.preventDefault();
        const selectedValue = event.target.value;
        const [year, week] = selectedValue.split('-').map(Number); // Convert strings to numbers
        setSelectedWeek(week);
        setSelectedYear(year);
    };


    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]
    const heures = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "17:00"];

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
                        <Filter onChange={handleWeekSelection}>
                            {weeksFilter && weeksFilter.map((week, index) => {
                                // Calculez la date de début de la semaine ISO (lundi)
                                const startOfWeek = new Date(week.year, 0, 1 + ((week.week - 1) * 7));
                                // Calculez la date de fin de la semaine ISO (vendredi)
                                const endOfWeek = new Date(startOfWeek.getTime());
                                endOfWeek.setDate(startOfWeek.getDate() + 4);
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
                            {heures.map((heure, index) => {
                                const elementsHeure = surveyData.filter(element => element.hour === heure);

                                return (
                                    <tr key={`heure-${heure}`}
                                        style={{backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2'}}>
                                        <td>{heure}</td>
                                        {jours.map(jour => {
                                            // Filtrer les éléments pour le jour spécifique
                                            const rapports = elementsHeure.filter(element => {
                                                const elementDate = new Date(element.date);
                                                const elementDayOfWeek = elementDate.getUTCDay(); // Retourne 0 pour dimanche, 1 pour lundi, etc.
                                                return elementDayOfWeek === jours.indexOf(jour) + 1; // +1 car getUTCDay() commence à 0
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

// Export PlanningVisits component
export default PlanningVisits;
