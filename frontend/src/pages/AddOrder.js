// Importation des modules nécessaires
import styled from "styled-components";
import { useRef, useState } from "react";
import { useAuth } from '../components/context/AuthContext';
import {useNavigate} from "react-router-dom";

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


// Main component
// Composant principal pour ajouter une nouvelle commande
function AddOrder() {
    // État pour stocker la méthode de paiement sélectionnée
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();
    const { authToken, user } = useAuth();
    // Utilisation d'useRef pour conserver la valeur du compteur entre les rendus
    const trackingCounter = useRef(0);

    // Fonction pour gérer le changement de méthode de paiement
    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    // Fonction pour générer un numéro de facture unique
    const generateUniqueBillNumber = () => {
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:.]/g, '').substring(0,  14);
        return `Fac-${timestamp}`;
    };

    // Fonction pour générer un numéro de suivi unique
    const generateUniqueTrackingNumber = () => {
        trackingCounter.current++; // Incrémentez le compteur
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:.]/g, '').substring(0,  14);
        return `${timestamp}-${trackingCounter.current}`;
    };

    const [isFormValid, setIsFormValid] = useState(false);

    const handleFormChange = () => {
        const form = document.querySelector('.AddReportForm');
        const isValid = form.checkValidity();
        setIsFormValid(isValid);
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault(); // Empêchez le comportement par défaut du formulaire

        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries([...formData.entries()]);

        // Validez les données du formulaire ici si nécessaire

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
            numberPackagesAndDisplays: `${rawData.package ? `${rawData.package} colis` : ''} ${rawData.display ? `${rawData.display} présentoir` : ''}`,
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
            navigate('/orderPayementTracking')
            // Gérer la réponse de l'API si nécessaire
        } catch (error) {
            console.error('Erreur:', error);
            // Afficher un message d'erreur à l'utilisateur
            alert('Une erreur est survenue lors de l\'ajout de la commande. Veuillez réessayer.');
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
            <div className={"image"} style={{width: "42%", overflow: 'hidden'}}></div>
            <form onSubmit={handleSubmit} onChange={handleFormChange} style={{width: "58%"}}
                  className={'AddReportForm'}>
                <Row><h1>Ajouter une commande</h1></Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'client'}>Nom du client</label>
                        <input type={"text"} id={"client"} name={'client'} placeholder={"Nom du client"} required={true}
                               pattern="^[a-zA-Z\s]+$"
                               title="Le nom doit contenir uniquement des lettres et des espaces"/>
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
                        <select id={"paid"} name={'paid'} required={true}>
                            <option value={false}>Non</option>
                            <option value={true}>Oui</option>
                        </select>
                    </Elmt>

                </Row>
                {paymentMethod !== 'Chèque' ? (
                    <div style={{width: '100%'}}>
                        <Row>
                            <Elmt>
                                <label htmlFor={"amount"}>Montant</label>
                                <input type={"number"} name={"amount"} placeholder={"Montant"} required/>
                            </Elmt>
                            <Elmt>
                                <label htmlFor={'paymentMethod'}>Mode de paiement</label>
                                <select name={'paymentMethod'} value={paymentMethod}
                                        onChange={handlePaymentMethodChange} required={true}>
                                    <option value="">Sélectionnez une option</option>
                                    <option value="Espèce">Espèce</option>
                                    <option value="Chèque">Chèque</option>
                                    <option value="Carte bancaire">Carte bancaire</option>
                                    <option value='Virement'>Virement</option>
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
                ) : (
                    <div style={{width: '100%'}}>
                        <Row>
                            <Elmt>
                                <label htmlFor={"amount"}>Montant</label>
                                <input type={"number"} name={"amount"} placeholder={"Montant"} required/>
                            </Elmt>
                            <Elmt>
                                <label htmlFor={'paymentMethod'}>Mode de paiement</label>
                                <select name={'paymentMethod'} value={paymentMethod}
                                        onChange={handlePaymentMethodChange} required={true}>
                                    <option value="">Sélectionnez une option</option>
                                    <option value="Espèce">Espèce</option>
                                    <option value="Chèque">Chèque</option>
                                    <option value="Carte bancaire">Carte bancaire</option>
                                    <option value='Virement'>Virement</option>
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
                                <label htmlFor={'dateDeposit'}>Dépôt à la banque</label>
                                <input type={"date"} name={'dateDeposit'}/>
                            </Elmt>
                        </Row>
                    </div>
                )}
                <Row>
                    <Elmt>
                        <label htmlFor={'display'}>Présentoir</label>
                        <input type={"number"} name={'display'} placeholder={"Nombre de présentoir"} min={0} step={1}
                               title="Le nombre de présentoire doit être un entier positif"/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'package'}>Nombre de colis</label>
                        <input type={"number"} name={'package'} placeholder={"Nombre de colis"} min={0} step={1}
                               title="Le nombre de colis doit être un entier positif"/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'payementTerms'}>Termes de paiement</label>
                        <textarea name={'paymentTerms'} placeholder={"Termes de paiements"} maxLength={500} title="Les termes de paiement ne doivent pas dépasser  500 caractères"/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={"comment"}>Commentaire</label>
                        <textarea name={'comment'} placeholder={"Commentaire"} maxLength={500} title="Le commentaire ne doit pas dépasser  500 caractères"/>                    </Elmt>
                </Row>
                <Row>
                    <input type={"submit"} value={"Enregistrer"}  className={isFormValid ? "valid-submit" : ""}/>
                </Row>
            </form>
        </div>
    );
}

// Exportation du composant AddOrder
export default AddOrder;