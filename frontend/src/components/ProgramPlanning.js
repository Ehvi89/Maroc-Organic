function ProgramPlanning(){
    return(
        <div>
            <button>Ajouter un établissement</button>
            <form>
                <input type={"text"} placeholder={"Nom"}/>
                <input type={"text"} placeholder={"Ville"}/>
                <select>
                    <option>Type</option>
                    <option>Pharmacie</option>
                    <option>Parapharmacie</option>
                    <option>Epicerie fine</option>
                </select>
            </form>
        </div>
    )
}

export default ProgramPlanning