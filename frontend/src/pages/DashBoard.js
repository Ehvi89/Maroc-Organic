import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../components/AuthContext";
import { useFunctions } from "../components/SharedContext";
import CreateUser from "../components/CreateUser";
import ConfirmPopup from "../components/ConfirmationPopup";
import ChangePassword from "../components/changePassword";

const Dashboard = styled.div`
    position: relative;
    width:  90%;
    height: auto;
    border-radius: 5px;
    margin: 100px auto;

    @media screen and (max-width: 820px){
        margin: auto;
    }
`;

const Conteneur = styled.div`
    width: 100%;
    border-radius: 15px;
    
    @media screen and (max-width: 820px){
        text-align: center;
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: space-evenly;
        margin: auto;
    }
`;
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1002;
`;

function DashBoard({ onClose }) {
    const [surveyData, setSurveyData] = useState([]);
    const [showModificationForm, setShowModificationForm] = useState(false);
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const { authToken, user } = useAuth();


    useEffect(() => {
        fetch(`http://localhost:5000/api/users`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Convertit le corps de la réponse en JSON
            })
            .then((apiResponse) => {
                // Utilisez directement apiResponse si c'est déjà un tableau d'objets
                setSurveyData(apiResponse);
                //console.log(surveyData)
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }, [authToken])

    const { handleUpdateUser } = useFunctions();

    const handleOverlayClick = () => {
        setShowModificationForm(false);
    };
    const toggleModificationForm = () => {
        setShowModificationForm(!showModificationForm);
    };

    const toggleCreateUserForm = () => {
        setShowCreateUserForm(!showCreateUserForm);
    };

    const [hoveredRowId, setHoveredRowId] = useState(null);
    const { handleConfirm, handleCancel, showPopup, setShowPopup } = useFunctions();

    const handleRowMouseEnter = (id) => {
        setHoveredRowId(id);
    };

    const handleRowMouseLeave = () => {
        if (showPopup === false){
            setHoveredRowId(null);
        }
    };


    const handleDeleteClick = async () => {
        setShowPopup(true)
    };

    return (
        <>
            <Dashboard>
                <Conteneur>
                    <div className={'adminInformation'}>
                        <div>
                            <label>Nom :</label>
                            <p>{user && user.name}</p>
                        </div>
                        <div>
                            <label>E-mail :</label>
                            <p>{user && user.email}</p>
                        </div>
                        <button onClick={toggleModificationForm} style={{padding:'10px 15px', background:'#8fb570', borderRadius:'10px'}}>Changer de mot de passe</button>
                    </div>
                    <div className={'conteneurTable'}>
                        <table className={'dashboard'}>
                            <thead>
                            <tr>
                                <th>Nom</th>
                                <th>E-mail</th>
                                <th>Dernière connexion</th>
                                <th>Dernière action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {surveyData.map((row, index) => (
                                <tr
                                    key={row._id || index}
                                    onMouseEnter={() => handleRowMouseEnter(row._id)}
                                    onMouseLeave={handleRowMouseLeave}
                                    onClick={() => handleDeleteClick(row._id)}
                                    style={{cursor: 'pointer'}}
                                >
                                    {hoveredRowId === row._id ? (
                                        <>
                                            <td colSpan="4" style={{
                                                position: 'relative',
                                                zIndex: 1,
                                                backgroundColor: 'rgba(213,  53,  65,  0.85)',
                                                borderRadius: '5px',
                                                width: '100% '
                                            }}>
                                            <span style={{
                                                position: 'absolute',
                                                top: '0%',
                                                left: '0',// Positionnement du texte "Supprimer" au-dessus de la ligne
                                                width: '100%',
                                                height: '100%',
                                                textAlign: 'center',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                                color: 'white',
                                            }}>
                                                Supprimer
                                            </span>
                                                <div style={{
                                                    position: 'relative',
                                                    display: "flex",
                                                    justifyContent: "space-evenly",
                                                    zIndex: 0
                                                }}>
                                                    <td style={{color: 'rgba(0, 0, 0, 0.2)'}}>{row.name}</td>
                                                    <td style={{color: 'rgba(0, 0, 0, 0.2)'}}>{row.email}</td>
                                                    <td style={{color: 'rgba(0, 0, 0, 0.2)'}}>{new Date(row.lastLogin).toLocaleString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: false
                                                    })}
                                                    </td>
                                                    <td style={{color: 'rgba(0, 0, 0, 0.2)'}}>{row.lastAction}</td>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{row.name}</td>
                                            <td>{row.email}</td>
                                            <td>
                                                {new Date(row.lastLogin).toLocaleString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: false
                                                })}
                                            </td>

                                            <td>{row.lastAction}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={toggleCreateUserForm} className={'editButton'}>Ajouter un utilisateur</button>
                </Conteneur>
            </Dashboard>
            <>
                {showModificationForm && (
                    <ChangePassword onClose={handleOverlayClick}/>
                )}
                <ConfirmPopup
                    show={showPopup}
                    title="Supprimer l'utilisateur"
                    message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
                    onConfirm={() => handleConfirm('user', hoveredRowId)}
                    onCancel={() => {
                        handleCancel();
                        setHoveredRowId(null); // Réinitialisez l'ID de la ligne survolée
                    }}
                />
                {showCreateUserForm && <CreateUser onClose={() => setShowCreateUserForm(false)}/>}
            </>
        </>
    );
}

export default DashBoard;
