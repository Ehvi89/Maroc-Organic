import styled from 'styled-components'
import {Link} from 'react-router-dom'
import ReactTooltip from 'react-tooltip';

const Filter = styled.select`
    padding: 10px 15px;
  border-radius: 10px;
  margin: 50px;
  right: 0 !important;  
`

const Rapport = styled.div`
    padding: 10px 15px;
  border-radius: 5px;
  width: 150px;
  margin: 5px;
`

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

const colorMap = {
    "ben": "yellow",
    "ali": "orange",
    "jean": "red"
};

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
function PlanningVisits(){
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]
    const heures = ["09h00", "09h30", "10h00", "10h30", "11h00", "11h30", "12h00", "12h30", "14h00", "14h30"];

    return (
        <div>
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <Filter>
                    {weeks.map((week, index) => (
                        <option key={index}>{ week.week }</option>
                    ))}
                </Filter>
                <button id={"btn"} style={{margin: "50px"}}>
                    <Link to={"/addReport"}>Ajouter rapport</Link>
                </button>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Heure</th>
                    <th>Ville</th>
                    {jours.map(jour => <th key={jour}>{jour}</th>)}
                </tr>
                </thead>
                <tbody>
                {heures.map((heure, index) => {
                    const elementsHeure = elements.filter(element => element.heure === heure);
                    const villes = [...new Set(elementsHeure.map(element => element.ville))];

                    return (
                        <tr key={heure} style={{backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2'}}>
                            <td>{heure}</td>
                            <td>{villes.join(', ')}</td>
                            {jours.map(jour => {
                                const responsables = elementsHeure.filter(element => element.jour.toLowerCase() === jour.toLowerCase());
                                return <td key={jour}>{responsables.map((responsable, index) =>
                                    <Rapport key={index} data-tip data-for={`${responsable.responsable}-tooltip`} style={{backgroundColor: colorMap[responsable.responsable.toLowerCase()]}}>
                                        {responsable.responsable}
                                        <ReactTooltip id={`${responsable.responsable}-tooltip`} place="top" effect="solid">
                                            <span>Informations sur {responsable.responsable}</span>
                                        </ReactTooltip>
                                    </Rapport>
                                )}</td>;
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}


export default PlanningVisits;