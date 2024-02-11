import styled from "styled-components";
import {useRef, useState} from "react";
import {useAuth} from '../components/AuthContext';

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
    const { authToken, user } = useAuth();
    const trackingCounter = useRef(0); // Utilisez useRef pour conserver la valeur entre les rendus

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const generateUniqueBillNumber = () => {
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:.]/g, '').substring(0,  14);
        return `Fac-${timestamp}`;
    };

    const generateUniqueTrackingNumber = () => {
        trackingCounter.current++; // Incrémentez le compteur
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:.]/g, '').substring(0,  14);
        return `${timestamp}-${trackingCounter.current}`;
    };

    const handleSubmit = async (event) => {
        //event.preventDefault(); // Empêchez le comportement par défaut du formulaire
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries([...formData.entries()]);

        // Validez les données du formulaire  ici si nécessaire

        const structuredData = {
            date: `${new Date().toISOString().slice(0, 10)}`,
            client: rawData.client,
            city: rawData.city,
            amount: rawData.amount,
            paymentConfirmation: rawData.paid,
            paymentMethod: rawData.paymentMethod,
            chequeNumber: rawData.chequeNumber,
            DateChequeReceived: rawData.dateReceived,
            chequeDueDate: rawData.dueDate,
            DateChequeDepositedAtBank: rawData.dateDeposited,
            trackingNumber: generateUniqueTrackingNumber(),
            billNumber: generateUniqueBillNumber(),
            paymentTerms: rawData.paymentTerms,
            numberPackagesAndDisplays: `${rawData.package ? `${rawData.package} colis` : ''}${rawData.display ? `${rawData.display} présentoir` : ''}`,
            comment: rawData.comment,
            receptionConfirmation: false,
            userEmail: user.email
        };

        console.log(structuredData);

        try {
            const response = await fetch('http://localhost:5000/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(structuredData),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Obtenez le message d'erreur du serveur
                throw new Error(`Erreur lors de l'envoi des données: ${errorText}`);
            }

            const result = await response.json();
            console.log(result);
            // Gérer la réponse de l'API si nécessaire
        } catch (error) {
            console.error('Erreur:', error);
            // Afficher un message d'erreur à l'utilisateur
            alert('Une erreur est survenue lors de l\'ajout de la commande. Veuillez réessayer.');
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
                        <label htmlFor={"paid"}>Paiement éffectué</label>
                        <select id={"paid"} name={'paid'}>
                            <option value={false}>Non</option>
                            <option value={true}>Oui</option>
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
