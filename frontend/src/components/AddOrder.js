import styled from "styled-components";
import {useState} from "react";

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
    const [paymentMethod, setPaymentMethod] = useState('');

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    let trackingNumberCounter = 10000; // Commencez à 10000 pour avoir un nombre à 5 chiffres

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries([...formData.entries()]);

        // Créer un nouvel objet avec la structure désirée
        const structuredData = {
            client: rawData.client,
            city: rawData.city,
            amount: rawData.amount,
            paymentConfirmation: rawData.paid,
            paymentMethod: rawData.paymentMethod,
            chequeNumber: rawData.chequeNumber,
            DateChequeReceived: rawData.dateReceived,
            chequeDueDate: rawData.dueDate,
            DateChequeDepositedAtBank: rawData.dateDeposited,
            trackingNumber: `${trackingNumberCounter++}`, // Incrémente le compteur pour le numéro de suivi
            billNumber: `Fac-${new Date().toISOString().slice(0, 10)}`, // Utilise la date actuelle au format YYYY-MM-DD
            paymentTerms: rawData.paymentTerms,
            numberPackagesAndDisplays: `${rawData.package ? rawData.package : 0} colis ${rawData.display ? rawData.display : 0} présentoir`,
            comment: rawData.comment
        };


        console.log(structuredData);

        try {
            const response = await fetch('http://localhost:5000/api/order', {
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
            <form  onSubmit={handleSubmit} style={{width: "58%"}} className={'AddReportForm'}>
                <Row><h1>Ajouter une commande</h1></Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'client'}>Nom du client</label>
                        <input type={"text"} id={"client"} name={'client'} placeholder={"Nom du client"} required={true}/>
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
                        <label htmlFor={"paid"}>Paiement éffectué</label>
                        <select id={"paid"}>
                            <option value={"Non"}>Non</option>
                            <option value={"Oui"}>Oui</option>
                        </select>
                    </Elmt>

                </Row>
                {paymentMethod !== 'cheque' ? (
                    <div style={{width:'100%'}}>
                        <Row>
                            <Elmt>
                                <label htmlFor={"amount"}>Montant</label>
                                <input type={"number"} name={"amount"} placeholder={"Montant"}/>
                            </Elmt>
                            <Elmt>
                                <label htmlFor={'paymentMethod'}>Mode de paiement</label>
                                <select name={'paymentMethod'} value={paymentMethod}
                                        onChange={handlePaymentMethodChange} required={true}>
                                    <option value="">Sélectionnez une option</option>
                                    <option value="Espèce">Espèce</option>
                                    <option value="Carte banquaire">Carte banquaire</option>
                                    <option value="cheque">Chèque</option>
                                    <option value={"Virement"}>Virement</option>
                                </select>
                            </Elmt>
                        </Row>
                        <Row>
                            <Elmt>
                                <label htmlFor={'dateReceived'}>Date de reception</label>
                                <input type={"date"} name={'dateReceived'} placeholder={"Date de reception"}/>
                            </Elmt>
                        </Row>
                    </div>
                ): (
                    <div style={{width:'100%'}}>
                        <Row>
                            <Elmt>
                                <label htmlFor={"amount"}>Montant</label>
                                <input type={"number"} name={"amount"} placeholder={"Montant"}/>
                            </Elmt>
                            <Elmt>
                                <label htmlFor={'paymentMethod'}>Mode de paiement</label>
                                <select name={'paymentMethod'} value={paymentMethod}
                                        onChange={handlePaymentMethodChange} required={true}>
                                    <option value="">Sélectionnez une option</option>
                                    <option value="cash">Espèce</option>
                                    <option value="cheque">Chèque</option>
                                    <option value="card">Carte banquaire</option>
                                </select>
                            </Elmt>
                        </Row>
                        <Row>
                            <Elmt>
                                <label htmlFor={'chequeNumber'}>Numéro du chèque</label>
                                <input type={"number"} name={'chequeNumber'} required={true}/>
                            </Elmt>
                            <Elmt>
                                <label htmlFor={'dateReceived'}>Date de reception</label>
                                <input type={"date"} name={'dateReceived'} placeholder={"Date de reception"}/>
                            </Elmt>
                        </Row>
                        <Row>
                            <Elmt>
                                <label htmlFor={'dueDate'}>Date d'échéance</label>
                                <input type={"date"} name={'dueDate'} placeholder={"Date d'échéance"}/>
                            </Elmt>
                            <Elmt>
                                <label htmlFor={'dateDeposite'}>Dépôt à la banque</label>
                                <input type={"date"} name={'dateDeposite'}/>
                            </Elmt>
                        </Row>
                    </div>
                )}
                <Row>
                    <Elmt>
                        <label htmlFor={'display'}>Présentoire</label>
                        <input type={"number"} name={'display'} placeholder={"Nombre de présentoire"}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'package'}>Nombre de colis</label>
                        <input type={"number"} name={'package'} placeholder={"Nomde de colis"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'payementTerms'}>Termes de paiement</label>
                        <textarea name={'paymentTerms'} placeholder={"Termes de paiements"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={"comment"}>Commentaire</label>
                        <textarea name={'comment'} placeholder={"Commentaire"}/>
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
