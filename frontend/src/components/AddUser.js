
function AddUser(){
    return(
        <div>
            <h2>Ajouter un utilisateur</h2>
            <form>
                <input type={"email"} placeholder={"E-mail"}/>
                <input type={'password'} placeholder={"Mot de passe"}/>
                <select>
                    <option>Administrateur</option>
                    <option>Employé(e)</option>
                    <option>Stagiaire</option>
                </select>
            </form>
        </div>
    )
}

export default AddUser