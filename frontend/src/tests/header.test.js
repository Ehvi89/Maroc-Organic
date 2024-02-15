import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../components/context/AuthContext';

// Mock the useAuth hook to provide a mock authToken and user object
jest.mock('../components/context/AuthContext', () => ({
    useAuth: jest.fn().mockReturnValue({
        authToken: 'mockAuthToken',
        user: { name: 'John Doe', role: 'Administrateur' },
        removeToken: jest.fn(),
    }),
}));

describe('Header Component', () => {
    test('renders header elements', () => {
        render(
            <Router>
                <Header />
            </Router>
        );
        const logo = screen.getByAltText(/logo Maroc Organic/i);
        const burgerMenu = screen.getByRole('button');
        expect(logo).toBeInTheDocument();
        expect(burgerMenu).toBeInTheDocument();
    });

    test('handles login button click', () => {
        const mockSetShowLogin = jest.fn();
        render(
            <Router>
                <Header setShowLogin={mockSetShowLogin} />
            </Router>
        );
        const loginButton = screen.getByText(/Connexion/i);
        fireEvent.click(loginButton);
        expect(mockSetShowLogin).toHaveBeenCalledWith(true);
    });

    test('handles logout button click', () => {
        const mockRemoveToken = jest.fn();
        const mockSetIsAuthenticated = jest.fn();
        render(
            <Router>
                <Header removeToken={mockRemoveToken} setIsAuthenticated={mockSetIsAuthenticated} />
            </Router>
        );
        const logoutButton = screen.getByText(/Deconnexion/i);
        fireEvent.click(logoutButton);
        expect(mockRemoveToken).toHaveBeenCalled();
        expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
    });
});
