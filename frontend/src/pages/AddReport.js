// Importation des modules nécessaires
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from '../components/context/AuthContext';

// Définition des composants styled
const Row = styled.div`
    display: flex;
    width: 80%;
    margin: auto;
    justify-content: center;
`;

const Elmt = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 5px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    margin: 15px;
    color: #F4F5F5;
`;

// Composant principal pour ajouter un nouveau rapport de visite
function AddReport() {
    // État pour stocker la catégorie sélectionnée
    const [selectedCategory, setSelectedCategory] = useState('');
    const { authToken } = useAuth();
    // État pour stocker les informations de l'utilisateur
    const [user, setUser] = useState(null);
    // Hook pour la navigation
    const navigate = useNavigate();

    // Effect pour mettre à jour l'état de l'utilisateur lorsque le token d'authentification change
    useEffect(() => {
        // Si authToken existe, récupère les données de l'utilisateur
        if (authToken) {
            const userData = window.localStorage.getItem('user');
            // Parse correctement les données de l'utilisateur avec JSON.parse
            setUser(userData ? JSON.parse(userData) : null);
        } else {
            setUser(null); // Efface l'état de l'utilisateur si authToken n'est pas présent
        }
    }, [authToken]);

    // Fonction pour gérer le changement de catégorie sélectionnée
    const handleSelectedCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    // État pour stocker les lignes de marques concurrentes
    const [lines, setLines] = useState([]);

    // Fonction pour ajouter une nouvelle ligne de marque concurrente
    const addCompetingBrands = () => {
        setLines([...lines, {
            name: ''
        }]);
    };

    const [isFormValid, setIsFormValid] = useState(false);

    const handleFormChange = () => {
        const form = document.querySelector('.AddReportForm');
        const isValid = form.checkValidity();
        setIsFormValid(isValid);
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries([...formData.entries()]);

        // Créer un nouvel objet avec la structure désirée
        const structuredData = {
            author: {
                name: user.name,
                email: user.email
            },
            client: rawData.client,
            city: rawData.city,
            type: rawData.category,
            date: rawData.date,
            hour: rawData.hour,
            duration: rawData.duration,
            person: rawData.person,
            competingBrands: [],
            contact:{
                name: rawData.contactName,
                whatsapp:rawData.contactNumber
            },
            alreadyClient: rawData.alreadyClient,
            contactMOGiven: rawData.contactMOGiven,
            clientFollow: rawData.follow,
            comment: rawData.report,
            userEmail: user.email
        };

        // les lignes de catalogue sont stockées dans un état appelé 'lines'
        lines.forEach((_, index) => {
            structuredData.competingBrands.push({
                name: rawData[`marque${index}`]
            });
        });


        try {
            const response = await fetch('http://localhost:5000/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(structuredData),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi des données');
            }

            navigate('/planningVisits')
            // Gérer la réponse de l'API si nécessaire
        } catch (error) {
            console.error('Erreur:', error);
            // Afficher un message d'erreur à l'utilisateur
            alert('Une erreur est survenue lors de l\'ajout du rapport. Veuillez réessayer.');
        }
    };

    // Retour du composant
    return (
        <div style={{
            background: "#8FB570",
            width: '80%',
            margin: '50px auto',
            display: 'flex',
            borderRadius: "30px",
            overflow: 'hidden'
        }}>
            <form onSubmit={handleSubmit} onChange={handleFormChange} style={{width: "58%"}} className={'AddReportForm'}>
                <Row><h1>Ajouter un rapport de visite</h1></Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'client'}>Nom du client</label>
                        <input type={"text"} id={"client"} name={'client'} placeholder={"Nom du client"} required={true}
                               pattern="^[a-zA-Z\s]+$"
                               title="Le nom doit contenir uniquement des lettres et des espaces"/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'category'}>Type</label>
                        <select name={'category'} onChange={handleSelectedCategoryChange} required={true}>
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
                            <label htmlFor={'category'}>Autre catégorie</label>
                            <input type={"text"} name={'category'} placeholder={'Autre catégorie'} required={true} pattern="^[a-zA-Z\s]+$" title="La catégorie doit contenir uniquement des lettres et des espaces"/>
                        </Elmt>
                    </Row>
                )}
                <Row>
                    <Elmt>
                        <label htmlFor={'city'}>Ville</label>
                        <select name={'city'} required={true}>
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
                        <label htmlFor={"hour"}>Heure de la visite</label>
                        <input type={"time"} name={'hour'}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={"duration"}>Durée de la visite</label>
                        <input type={"number"} name={"duration"} placeholder={"min"} min={0} step={1} required={true} title="La durée de la visite doit être un entier positif"/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'date'}>Date</label>
                        <input type={"date"} name={'date'} required={true}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={"alreadyClient"}>Déjà client ?</label>
                        <select id={"alreadyClient"} name={'alreadyClient'} required={true}>
                            <option value={false}>Non</option>
                            <option value={true}>Oui</option>
                        </select>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'person'}>Personne rencontrée</label>
                        <input type={"text"} name={'person'} placeholder={"Personne rencontrée"} pattern="^[a-zA-Z\s]+$" title="Le nom de la personne doit contenir uniquement des lettres et des espaces"/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'competingBrands'}>Marques concurente</label>
                        {lines.map((_, index) => (
                            <input key={index} type={'text'} name={`marque${index}`} placeholder={'Marque concurente'}/>
                        ))}
                        <div onClick={addCompetingBrands} style={{margin: 'auto'}}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </div>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'report'}>Compte rendu</label>
                        <textarea name={'report'} placeholder={"compte rendu"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'contactName'}>Nom du contact</label>
                        <input type={"text"} name={'contactName'} placeholder={"Contact"} pattern="^[a-zA-Z\s]+$" title="Le nom du contact doit contenir uniquement des lettres et des espaces"/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'contactNumber'}>Numéro</label>
                        <input type={"tel"} name={'contactNumber'} placeholder={"Numéro whatsapp"} pattern="^\d{10}$" title="Le numéro doit contenir 10 chiffres"/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'contactMOGiven'}>Contact MAROC ORGANIC entré dans le téléphone du
                            client</label>
                        <select name={"contactMOGiven"}>
                            <option value={false}>Non</option>
                            <option value={true}>Oui</option>
                        </select>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={"follow"}>Client a follow sur Instagram</label>
                        <select name={"follow"} required={true}>
                            <option value={false}>Non</option>
                            <option value={true}>Oui</option>
                        </select>
                    </Elmt>
                </Row>
                <Row>
                    <input type={"submit"} value={"Enregistrer"} className={isFormValid ? "valid-submit" : ""}/>
                </Row>
            </form>
            <div className={"image"}></div>
        </div>
    );
}

// Exportation du composant AddReport
export default AddReport;