import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "./context/AuthContext";
import {useFunctions} from "./context/SharedContext";

// Composition du composant Overlay avec des styles CSS en JS
const Overlay = styled.div`
    position: fixed;
    top:  0;
    left:  0;
    width:  100%;
    height:  100%;
    background-color: rgba(0,  0,  0,  0.5);
    z-index:  1002;
`;

// Composant pour permettre à l'utilisateur de changer son mot de passe
function ChangePassword({ onClose }) {
    // Accès aux fonctions et données de l'authentification via le hook useAuth
    const { user } = useAuth();
    const { handleUpdateUser } = useFunctions();
    // État local pour le nom de l'utilisateur
    const [localName, setLocalName] = useState(user.name);

    // Gestionnaire d'événements pour la soumission du formulaire
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        console.log(data);
        handleUpdateUser(data);
        onClose();
    };

    // Retourne le composant avec un overlay et un formulaire pour changer le mot de passe
    return (
        <>
            {/* Overlay qui recouvre toute la page et permet de fermer le popup en cliquant dessus */}
            <Overlay onClick={onClose} />
            {/* Popup contenant le formulaire pour changer le mot de passe */}
            <div className="updatePopup">
                <form onSubmit={handleSubmit}>
                    <div>
                        {/* Champ de saisie pour le nom de l'utilisateur */}
                        <input
                            type="text"
                            name="name"
                            placeholder="Nom"
                            onChange={(event) => setLocalName(event.target.value)}
                            value={localName}
                            required
                        />
                    </div>
                    <div>
                        {/* Champ de saisie pour le nouveau mot de passe de l'utilisateur */}
                        <input
                            type="password"
                            placeholder="Nouveau mot de passe (facultatif)"
                            name="newPassword"
                            required
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$"
                            title="Le mot de passe doit contenir au moins un caractère spécial, des majuscules, des miniscules et des chiffres"
                        />
                    </div>
                    {/* Bouton pour soumettre le formulaire */}
                    <button type="submit">Soumettre</button>
                </form>
            </div>
        </>
    );
}

export default ChangePassword;
