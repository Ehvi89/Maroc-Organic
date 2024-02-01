import styled from "styled-components";

// Define styled components
const Row = styled.div`
    display: flex;
    width: 80%;
    margin: auto;
    justify-content: center;
`;

const Elmt = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 5px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    margin: 15px;
    color: #F4F5F5;
`;

// Main component
function AddReport() {
    return (
        <div style={{
            background: "#8FB570",
            width: '80%',
            margin: '50px auto',
            display: 'flex',
            borderRadius: "30px",
            overflow: 'hidden'
        }}>
            <form style={{width: "58%"}} className={'AddReportForm'}>
                <Row><h1>Ajouter un rapport de visite</h1></Row>
                <Row>
                    <Elmt>
                        <label htmlFor={'client'}>Nom du client</label>
                        <input type={"text"} id={"client"} placeholder={"Nom du client"} required={true}/>
                    </Elmt>
                    <Elmt>
                        <label>Type</label>
                        <select required={true}>
                            <option>Pharmacie</option>
                            <option>Parapharmacie</option>
                            <option>Epicerie fine</option>
                        </select>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={"hour"}>Heure de la visite</label>
                        <input type={"time"} name={"hour"} required={true}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={"time"}>Durée de la visite</label>
                        <input type={"number"} name={"time"} placeholder={"min"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Date</label>
                        <input type={"date"} required={true}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={"alreadyClient"}>Déja client ?</label>
                        <select id={"alreadyClient"}>
                            <option>Non</option>
                            <option>Oui</option>
                        </select>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Personne rencontrée</label>
                        <input type={"text"} placeholder={"Persone rencontréé"}/>
                    </Elmt>
                    <Elmt>
                        <label>Marques concurente</label>
                        <input type={"text"} placeholder={"Marque Concurente"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Compte rendu</label>
                        <textarea placeholder={"compte rendu"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Nom du contact</label>
                        <input type={"text"} placeholder={"Contact"}/>
                    </Elmt>
                    <Elmt>
                        <label>Numéro</label>
                        <input type={"number"} placeholder={"Numéro whatsapp"}/>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label>Contact MAROC ORGANIC entré dans le téléphone du client</label>
                        <select id={"follow"}>
                            <option>Non</option>
                            <option>Oui</option>
                        </select>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={"follow"}>Client a follow sur Instagram</label>
                        <select id={"follow"}>
                            <option>Non</option>
                            <option>Oui</option>
                        </select>
                    </Elmt>
                </Row>
                <Row>
                    <input type={"submit"} value={"Enregistrer"}/>
                </Row>
            </form>
            <div className={"image"} style={{width: "42%", overflow: 'hidden'}}></div>
        </div>
    );
}

export default AddReport;