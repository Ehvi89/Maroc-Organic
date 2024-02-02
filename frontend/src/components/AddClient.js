import React, { useState } from 'react';
import styled from 'styled-components';

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
        event.preventDefault();
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
                email: rawData.contactEmail
            },
            comment: rawData.comments
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
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'category'}>Catégorie</label>
                        <select name={"category"} required={true}>
                            <option>Pharmacie</option>
                            <option>Parapharmacie</option>
                            <option>Epicerie fine</option>
                        </select>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'type'}>Client</label>
                        <select name={"clientType"} required={true}>
                            <option value={"aucun"}>Non définit</option>
                            <option value={"Dragon"}>Dragon</option>
                            <option value={"TerreDeCouleur"}>Terre de couleur</option>
                        </select>
                    </Elmt>
                </Row>
                <Row>
                    <input type={"button"} onClick={addCatalogue} value={"Ajouter un catalogue"} />
                </Row>
                {lines.map((_, index) => (
                    <Row key={index}>
                        <Elmt>
                            <label htmlFor={`catalogue${index}`}>Catalogue</label>
                            <select id={`catalogue${index}`} name={`catalogue${index}`} required={true}>
                                <option value={"dragon"}>Dragon</option>
                                <option value={"emblica"}>Emblica-je suis bio</option>
                                <option value={"cailleau"}>Cailleau</option>
                                <option value={"terreDeCouleur"}>Terre de couleur</option>
                            </select>
                        </Elmt>
                        <Elmt>
                            <label htmlFor={`sentBy${index}`}>Envoyé via</label>
                            <select id={`sentBy${index}`} name={`sentBy${index}`} required={true}>
                                <option value={"notSent"}>Pas envoyé</option>
                                <option value={"whatsapp"}>Whatsapp</option>
                                <option value={"email"}>E-mail</option>
                                <option value={"other"}>Autre</option>
                            </select>
                        </Elmt>
                        <Elmt>
                            <label htmlFor={`sentDate${index}`}>Envoyé le</label>
                            <input type={"date"} id={`sentDate${index}`} name={`sentDate${index}`} />
                        </Elmt>
                    </Row>
                ))}
                <Row>
                    <Elmt>
                        <label htmlFor={"Nom"}>Nom</label>
                        <input type={"text"} placeholder={"Nom du contact"} name={"contactName"}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={"email"}>E-mail</label>
                        <input type={"email"} placeholder={"exemple@exemple.gmail.com"} name={"contactEmail"}/>
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