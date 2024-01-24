import logo from './logo.svg';
import logoMarocOragnic from './images/Logo_MAROC-ORGANIC-removebg-preview.png';
import banner from './images/Business Proposal.png';
import './App.css';

function Header(){
  return(
      <div className="header">
          <header>
              <div className="logo-marocOrganic">
                  <a href="#"><img src={logoMarocOragnic} alt="logo Maroc Organic"/></a>
              </div>
              <div className="list-menu">
                  <ul>
                      <li>
                          <a href="#">Clients</a>
                      </li>
                      <li>
                          <a href="#">Planning des visites</a>
                      </li>
                      <li>
                          <a href="#">Suivi des commandes</a>
                      </li>
                      <li id="btn" className="user">
                          <a href="#">Connexion</a>
                      </li>
                  </ul>
              </div>
          </header>
      </div>
  );
}

function Home(){
    return(
        <div className="Home-body">
            <img src={banner} alt="Banner Maroc Organic"/>
            <div className="bottom-options">
                <div>
                    <p>Ajouter un compte rendu</p>
                    <button id="btn">
                        <a href="#">
                            <p>suivant</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M15.39 0.338837C23.7883 0.338837 30.5966 7.14706 30.5966 15.5454C30.5966 23.9438 23.7883 30.7521 15.39 30.7521C6.99154 30.7521 0.183311 23.9438 0.183311 15.5454C0.183311 7.14706 6.99154 0.338837 15.39 0.338837ZM16.5765 8.65529L16.4486 8.54486C16.0517 8.25038 15.507 8.24675 15.1065 8.53395L14.9636 8.65529L14.8532 8.78319C14.5588 9.18007 14.5551 9.7248 14.8424 10.1253L14.9636 10.2682L19.0993 14.4039H8.92603L8.77128 14.4142C8.26521 14.483 7.86461 14.8835 7.79595 15.3896L7.78554 15.5444L7.79595 15.6992C7.86461 16.2053 8.26521 16.6058 8.77128 16.6744L8.92603 16.6849H19.0993L14.9626 20.8217L14.8522 20.9496C14.5209 21.396 14.5575 22.0295 14.9623 22.4345C15.3673 22.8396 16.0008 22.8764 16.4474 22.5454L16.5753 22.435L22.6602 16.3523L22.7708 16.2243C23.0653 15.8274 23.069 15.2827 22.7817 14.8821L22.6604 14.7392L16.5765 8.65529Z" fill="#212121"/>
                            </svg>
                        </a>
                    </button>
                </div>
                <div>
                    <p>Ajouter une commande</p>
                    <button id="btn">
                        <a href="#">
                            <p>suivant</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                <path d="M15.39 0.338837C23.7883 0.338837 30.5966 7.14706 30.5966 15.5454C30.5966 23.9438 23.7883 30.7521 15.39 30.7521C6.99154 30.7521 0.183311 23.9438 0.183311 15.5454C0.183311 7.14706 6.99154 0.338837 15.39 0.338837ZM16.5765 8.65529L16.4486 8.54486C16.0517 8.25038 15.507 8.24675 15.1065 8.53395L14.9636 8.65529L14.8532 8.78319C14.5588 9.18007 14.5551 9.7248 14.8424 10.1253L14.9636 10.2682L19.0993 14.4039H8.92603L8.77128 14.4142C8.26521 14.483 7.86461 14.8835 7.79595 15.3896L7.78554 15.5444L7.79595 15.6992C7.86461 16.2053 8.26521 16.6058 8.77128 16.6744L8.92603 16.6849H19.0993L14.9626 20.8217L14.8522 20.9496C14.5209 21.396 14.5575 22.0295 14.9623 22.4345C15.3673 22.8396 16.0008 22.8764 16.4474 22.5454L16.5753 22.435L22.6602 16.3523L22.7708 16.2243C23.0653 15.8274 23.069 15.2827 22.7817 14.8821L22.6604 14.7392L16.5765 8.65529Z" fill="#212121"/>
                            </svg>
                        </a>
                    </button>
                </div>
            </div>
        </div>
    )
}
function App() {
  return (
    <div className="App">
        <Header />
        <Home />
    </div>
  );
}

export default App;
