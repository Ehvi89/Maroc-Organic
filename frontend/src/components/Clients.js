import {useState} from "react";
import styled from "styled-components";

const Checkbox = styled.input.attrs({type: 'checkbox'})`
    margin: 10px;
`;
const Filter = styled.div`
    padding: 10px 15px;
  border-radius: 10px;
  margin: 50px;
`
const data = [
    {
        "nom": "ADDOHA",
        "categorie": "Pharmacie",
        "ville": "Casablanca",
        "clientDragon": "non",
        "catalogue": "",
        "envoyeVia": "",
        "dateEnvoi": "",
        "fixe": "0522259669",
        "whatsappa": "",
        "nomContact": "",
        "fonction": "",
        "email": "",
        "commentaire": ""
    },
    {
        "nom": "EPICERIE M",
        "categorie": "Epicerie fine",
        "ville": "Casablanca",
        "clientDragon": "oui",
        "catalogue": "Dragon",
        "envoyeVia": "whatsapp",
        "dateEnvoi": "05/05/2022",
        "fixe": "",
        "whatsappa": "0644834834",
        "nomContact": "",
        "fonction": "",
        "email": "",
        "commentaire": "a demandé un dépôt de vente"
    },
    {
        "nom": "PARA DU CHATEAU",
        "categorie": "Parapharmacie",
        "ville": "Dar Bouazza",
        "clientDragon": "non",
        "catalogue": "Dragon",
        "envoyeVia": "whatsapp",
        "dateEnvoi": "09/23/2021",
        "fixe": "0522292978",
        "whatsappa": "0663490084",
        "nomContact": "Asmaa",
        "fonction": "",
        "email": "",
        "commentaire": ""
    },
    {
        "nom": "ETOILE BEAUTE",
        "categorie": "Parapharmacie",
        "ville": "Irfane",
        "clientDragon": "non",
        "catalogue": "Dragon, Emblica-je suis bio",
        "envoyeVia": "whatsapp, whatsapp",
        "dateEnvoi": "09/22/2021, 14/09/2022",
        "fixe": "0535566705",
        "whatsappa": "0650165017",
        "nomContact": "Mme NEZHA",
        "fonction": "",
        "email": "",
        "commentaire": ""
    }
];


function ShowCatalogueInformations({ catalogue, envoyeVia, dateEnvoi }) {
    const [showTooltip, setShowTooltip] = useState(false);

    // Créer des tableaux pour chaque indice
    const cataloguesArray = catalogue !== "" ? catalogue.split(',').map(c => c.trim()) : [];
    const envoyesViaArray = envoyeVia !== "" ? envoyeVia.split(',').map(e => e.trim()) : [];
    const datesEnvoiArray = dateEnvoi !== "" ? dateEnvoi.split(',').map(d => d.trim()) : [];

    // Assurez-vous que les tableaux ont la même longueur
    const maxLength = Math.max(cataloguesArray.length, envoyesViaArray.length, datesEnvoiArray.length);
    if (cataloguesArray.length < maxLength) cataloguesArray.push(...new Array(maxLength - cataloguesArray.length).fill(''));
    if (envoyesViaArray.length < maxLength) envoyesViaArray.push(...new Array(maxLength - envoyesViaArray.length).fill(''));
    if (datesEnvoiArray.length < maxLength) datesEnvoiArray.push(...new Array(maxLength - datesEnvoiArray.length).fill(''));

    // Créez un tableau pour chaque ensemble de données
    const dataArray = Array.from({ length: maxLength }, (_, index) => ({
        catalogue: cataloguesArray[index],
        envoyeVia: envoyesViaArray[index],
        dateEnvoi: datesEnvoiArray[index]
    }));

    return (
        <div>
            {dataArray.map(({ catalogue, envoyeVia, dateEnvoi  }, index) => (
                <div key={index} className={"clientShowToolTip"} onMouseEnter={() => setShowTooltip(true)}
                     onMouseLeave={() => setShowTooltip(false)}>
                    <p>{catalogue}</p>
                    {showTooltip && <div className="tooltip">
                        <div>
                            {envoyeVia && <div>Envoyé via: {envoyeVia}</div>}
                            {dateEnvoi && <div>Envoyé le: {dateEnvoi}</div>}
                        </div>
                    </div>}
                </div>
            ))}
        </div>
        );
}


