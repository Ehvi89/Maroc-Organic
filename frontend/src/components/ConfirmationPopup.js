// ConfirmPopup.js
import React from 'react';

// Composant pour afficher une fenêtre contextuelle de confirmation
const ConfirmPopup = ({ show, title, message, onConfirm, onCancel }) => {
    // Si la fenêtre contextuelle n'est pas affichée, ne rien rendre
    if (!show) return null;

    // Retourne le composant de la fenêtre contextuelle avec le titre, le message et les boutons de confirmation et d'annulation
    return (
        <div className="popup">
            <div className="popup-content">
                {/* Titre de la fenêtre contextuelle */}
                <h2>{title}</h2>
                {/* Message de la fenêtre contextuelle */}
                <p>{message}</p>
                {/* Bouton pour confirmer l'action */}
                <button onClick={onConfirm}>Confirmer</button>
                {/* Bouton pour annuler l'action */}
                <button onClick={onCancel}>Annuler</button>
            </div>
        </div>
    );
};

export default ConfirmPopup;
