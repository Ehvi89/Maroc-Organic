// Importation des modules nécessaires
import { Link } from "react-router-dom";
import styled from 'styled-components';

// Définition des composants styled
const StyledInfo = styled.h1`
    font-size: 60px;
    text-align: center;
  margin: 30px;
    width: 100%;
    
    @media screen and (max-width: 820px){
        font-size: 40px;        
    }
`
const StyledDiv = styled.div`
    display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin: 10%;
`
const StyledLink = styled(Link)`
    color: #E73541;
`

// Composant pour afficher un message d'erreur lorsque la page demandée n'existe pas
function Error() {
    return (
        <StyledDiv>
            <StyledInfo>Cette page n'existe pas</StyledInfo>
            <p>Retourner à la page d'<StyledLink to="/">Accueil</StyledLink></p>
        </StyledDiv>
    );
}

// Exportation du composant Error
export default Error;