import React, {useState} from "react";
import styled from "styled-components";
import {useAuth} from "./AuthContext";

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1002;
`;

function ChangePassword({ onClose }){
    const { handleUpdateUser, user } = useAuth();
    const [localName, setLocalName] = useState(user.name);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        console.log(data)
        handleUpdateUser(data);
    };

    return(
        <>
            <Overlay onClick={onClose} />
            <div className={'updatePopup'}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input type={'text'} name={'name'} placeholder={'Nom'}
                               onChange={(event) => setLocalName(event.target.value)} value={localName}/>
                    </div>
                    <div>
                        <input type={'password'} name={'newPassword'} placeholder={'Nouveau mot de passe'}/>
                    </div>
                    <button type="submit">Soumettre</button>
                </form>
            </div>
        </>
    )
}

export default ChangePassword;