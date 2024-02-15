// Importation des modules nécessaires
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Définition des composants stylisés
const Div = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 10px 1000px rgba(0, 0, 0, 0.5);
    background: linear-gradient(to bottom, #8FB570 21%, #F5F4F4 21%);
    text-align: center;
    z-index: 2000;
    width: 40%;
    max-width: 500px;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin: 35px 25px 5px;
`

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1002;
`;

// Définition du composant Login
function Login({ onClose, onLogin }) {
    // États pour gérer les champs de saisie de l'email et du mot de passe
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Nouvel état pour le message d'erreur
    const [errorMessage, setErrorMessage] = useState('');

    // Accès à la fonction setToken du contexte d'authentification
    const { setToken } = useAuth();

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const authData = {
                email: email,
                password: password
            };

            const response = await fetch(`http://localhost:5000/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur de connexion');
            }

            const data = await response.json();
            const token = data.token;
            setToken(token, data.user);
            onLogin(data.user);// Pass the user data to the parent component
            setErrorMessage(''); // Clear the error message on successful login
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Email ou mot de passe incorrecte'); // Set the error message
        } finally {
            // Reset the form fields after submission
            setEmail('');
            setPassword('');
        }
    };

    // Fonction pour gérer les clics sur l'overlay
    const handleOverlayClick = () => {
        onClose();
    };

    // Effet pour effacer le message d'erreur après un délai
    useEffect(() => {
        let timer;
        if (errorMessage) {
            timer = setTimeout(() => {
                setErrorMessage(''); // Clear the error message after  5 seconds
            },  7500);
        }
        return () => clearTimeout(timer); // Clean up the timer on component unmount
    }, [errorMessage]);

    // Retourne le JSX pour le composant
    return (
        <>
            <Overlay onClick={handleOverlayClick} />
            <Div className="loginPopup">
                <h2>Connexion</h2>
                <Form className="Form" onSubmit={handleSubmit}>
                    {/* Affichage conditionnel du message d'erreur */}
                    {errorMessage && <p style={{ color: '#E73541' }}>{errorMessage}</p>}
                    {/* Champs de saisie pour l'email et le mot de passe */}
                    <input type="email" name="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" name="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {/* Lien pour réinitialiser le mot de passe */}
                    <Link to="resetPasswordRequest" onClick={() => onClose()}>Mot de passe oublié ?</Link>
                    {/* Bouton pour soumettre le formulaire */}
                    <input type="submit" value="Connexion" />
                </Form>
            </Div>
        </>
    );
}

// Exportation du composant Login
export default Login;