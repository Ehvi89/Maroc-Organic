import React from 'react';

class ResetPasswordRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            message: '',
            mode: 'request', // 'request' ou 'reset'
            showPassword: false,
        };
    }

    componentDidMount() {
        // Vérifier si un token est présent dans l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            this.setState({ mode: 'reset' }); // Passer en mode de réinitialisation
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };

    toggleShowPassword = () => {
        this.setState(prevState => ({ showPassword: !prevState.showPassword }));
    };


    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const data = this.state.mode === 'request' ? { email: this.state.email } : {
                token,
                email: urlParams.get('email'),
                newPassword: this.state.password,
                confirmPassword: this.state.confirmPassword,
            };
            const response = await fetch(`http://localhost:5000/api/${this.state.mode === 'request' ? 'resetPassword' : 'user'}`, {
                method: `${this.state.mode === 'request' ? 'POST' : 'PUT'}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            this.setState({ message: result.message });
            if (this.state.mode === 'reset') {
                // Rediriger l'utilisateur vers la page de connexion ou une autre page après la réinitialisation réussie
                window.location.href = '/';
            }
        } catch (error) {
            this.setState({ message: 'Erreur lors de la demande de réinitialisation du mot de passe.' });
        }
    };

    render() {
        return (
            <div className="reset-password-container">
                <h2>{this.state.mode === 'request' ? 'Réinitialiser le mot de passe' : 'Entrez votre nouveau mot de passe'}</h2>
                <form onSubmit={this.handleSubmit}>
                    {this.state.mode === 'request' ? (
                        <>
                            <label htmlFor="email">Adresse e-mail :</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleInputChange}
                                required
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Entrez une adresse e-mail valide"
                            />
                        </>
                    ) : (
                        <>
                            <label htmlFor="password">Nouveau mot de passe :</label>
                            <input
                                type={this.state.showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                required
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$"
                                title="Le mot de passe doit contenir au moins un caractère spécial, des majuscules, des miniscules et des chiffres"
                            />
                            <button type="button" onClick={this.toggleShowPassword}>
                                {this.state.showPassword ? 'Masquer' : 'Afficher'}
                            </button>
                            <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe :</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={this.state.confirmPassword}
                                onChange={this.handleInputChange}
                                required
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$"
                                title="Le mot de passe doit contenir au moins un caractère spécial, des majuscules, des miniscules et des chiffres"/>
                        </>
                    )}
                    <button
                        type="submit">{this.state.mode === 'request' ? 'Envoyer' : 'Réinitialiser le mot de passe'}
                    </button>
                </form>
                {this.state.message && <p>{this.state.message}</p>}
            </div>
        );
    }
}

export default ResetPasswordRequest;
