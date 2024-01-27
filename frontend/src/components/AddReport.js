function AddReport(){
    return(
        <div>
            <form>
                <input type={"text"} placeholder={"Nom du client"}/>
                <select>
                    <option>Type</option>
                    <option>Pharmacie</option>
                    <option>Parapharmacie</option>
                    <option>Epicerie fine</option>
                </select>
                <label for={"hour"}>Heure de la visite</label>
                <input type={"time"} name={"hour"}/>

                <label for={"time"}>Durée de la visite</label>
                <input type={"number"} name={"time"} placeholder={"min"}/>

                <label for={"alreadyClient"}>Déja client ?</label>
                <select id={"alreadyClient"}>
                    <option>Non</option>
                    <option>Oui</option>
                </select>

                <input type={"text"} placeholder={"Persone"}/>
                <input type={"text"} placeholder={"Marque Concurente"}/>
                <textarea placeholder={"compte rendu"}/>
                <label for={"whatsapp"}>Numéro Whatsapp</label>
                <input type={"checkbox"} id={"whatsapp"} name={"whatsapp"}/>
                <input type={"text"} placeholder={"Conctact"}/>
                <input type={"number"} placeholder={"Numéro"}/>

                <label>Contact MAROC ORGANIC entré dans le téléphone du client</label>
                <label for={"contactEntréChezClient"}>Oui</label>
                <input type={"radio"} name={"contactEntréChezClient"}/>
                <label for={"contactEntréChezClient"}>non</label>
                <input type={"radio"} name={"contactEntréChezClient"} defaultChecked={true}/>

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