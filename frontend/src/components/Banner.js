function Banner() {
    // Retourne le composant Banner avec une structure de divs imbriquées
    return (
        <div className="conteneurBanner">
            {/* Div pour le coin supérieur gauche avec un cercle */}
            <div className="squareLeftTop">
                <div className="circle"></div>
            </div>
            {/* Div pour le côté droit du banner */}
            <div className="squareCenterRight"></div>
            {/* Div pour le texte du banner */}
            <div className="text">
                {/* Paragraphes pour le titre et la description */}
                <div className="paragraph">
                    <p className="marocOrganicText">MAROC ORGANIC</p>
                    <p className="distributorText">&nbsp;distributeur #1 au Maroc de produits naturels et bio</p>
                </div>
                {/* Titre principal du banner */}
                <h1>Outils de gestion des ventes et de suivi des clients</h1>
            </div>
            {/* Div pour le coin inférieur droit du banner */}
            <div className="squareRightBottom"></div>
        </div>
    );
}

export default Banner;
