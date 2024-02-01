import styled from "styled-components";
import {useState} from "react";

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
    const addCatalogue = (event) => {
        event.preventDefault();
        setLines([...lines, <Row style={{width:"100%"}}>
            <Elmt>
                <label htmlFor={"calatologue"}>Catalogue</label>
                <select id={"catalogue"} required={true}>
                    <option value={"dragon"}>Dragon</option>
                    <option value={"emblica"}>Emblica-je suis bio</option>
                    <option value={"cailleau"}>Cailleau</option>
                    <option value={"terreDeCouleur"}>Terre de couleur</option>
                </select>
            </Elmt>
            <Elmt>
                <label htmlFor={"sentVia"}>Envoyé via</label>
                <select id={"sentVia"} required={true}>
                    <option value={"notSent"}>Pas envoyé</option>
                    <option value={"whatsapp"}>Whatsapp</option>
                    <option value={"mail"}>E-mail</option>
                    <option value={"other"}>Autre</option>
                </select>
            </Elmt>
            <Elmt>
                <label htmlFor={"sentDate"}>Envoyé le</label>
                <input type={"date"} id={"sentDate"}/>
            </Elmt>
        </Row>]);
    };

    // Retour du composant
    return(
        <div style={{
            background: "#8FB570",
            width: '80%',
            margin: '50px auto',
            display: 'flex',
            borderRadius: "30px",
            overflow: 'hidden'
        }}>
            <form style={{width: "70%", margin:'auto'}} className={'AddReportForm'}>
                <Row>
                    <h1>Ajouter un client</h1>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'client'}>Nom du client</label>
                        <input type={"text"} id={"client"} placeholder={"Nom du client"} required={true}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Catégorie</label>
                        <select required={true}>
                            <option>Pharmacie</option>
                            <option>Parapharmacie</option>
                            <option>Epicerie fine</option>
                        </select>
                    </Elmt>
                    <Elmt>
                        <label>Ville</label>
                        <select required={true}>
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
                        <label>Client</label>
                        <select required={true}>
                            <option value={"aucun"}>Non définit</option>
                            <option value={"clientDragon"}>Dragon</option>
                            <option value={"clientTerre"}>Terre de couleur</option>
                        </select>
                    </Elmt>
                </Row>
                <Row>
                    <input type={"button"} onClick={addCatalogue} value={"Ajouter un catalogue"}/>
                </Row>
                {lines.map((line, index) => (
                    <Row key={index}>
                        {line}
                    </Row>
                ))}
                <Row>
                    <Elmt>
                        <label htmlFor={"Nom"}>Nom</label>
                        <input type={"text"} placeholder={"Nom du contact"}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={"email"}>E-mail</label>
                        <input type={"email"} placeholder={"exemple@exemple.gmail.com"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={"fixe"}>Numéro fixe</label>
                        <input type={"text"} id={"fixe"} placeholder={"Numéro fixe"}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={"whatsapp"}>Numéro whatsapp</label>
                        <input type={"text"} id={"whatsapp"} placeholder={"Numéro whatsapp"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Commentaire</label>
                        <textarea placeholder={"Termes de paiements"}/>
                    </Elmt>
                </Row>
                <Row>
                    <input type={"submit"} value={"Enregistrer"}/>
                </Row>
            </form>
    </div>
    )
}

export default AddClient;
