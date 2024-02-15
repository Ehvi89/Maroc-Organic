import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../components/Login';
import { useAuth } from '../components/context/AuthContext';

// Mock the useAuth hook to provide a mock setToken function
jest.mock('../components/context/AuthContext', () => ({
    useAuth: jest.fn().mockReturnValue({
        setToken: jest.fn(),
    }),
}));

// Mock the fetch function to avoid making actual network requests
global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ token: 'mockToken', user: { name: 'John Doe' } }),
}));

describe('Login Component', () => {
    test('renders login form', () => {
        const mockOnClose = jest.fn();
        const mockOnLogin = jest.fn();
        render(
            <Router>
                <Login onClose={mockOnClose} onLogin={mockOnLogin} />
            </Router>
        );
        const emailInput = screen.getByPlaceholderText(/E-mail/i);
        const passwordInput = screen.getByPlaceholderText(/Mot de passe/i);
        const submitButton = screen.getByText(/Connexion/i);
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    test('handles form submission', async () => {
        const mockOnClose = jest.fn();
        const mockOnLogin = jest.fn();
        render(
            <Router>
                <Login onClose={mockOnClose} onLogin={mockOnLogin} />
            </Router>
        );
        const emailInput = screen.getByPlaceholderText(/E-mail/i);
        const passwordInput = screen.getByPlaceholderText(/Mot de passe/i);
        const submitButton = screen.getByText(/Connexion/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // Wait for any promises to resolve
        await waitFor(() => expect(global.fetch).toHaveBeenCalled());

        // Check if setToken was called with the expected arguments
        expect(useAuth().setToken).toHaveBeenCalledWith(
            'mockToken',
            { name: 'John Doe' }
        );

        // Check if onLogin was called with the expected user data
        expect(mockOnLogin).toHaveBeenCalledWith({ name: 'John Doe' });

        // Check if onClose was called to close the login form
        expect(mockOnClose).toHaveBeenCalled();
    });

    // Add more tests as needed for other functionalities like error handling, forgot password link, etc.
});