function ShowContactInformations({fixe, whatsapp, nomContact, fonction}) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            Contact
            {showTooltip && <div className="tooltip">
                {fixe !== "" && (<div>
                    Fixe: {fixe}
                </div>)}
                {whatsapp !== "" && (<div>
                    Whatsapp: {whatsapp}
                </div>)}
                {nomContact !== "" && (<div>
                    Nom: {nomContact}
                </div>)}
                { fonction !== "" && (<div>
                    Fonction: {fonction}
                </div>)}
            </div>}
        </div>
    );
}

function Clients(){
    const uniqueVilles = [...new Set(data.map(row => row.ville))];
    const uniqueCategories = [...new Set(data.map(row => row.categorie))];

    const [selectedVilles, setSelectedVilles] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const filteredData = data.filter(row => selectedVilles.length === 0 || selectedVilles.includes(row.ville))
        .filter(row => selectedCategories.length === 0 || selectedCategories.includes(row.categorie));

    return(
        <div>
            <div style={{display:"flex", justifyContent:'space-between'}}>
                <Filter className={"orderPayementFilter"}>
                    <button onClick={() => setShowFilters(!showFilters)}>Filtres</button>
                    {showFilters && (
                        <div>
                            <div className={"categorie"}>
                                <p>Ville:</p>
                                {uniqueVilles.map(ville => (
                                    <div key={ville}>
                                        <label for={ville}>{ville}</label>
                                        <Checkbox id={ville} value={ville} checked={selectedVilles.includes(ville)}
                                                  onChange={() => setSelectedVilles(prev => prev.includes(ville) ? prev.filter(v => v !== ville) : [...prev, ville])}/>
                                    </div>
                                ))}
                            </div>
                            <div className={"categorie"}>
                                <p>Categorie:</p>
                                {uniqueCategories.map(categorie => (
                                    <div key={categorie}>
                                        <label for={categorie}>{categorie}</label>
                                        <Checkbox id={categorie} value={categorie}
                                                  checked={selectedCategories.includes(categorie)}
                                                  onChange={() => setSelectedCategories(prev => prev.includes(categorie) ? prev.filter(m => m !== categorie) : [...prev, categorie])}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Filter>

                <button id={"btn"} style={{margin: '50px', padding:'10px 15px'}}>
                    Ajouter client
                </button>
            </div>

            <div className={"conteneurTable"}>
                <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Categorie</th>
                        <th>Ville</th>
                        <th>Client dragon</th>
                        <th>Catalogue</th>
                        <th>Contact</th>
                        <th>email</th>
                        <th>Commentaire</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((row, index) => (
                        <tr>
                            <td>
                                <div className={"cellule"}>{row.nom}</div>
                            </td>
                            <td>
                                <div className={"cellule"}>{row.categorie}</div>
                            </td>
                            <td>
                                <div className={"cellule"}>{row.ville}</div>
                            </td>
                            <td>
                                <div className={"cellule"}>{row.clientDragon}</div>
                            </td>
                            <td>
                                <div className={"cellule"}>
                                    <ShowCatalogueInformations catalogue={row.catalogue}
                                                               envoyeVia={row.envoyeVia}
                                                               dateEnvoi={row.dateEnvoi}/>
                                </div>
                            </td>
                            <td>
                                <div className={"cellule"}>
                                    <ShowContactInformations fixe={row.fixe}
                                                             whatsapp={row.whatsappa}
                                                             nomContact={row.nomContact}
                                                             fonction={row.fonction}/>
                                </div>
                            </td>
                            <td>
                                <div className={"cellule"}>{row.email}</div>
                            </td>
                            <td>
                                <div className={"cellule"}>{row.Commentaire}</div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Clients;