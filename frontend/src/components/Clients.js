
function Clients(){
    return(
        <div>
            <div>
                AddClient
            </div>
            <div id={"filter"}>
                All
                Catégorie
                ville
            </div>
            <div>
                nom
                categorie
                ville
                client dragon
                <div id={'catalogue'}>
                    catalogue
                    envoyé via
                    date d'envoi
                </div>
                <div id={'contact'}>
                    fixe
                    whatsapp
                    nom du contact
                    fonction
                </div>
                <p>email</p>
                <textarea placeholder={"Commentaire"}/>
            </div>
        </div>
    );
}

export default Clients;