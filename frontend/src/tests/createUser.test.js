import { render, fireEvent, screen } from '@testing-library/react';
import CreateUser from './CreateUser';
import { useAuth } from './context/AuthContext';

// Mock the useAuth hook to provide a mock authToken and user object
jest.mock('./context/AuthContext', () => ({
    useAuth: jest.fn().mockReturnValue({
        authToken: 'mockAuthToken',
        user: { email: 'test@example.com' },
    }),
}));

// Mock the fetch function to avoid making actual network requests
global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
}));

describe('CreateUser Component', () => {
    test('handles form submission', async () => {
        const mockOnClose = jest.fn();

        // Spy on the fetch function
        const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        );

        render(<CreateUser onClose={mockOnClose} />);

        const nameInput = screen.getByLabelText(/Nom/i);
        const emailInput = screen.getByLabelText(/E-mail/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);
        const roleSelect = screen.getByLabelText(/Rôle/i);
        const submitButton = screen.getByText(/Enregistrer/i);

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(roleSelect, { target: { value: 'Administrateur' } });
        fireEvent.click(submitButton);

        // Wait for any promises to resolve
        await new Promise(resolve => setImmediate(resolve));

        // Check if fetch was called with the expected arguments
        expect(fetchSpy).toHaveBeenCalledWith(
            'http://localhost:5000/api/createUser',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer mockAuthToken',
                }),
                body: JSON.stringify({
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    password: 'password123',
                    role: 'Administrateur',
                    userEmail: 'test@example.com',
                }),
            })
        );

        // Clean up the spy
        fetchSpy.mockRestore();
    });
});
