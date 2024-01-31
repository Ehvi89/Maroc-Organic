function Banner(){
    return(
        <div className={'conteneurBanner'}>
            <div className={"squareLeftTop"}>
                <div className={'circle'}></div>
            </div>
            <div className={"squareCenterRight"}></div>
            <div className={'text'}>
                <div className={"paragraph"}>
                    <p style={{color: '#E73541'}}>MAROC ORGANIC</p>
                    <p style={{color: '#8FB570'}}>&nbsp;distributeur #1 au Maroc de produits naturels et bio</p>
                </div>
                <br/>
                <h1>Outils de gestion des ventes et de suivi des clients</h1>
            </div>
            <div className={"squareRightBottom"}></div>
        </div>
    )
}

export default Banner