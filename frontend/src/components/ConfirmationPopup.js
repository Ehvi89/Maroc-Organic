// ConfirmPopup.js
import React from 'react';

const ConfirmPopup = ({ show, title, message, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <button onClick={onConfirm}>Confirmer</button>
                <button onClick={onCancel}>Annuler</button>
            </div>
        </div>
    );
};

export default ConfirmPopup;
