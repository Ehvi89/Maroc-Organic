// Importation des modules nécessaires
import styled from 'styled-components';
import React from "react";
import { useAuth } from "./context/AuthContext";

// Définition des composants stylisés
const Div = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 15px;
    box-shadow: 0 10px 1000px rgba(0, 0, 0, 0.5);
    background: #8FB570;
    z-index: 2000;
    display: flex;
    width: 40%;
    overflow: hidden;

    @media screen and (max-width: 820px) {
        width: 80%;
    }
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin: 35px 25px 5px;
`

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1002;
`;

const Elmt = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px 15px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.2);
    color: #F4F5F5;
    margin: 10px 15px;
`;

// Composant pour créer un nouvel utilisateur
function CreateUser({ onClose }) {
    // Accès au token d'authentification et aux informations de l'utilisateur via le hook useAuth
    const { authToken, user } = useAuth();

    // Gestionnaire d'événements pour cliquer sur l'overlay et fermer le popup
    const handleOverlayClick = () => {
        onClose();
    };

    // Gestionnaire d'événements pour la soumission du formulaire
    const handleSubmit = async (event) => {
        // Empêche le comportement par défaut du formulaire
        // event.preventDefault();
        // Crée un objet FormData à partir du formulaire
        const formData = new FormData(event.currentTarget);
        // Convertit l'objet FormData en objet JavaScript
        const data = Object.fromEntries([...formData.entries()]);

        // Structure les données selon la structure attendue par l'API
        const structuredData = {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            userEmail: user.email
        };

        try {
            // Envoie une requête POST à l'API pour créer un nouvel utilisateur
            const response = await fetch('http://localhost:5000/api/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(structuredData),
            });

            // Vérifie si la réponse est correcte
            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi des données');
            }

            // Traite la réponse de l'API
            const result = await response.json();
            console.log(result);
            onClose(); // Ferme le popup après la création de l'utilisateur

            // Gère la réponse de l'API si nécessaire
        } catch (error) {
            console.error('Erreur:', error);
            // Gère l'erreur si nécessaire
        }
    };

    // Retourne le composant avec un overlay et un formulaire pour créer un nouvel utilisateur
    return (
        <>
            {/* Overlay qui recouvre toute la page et permet de fermer le popup en cliquant dessus */}
            <Overlay onClick={handleOverlayClick} />
            {/* Popup contenant le formulaire pour créer un nouvel utilisateur */}
            <Div className="loginPopup">
                <Form className={'AddUserForm'} onSubmit={handleSubmit}>
                    <p>Ajouter un utilisateur</p>
                    <Elmt>
                        <label htmlFor={'name'}>Nom</label>
                        <input type={'text'} name={'name'} placeholder={'Nom d\'utilisateur'} required={true}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'email'}>E-mail</label>
                        <input type={"email"} name={'email'} placeholder={"E-mail"} required
                               pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                               title="Entrez une adresse e-mail valide"/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'password'}>Mot de passe</label>
                        <input type={'password'} name={'password'} placeholder={"Mot de passe"} required minLength={8}
                               pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$"
                               title="Le mot de passe doit contenir au moins un caractère spécial, des majuscules, des miniscules et des chiffres"/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'role'}>Rôle</label>
                        <select name={'role'} required={true}>
                            <option value="" disabled selected>Sélectionnez un rôle</option>
                            <option value={'Administrateur'}>Administrateur</option>
                            <option value={'Employé'}>Employé(e)</option>
                            <option value={'Stagiaire'}>Stagiaire</option>
                        </select>
                    </Elmt>
                    <input type={'submit'} value={'Enregistrer'}/>
                </Form>
                {/* Image du côté gauche visuel dans le popup */}
                <div className="image"></div>
            </Div>
        </>
    );
}

export default CreateUser;