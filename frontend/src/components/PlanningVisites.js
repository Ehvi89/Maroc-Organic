// Import necessary modules
import {Link} from 'react-router-dom'
import {useState} from "react";
import styled, { keyframes } from 'styled-components'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

// Define keyframes for rotation
const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`

// Define styled components
export const Loader = styled.div`
    padding: 10px;
    border: 6px solid #8FB570;
    border-bottom-color: transparent;
    border-radius: 22px;
    animation: ${rotate} 1s infinite linear;
    height: 0;
    width: 0;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`

const Filter = styled.select`
    padding: 10px 15px;
    border-radius: 10px;
    margin: auto;
    right: 0 !important;
`

// Data arrays
const elements = [
    { ville: "Casa", heure: "10h30", jour: "lundi", responsable: "ben" },
    { ville: "Casa", heure: "10h30", jour: "lundi", responsable: "Jean" },
    { ville: "Casa", heure: "10h30", jour: "Mercredi", responsable: "Ali" },
    { ville: "Casa", heure: "14h00", jour: "Mardi", responsable: "ben" },
    { ville: "Casa", heure: "10h00", jour: "Jeudi", responsable: "ben" },
    { ville: "Casa", heure: "14h30", jour: "lundi", responsable: "Jean" },
    { ville: "Casa", heure: "14h30", jour: "lundi", responsable: "Ali" },
    { ville: "Sale", heure: "10h30", jour: "Mardi", responsable: "Jean" },
    { ville: "Rabat", heure: "09h00", jour: "Vendredi", responsable: "Ali" }
];

const weeks = [
    { week: "14/01/2023 - 17/01/2023" },
    { week: "20/01/2023 - 24/01/2023" },
    { week: "27/01/2023 - 31/01/2023" },
    { week: "03/02/2023 - 07/02/2023" },
    { week: "10/02/2023 - 14/02/2023" },
    { week: "17/01/2023 - 21/02/2023" },
    { week: "24/02/2023 - 28/02/2023" },
    { week: "03/03/2023 - 07/03/2023" },
    { week: "10/03/2023 - 14/03/2023" },
    { week: "17/03/2023 - 21/03/2023" },
    { week: "24/03/2023 - 28/03/2023" },
    { week: "31/03/2023 - 03/04/2023" },
]

// Component to show report information
function ShowRepport({ responsable }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} >
            {responsable}
            {showTooltip && <div className="tooltip">
                <div>
                    Nom:
                </div>
                <div>
                    Type:
                </div>
                <div>
                    Ville:
                </div>
                <div>
                    heure:
                </div>
                <div>
                    Durée:
                </div>
                <div>
                    Déjà client:
                </div>
                <div>
                    Personne:
                </div>
                <div>
                    Marque concurente
                </div>
            </div>}
        </div>
    );
}

// Main component
function PlanningVisits(){
    const [isDataLoading, setDataLoading] = useState(false)
    const [surveyData, setSurveyData] = useState({})

    // Uncomment the following block to fetch data from server
    /*useEffect(() => {
        setDataLoading(true)
        fetch(`http://localhost:8000/survey`)
            .then((response) => response.json())
            .then(({ surveyData }) => {
                setSurveyData(surveyData)
                setDataLoading(false)
            })
    }, [])*/

    const [editMode, setEditMode] = useState({});
    const [currentInfo, setCurrentInfo] = useState({});

    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]
    const heures = ["09h00", "09h30", "10h00", "10h30", "11h00", "11h30", "12h00", "12h30", "14h00", "14h30"];

    return (
        <div>
            {isDataLoading ? (
                <Loader />
            ) : (
                <div>
                    <div style={{display: "flex"}}>
                        <button className="responsive-button" id={'btn'} style={{margin: "50px auto"}}>
                            <Link to={"/addReport"}><FontAwesomeIcon icon={faPlus} /></Link>
                            <span><Link to={"/addReport"}>Ajouter rapport</Link></span>
                        </button>
                        <Filter>
                            {weeks.map((week, index) => (
                                <option key={index}>{week.week}</option>
                            ))}
                        </Filter>
                    </div>

                    <div className={"conteneurTable"}>
                        <table>
                            <thead>
                            <tr>
                                <th>Heure</th>
                                {jours.map(jour => <th key={jour}>{jour}</th>)}
                            </tr>
                            </thead>
                            <tbody>
                            {heures.map((heure, index) => {
                                const elementsHeure = elements.filter(element => element.heure === heure);

                                return (
                                    <tr key={heure} style={{backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2'}}>
                                        <td>{heure}</td>
                                        {jours.map(jour => {
                                            const responsables = elementsHeure.filter(element => element.jour.toLowerCase() === jour.toLowerCase());
                                            return <td key={jour}>{responsables.map((responsable, index) =>
                                                <div className={"cellule"}>
                                                    <ShowRepport key={index}
                                                                 responsable={responsable.responsable.toUpperCase()}/>
                                                </div>
                                            )}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// Export PlanningVisits component
export default PlanningVisits;
