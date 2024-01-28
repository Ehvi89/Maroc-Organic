import styled from "styled-components";

const Row = styled.div`
    display: flex;
    width: 70%;
    margin: auto;
    justify-content: space-evenly;
`

const Elmt = styled.div`
    display: flex;
    flex-direction: column;
    width: auto;
    padding: 5px;
    background-color: rgba(255, 255, 255, 0.5);
    //background-color: rgba(151, 181, 111, 0.2);
    border-radius: 10px;
    margin: 15px;
`

function AddReport(){
    return(
        <div>
            <form>
                <Row>
                    <Elmt>
                        <label htmlFor={'client'}>Nom du client</label>
                        <input type={"text"} id={"client"} placeholder={"Nom du client"}/>
                    </Elmt>
                    <Elmt>
                        <label>Type</label>
                        <select>
                            <option>Pharmacie</option>
                            <option>Parapharmacie</option>
                            <option>Epicerie fine</option>
                        </select>
                    </Elmt>
                </Row>
                <Row>
                    <Elmt>
                        <label htmlFor={"hour"}>Heure de la visite</label>
                        <input type={"time"} name={"hour"}/>
                    </Elmt>
                    <Elmt>
                        <label htmlFor={"time"}>Durée de la visite</label>
                        <input type={"number"} name={"time"} placeholder={"min"}/>
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
                <textarea placeholder={"compte rendu"}/>
                <div>
                    <label htmlFor={"whatsapp"}>Numéro Whatsapp</label>
                    <input type={"checkbox"} id={"whatsapp"} name={"whatsapp"}/>
                </div>
                <Row>
                    <Elmt>
                        <label>Nom du contact</label>
                        <input type={"text"} placeholder={"Conctact"}/>
                    </Elmt>
                    <Elmt>
                        <label>Numéro</label>
                        <input type={"number"} placeholder={"Numéro"}/>
                    </Elmt>
                </Row>

                <div>
                    <label>Contact MAROC ORGANIC entré dans le téléphone du client</label>
                    <label htmlFor={"contactEntréChezClient"}>Oui</label>
                    <input type={"radio"} name={"contactEntréChezClient"}/>
                    <label htmlFor={"contactEntréChezClient"}>non</label>
                    <input type={"radio"} name={"contactEntréChezClient"} defaultChecked={true}/>
                </div>

                <label htmlFor={"follow"}>Client a follow sur Instagram</label>
                <select id={"follow"}>
                    <option>Non</option>
                    <option>Oui</option>
                </select>
            </form>
        </div>
    )
}

export default AddReport