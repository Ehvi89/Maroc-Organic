import {Link} from "react-router-dom";
import styled from 'styled-components'

const StyledInfo = styled.h1`
    font-size: 60px;
    text-align: center;
  margin: 30px;
    width: 100%;
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

function Error(){
    return(
        <StyledDiv>
            <StyledInfo>Cette page n'existe pas</StyledInfo>
            <p>Retourner à la page d'<StyledLink to="/">Accueil</StyledLink></p>
        </StyledDiv>
    )
}

export default Error