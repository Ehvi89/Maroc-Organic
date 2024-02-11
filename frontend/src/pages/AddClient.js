import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../components/AuthContext';
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


// Composant AddClient
function AddClient() {
    // État pour stocker les lignes
    const [lines, setLines] = useState([]);
    const { authToken, user } = useAuth();

    // Fonction pour ajouter une nouvelle ligne
    const addCatalogue = () => {
        setLines([...lines, {
            catalogue: '',
            sentVia: '',
            sentDate: ''
        }]);
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (event) => {
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries([...formData.entries()]);

        // Créer un nouvel objet avec la structure désirée
        const structuredData = {
            client: rawData.client,
            category: rawData.category,
            city: rawData.city,
            type: rawData.clientType,
            catalogue: [],
            contact: {
                name: rawData.contactName,
                fixe: rawData.fixedPhone,
                whatsapp: rawData.whatsappPhone,
                address: rawData.adress,
                role: rawData.role
            },
            comment: rawData.comments,
            userEmail: user.email
        };

        // les lignes de catalogue sont stockées dans un état appelé 'lines'
        lines.forEach((_, index) => {
            structuredData.catalogue.push({
                name: rawData[`catalogue${index}`],
                sentDate: rawData[`sentDate${index}`],
                sentBy: rawData[`sentBy${index}`]
            });
        });


        console.log(structuredData);

        try {
            const response = await fetch('http://localhost:5000/api/client', {
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

            const result = await response.json();
            console.log(result);
            // Gérer la réponse de l'API si nécessaire
        } catch (error) {
            console.error('Erreur:', error);
            // Gérer l'erreur si nécessaire
        }
    };

    const handleSelectedCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };
    // Créez un état pour stocker la valeur de l'input
    const [selectedCategory, setSelectedCategory] = useState('');


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
            <form onSubmit={handleSubmit} style={{width: "70%", margin:'auto'}} className={'AddReportForm'}>
                <Row>
                    <h1>Ajouter un client</h1>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'client'}>Nom du client</label>
                        <input type={"text"} id={"client"} name={"client"} placeholder={"Nom du client"} required={true}/>
                    </Elmt>
                </Row>
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
                        <label htmlFor={'type'}>Client</label>
                        <select name={"clientType"}>
                            <option value={""}>Non définit</option>
                            <option value={"Dragon"}>Dragon</option>
                            <option value={"Terre de couleur"}>Terre de couleur</option>
                        </select>
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
                            <input type={"text"} name={'category'} placeholder={'Autre catégorie'}/>
                        </Elmt>
                    </Row>
                )}
                <Row>
                    <input type={"button"} onClick={addCatalogue} value={"Ajouter un catalogue"}/>
                </Row>
                {lines.map((_, index) => (
                    <Row key={index}>
                        <Elmt>
                            <label htmlFor={`catalogue${index}`}>Catalogue</label>
                            <select id={`catalogue${index}`} name={`catalogue${index}`} required={true}>
                                <option value={"Dragon"}>Dragon</option>
                                <option value={"Emblica - je suis bio"}>Emblica-je suis bio</option>
                                <option value={"Cailleau"}>Cailleau</option>
                                <option value={"Terre de couleur"}>Terre de couleur</option>
                            </select>
                        </Elmt>
                        <Elmt>
                            <label htmlFor={`sentBy${index}`}>Envoyé via</label>
                            <select id={`sentBy${index}`} name={`sentBy${index}`} required={true}>
                                <option value={"Pas envoyé"}>Pas envoyé</option>
                                <option value={"Whatsapp"}>Whatsapp</option>
                                <option value={"E-mail"}>E-mail</option>
                                <option value={"Autre"}>Autre</option>
                            </select>
                        </Elmt>
                        <Elmt>
                            <label htmlFor={`sentDate${index}`}>Envoyé le</label>
                            <input type={"date"} id={`sentDate${index}`} name={`sentDate${index}`}/>
                        </Elmt>
                    </Row>
                ))}
                <Row>
                    <Elmt>
                        <label htmlFor={"Nom"}>Nom</label>
                        <input type={"text"} placeholder={"Nom du contact"} name={"contactName"}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={"adress"}>E-mail</label>
                        <input type={"text"} placeholder={"exemple@exemple.gmail.com"} name={"contactEmail"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={"fixe"}>Numéro fixe</label>
                        <input type={"tel"} id={"fixe"} placeholder={"Numéro fixe"} name={"fixedPhone"}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={"whatsapp"}>Numéro whatsapp</label>
                        <input type={"tel"} id={"whatsapp"} placeholder={"Numéro whatsapp"} name={"whatsappPhone"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Fonction</label>
                        <textarea placeholder={"Fonction du contact"} name={"role"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Commentaire</label>
                        <textarea placeholder={"Commentaire"} name={"comments"}/>
                    </Elmt>
                </Row>
                <Row>
                    <input type={"submit"} value={"Enregistrer"} />
                </Row>
            </form>
        </div>
    );
}

export default AddClient;