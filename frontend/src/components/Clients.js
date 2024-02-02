import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Loader } from "./PlanningVisites";

// Define styled components
const Checkbox = styled.input.attrs({ type: 'checkbox' })`
    margin: 10px;
`;
const Filter = styled.div`
    padding: 10px 15px;
    border-radius: 10px;
    margin: auto;
`;

// Component to show catalogue
function ShowCatalogueInformations({ catalogue }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div>
            {catalogue.map((item, index) => (
                <div key={index} className={"clientShowToolTip"} onMouseEnter={() => setShowTooltip(true)}
                     onMouseLeave={() => setShowTooltip(false)}>
                    <p>{item.name}</p>
                    {showTooltip && <div className="tooltip">
                        <div>
                            {item.sentBy && <div>Envoyé via: {item.sentBy}</div>}
                            {item.sentDate && <div>Envoyé le: {item.sentDate}</div>}
                        </div>
                    </div>}
                </div>
            ))}
        </div>
    );
}

// Component to show contact informations
function ShowContactInformations({ contact }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            Contact
            {showTooltip && <div className="tooltip">
                {contact.fixe !== "" && (<div>Fixe: {contact.fixe}</div>)}
                {contact.whatsapp !== "" && (<div>Whatsapp: {contact.whatsapp}</div>)}
                {contact.name !== "" && (<div>Nom: {contact.name}</div>)}
            </div>}
        </div>
    );
}

// Main component
function Clients() {
    const [isDataLoading, setDataLoading] = useState(false);
    const [surveyData, setSurveyData] = useState([]); // Initialisez avec un tableau vide
    const [pageNumber, setPageNumber] = useState(1); // État pour suivre la page actuelle
    const itemsPerPage = 10; // Nombre d'éléments par page

    useEffect(() => {
        setDataLoading(true);
        fetch(`http://localhost:5000/api/client?page=${pageNumber}&limit=${itemsPerPage}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((apiResponse) => {
                // Extraire les données de l'API
                const data = apiResponse.docs;
                // Concaténez les nouvelles données avec celles existantes
                setSurveyData(prevData => [...data]);
                setDataLoading(false);
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
                setDataLoading(false);
            });
    }, [pageNumber]); // Dépendance de l'effet sur pageNumber

    // Logique pour charger plus de données (par exemple, lorsqu'un bouton "Load More" est cliqué)
    const loadMoreData = () => {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
    };

    console.log(surveyData)

    const uniqueVilles = [...new Set(surveyData.map(row => row.city))];
    const uniqueCategories = [...new Set(surveyData.map(row => row.category))];

    const [selectedVilles, setSelectedVilles] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const filteredData = surveyData.filter(row => selectedVilles.length === 0 || selectedVilles.includes(row.city))
        .filter(row => selectedCategories.length === 0 || selectedCategories.includes(row.category));

    return(
        <div>
            {isDataLoading ? (
                <Loader />
            ) : (
                <div>
                    <div style={{display: "flex", alignItems: 'center', margin: "auto"}}>
                        <Filter className={"orderPayementFilter"}>
                            <button onClick={() => setShowFilters(!showFilters)}>Filtres</button>
                            {showFilters && (
                                <button style={{background: '#E73541'}} onClick={() => {
                                    setSelectedCategories([]);
                                    setSelectedVilles([]);
                                }}>Effacer
                                </button>
                            )}

                            {showFilters && (
                                <div>
                                    <div className={"categorie"}>
                                        <p>Ville:</p>
                                        {uniqueVilles.map(ville => (
                                            <div key={ville}>
                                                <label htmlFor={ville}>{ville}</label>
                                                <Checkbox id={ville} value={ville}
                                                          checked={selectedVilles.includes(ville)}
                                                          onChange={() => setSelectedVilles(prev => prev.includes(ville) ? prev.filter(v => v !== ville) : [...prev, ville])}/>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={"categorie"}>
                                        <p>Categorie:
                                        </p>
                                        {uniqueCategories.map(categorie => (
                                            <div key={categorie}>
                                                <label htmlFor={categorie}>{categorie}</label>
                                                <Checkbox id={categorie} value={categorie}
                                                          checked={selectedCategories.includes(categorie)}
                                                          onChange={() => setSelectedCategories(prev => prev.includes(categorie) ? prev.filter(m => m !== categorie) : [...prev, categorie])}/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Filter>

                        <button className="responsive-button" id={'btn'} style={{margin: "50px auto"}}>
                            <Link to={"/addClients"}><FontAwesomeIcon icon={faPlus}/></Link>
                            <span><Link to={"/addClients"}>Ajouter un client</Link></span>
                        </button>
                    </div>

                    <div className={"conteneurTable"}>
                        <table>
                            <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Categorie</th>
                                <th>Ville</th>
                                <th>Client</th>
                                <th>Catalogue</th>
                                <th>Contact</th>
                                <th>email</th>
                                <th>Commentaire</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredData.map((row, index) => (
                                <tr key={index} style={{backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2'}}>
                                    <td className={'cellule'}>{row.client}</td>
                                    <td className={'cellule'}>{row.category}</td>
                                    <td className={'cellule'}>{row.city}</td>
                                    <td className={'cellule'}>{row.type}</td>
                                    <td className={'cellule'}>
                                        <ShowCatalogueInformations catalogue={row.catalogue}/>
                                    </td>
                                    <td className={'cellule'}>
                                        <ShowContactInformations contact={row.contact}/>
                                    </td>
                                    <td className={'cellule'}>{row.contact.email}</td>
                                    <td className={'cellule'}>{row.comment}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={loadMoreData}>Load More</button>
                </div>
            )}
        </div>
    );
}

export default Clients;
