// Import necessary modules
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom'
import { useAuth } from './AuthContext';

// Define styled components
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

// Define Login component
function Login({ onClose, onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // New state for error message
    const [submitted, setSubmitted] = useState(false); // New state to track form submission

    const { setToken } = useAuth();

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true); // Mark the form as submitted
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

    // Function to handle clicks on the overlay
    const handleOverlayClick = () => {
        onClose();
    };

    // Effect to clear the error message after a delay
    useEffect(() => {
        let timer;
        if (errorMessage) {
            timer = setTimeout(() => {
                setErrorMessage(''); // Clear the error message after  5 seconds
            },  7500);
        }
        return () => clearTimeout(timer); // Clean up the timer on component unmount
    }, [errorMessage]);

    // Return the JSX for the component
    return (
        <>
            <Overlay onClick={handleOverlayClick} />
            <Div className={'loginPopup'}>
                <h2>Connexion</h2>
                <Form className={"Form"} onSubmit={handleSubmit}>
                    {errorMessage && <p style={{ color: '#E73541' }}>{errorMessage}</p>} {/* Conditionally render error message */}
                    <input type={"email"} name={'email'} placeholder={"E-mail"} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" name={'password'} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Link to={"#"}>Mot de passe oublié ?</Link>
                    <input type={"submit"} value={"Connexion"} />
                </Form>
            </Div>
        </>
    );
}

// Export Login component
export default Login;