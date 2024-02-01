import styled from "styled-components";

// Define styled components
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

// Main component
function AddOrder() {
    return (
        <div style={{
            background: "#8FB570",
            width: '80%',
            margin: '50px auto',
            display: 'flex',
            borderRadius: "30px",
            overflow: 'hidden'
        }}>
            <div className={"image"} style={{width: "42%", overflow: 'hidden'}}></div>
            <form style={{width: "58%"}} className={'AddReportForm'}>
                <Row><h1>Ajouter une commande</h1></Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'client'}>Nom du client</label>
                        <input type={"text"} id={"client"} placeholder={"Nom du client"} required={true}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Type</label>
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
                        <label>Mode de paiement</label>
                        <select required={true}>
                            <option>Espèce</option>
                            <option>Chèque</option>
                            <option>Carte banquaire</option>
                        </select>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={"monney"}>Montant</label>
                        <input type={"number"} name={"monney"} placeholder={"Montant"}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={"paid"}>Paiement éffectué</label>
                        <select id={"paid"}>
                            <option>Non</option>
                            <option>Oui</option>
                        </select>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Date de reception</label>
                        <input type={"date"} placeholder={"Date de reception"}/>
                    </Elmt>
                    <Elmt>
                        <label>Date d'échéance</label>
                        <input type={"date"} placeholder={"Date d'échéance"}/>
                    </Elmt>
                    <Elmt>
                        <label>Dépôt à la banque</label>
                        <input type={"date"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Présentoire</label>
                        <input type={"number"} placeholder={"Nombre de présentoire"}/>
                    </Elmt>
                    <Elmt>
                        <label>Nombre de colis</label>
                        <input type={"number"} placeholder={"Nomde de colis"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Termes de paiement</label>
                        <textarea placeholder={"Termes de paiements"}/>
                    </Elmt>
                </Row>
                <Row>
                    <input type={"submit"} value={"Enregistrer"}/>
                </Row>
            </form>
        </div>
    );
}

export default AddOrder;
