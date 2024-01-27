

function OrderPayementTracking(){
    return(
        <div>
            <div id={"filter"}>
                date
                ville
                mode de paiement
            </div>
            date
            nom de l'etablissement
            ville
            montant
            confirmation du paiement
            <div id={'mode de paiement'}>
                num de transaction
                virement
                espèce
                <div id={'chèque'}>
                    num du chèque
                    date de reecption
                    date d'écheance
                    date depot du chèque à la banque
                </div>
            </div>
            lettre de change
            num de suivi logiphar
            num facture
            termes du paiement
            creception de la commande
            nombre de colis + presentoire de la commande
            <textarea placeholder={"commentaire"}/>
        </div>
    )
}

export default OrderPayementTracking