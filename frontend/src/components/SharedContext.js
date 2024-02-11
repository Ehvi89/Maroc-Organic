// UserContext.js
import React, { useState, useContext } from 'react';
import {useAuth} from "./AuthContext";

const SharedContext = React.createContext();

export const FunctionProvider = ({ children }) => {
    const { authToken, user } = useAuth();

    const [clickStartTime, setClickStartTime] = useState(null);
    const [lineToDelete, setLineToDelete] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [timerId, setTimerId] = useState(null);

    const deleteRow = async (id, way, authToken) => {
        try {
            const response = await fetch(`http://localhost:5000/api/${way}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({userEmail: user.email})
            });

            if (!response.ok) {
                const errorMessage = await response.text(); // Obtenez le message d'erreur du serveur
                throw new Error(`Failed to delete row: ${errorMessage}`);
            } else {
                console.log('Command deleted successfully');
                // Refresh the page after successful deletion
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };

    const handleMouseDown = (event, id) => {
        event.persist();
        setClickStartTime(Date.now());
        setLineToDelete(id);

        const timerId = setTimeout(() => {
            setShowPopup(true);
        },   500); //   0.5 seconds

        setTimerId(timerId);
    };

    const handleMouseUp = () => {
        clearTimeout(timerId);
        setShowPopup(false);
    };

    const handleConfirm = async (way, id) => {
        let rowId = lineToDelete;
        if (id) {
            rowId = id;
        }
        if (rowId) {
            await deleteRow(rowId, way, authToken);
            setShowPopup(false);
        }
    };

    const handleCancel = () => {
        setShowPopup(false);
    };

    const handleUpdateUser = (rawData) => {

        const data = {
            name: rawData.name,
            email: user.email,
            newPassword: rawData.newPassword,
        }

        try {
            fetch(`http://localhost:5000/api/user/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(data)
            }).then((response) => {
                console.log(`User update succesfuly: ${response}`)
            });
        }
        catch (error){
            console.error('Error updating data:', error)
        }
    };

    const export2excel = async (way) => {
        try {
            const response = await fetch(`http://localhost:5000/api/${way}/export2excel`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({userEmail: user.email})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Crée un blob à partir de la réponse
            const blob = await response.blob();

            // Crée un URL temporaire pour le blob
            const url = window.URL.createObjectURL(blob);

            // Crée un élément de lien temporaire
            const link = document.createElement('a');
            link.href = url;
            // Déterminez le nom du fichier à partir de la réponse ou définissez-le manuellement
            if (way === 'order'){
                link.setAttribute('download', 'SuiviCommandePaiementsMarocOrganic.xlsx');
            }
            else if (way === 'client'){
                link.setAttribute('download', 'ClientMarocOrganic.xlsx');
            }
            else if (way === 'report'){
                link.setAttribute('download', 'PlanningVisits.xlsx');
            }

            // Simule un clic sur le lien pour démarrer le téléchargement
            document.body.appendChild(link);
            link.click();

            // Supprime le lien après le téléchargement
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            },  100);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };


    // Provide the shared functions and data to child components
    return (
        <SharedContext.Provider value={{
            deleteRow,
            handleMouseDown,
            handleMouseUp,
            handleConfirm,
            handleCancel,
            handleUpdateUser,
            export2excel,
            showPopup,
            setShowPopup,
            lineToDelete
        }}>
            {children}
        </SharedContext.Provider>
    );
};

export const useFunctions = () => useContext(SharedContext);
