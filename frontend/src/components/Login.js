import {useState} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom'

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

function Login({ onClose, onLogin }){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Vérifiez les informations de connexion
        // Si elles sont valides, mettez à jour le state isAuthenticated
        onLogin();
    };

    const handleOverlayClick = () => {
        onClose();
    };

    return(
        <>
            <Overlay onClick={handleOverlayClick} />
            <Div className={'loginPopup'}>
                <h2>Connexion</h2>
                <Form className={"Form"} onSubmit={handleSubmit}>
                    <input type={"email"} placeholder={"E-mail"} value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Link to={"#"}>Mot de passe oublié ?</Link>
                    <input type={"submit"} value={"Connexion"}/>
                </Form>
            </Div>
        </>
    )
}

export default Login
