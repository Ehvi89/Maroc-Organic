// Import necessary modules
import styled from 'styled-components';
import React from "react";
import {useAuth} from "./AuthContext";

// Define styled components
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
    
    @media screen and (max-width: 820px){
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

function CreateUser( { onClose } ){
    const { authToken, user } = useAuth()
    const handleOverlayClick = () => {
        onClose();
    };
    const handleSubmit = async (event) => {
        // event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries([...formData.entries()]);

        // Créer un nouvel objet avec la structure désirée
        const structuredData = {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            userEmail: user.email
        };

        try {
            const response = await fetch('http://localhost:5000/api/createUser', {
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
            onClose();

            // Gérer la réponse de l'API si nécessaire
        } catch (error) {
            console.error('Erreur:', error);
            // Gérer l'erreur si nécessaire
        }
    };

    return(
        <>
            <Overlay onClick={handleOverlayClick} />
            <Div className={'loginPopup'}>
                <Form className={'AddUserForm'} onSubmit={handleSubmit}>
                    <p>Ajouter un utilisateur</p>
                    <Elmt>
                        <label htmlFor={'name'}>Nom</label>
                        <input type={'text'} name={'name'} placeholder={'Nom d\'utilisateur'} required={true}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'email'}>E-mail</label>
                        <input type={'email'} name={'email'} placeholder={'exemple@exemple.exemple'} required={true}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'password'}>Mot de passe</label>
                        <input type={'password'} name={'password'} placeholder={'***********************'} required={true}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={'role'}>Rôle</label>
                        <select name={'role'} required={true}>
                            <option value={'Administrateur'}>Administrateur</option>
                            <option value={'Employé'}>Employé(e)</option>
                            <option value={'Stagiaire'}>Stagiaire</option>
                        </select>
                    </Elmt>
                    <input type={'submit'} value={'Enregistrer'}/>
                </Form>
                <div className={"image"}></div>
            </Div>
        </>
    )
}

export default CreateUser;