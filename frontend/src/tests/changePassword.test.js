import { render, fireEvent, screen } from '@testing-library/react';
import ChangePassword from "../components/changePassword";
import { FunctionProvider, useFunctions } from '../components/context/SharedContext';

describe('ChangePassword Component', (object, method) => {
    // Mock the fetch function to avoid making actual network requests
    global.fetch = jest.fn(() => Promise.resolve({
        then: () => Promise.resolve(),
    }));

    test('handles form submission', async (object, method) => {
        const mockOnClose = jest.fn();
        const mockUseFunctions = jest.fn();
        mockUseFunctions.mockReturnValue({
            handleUpdateUser: jest.fn(),
        });

        // Spy on the fetch function
        const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        );

        // Render the ChangePassword component within the FunctionProvider
        render(
            <FunctionProvider>
                <ChangePassword onClose={mockOnClose} />
            </FunctionProvider>
        );

        const nameInput = screen.getByPlaceholderText(/Nom/i);
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        const submitButton = screen.getByText(/Soumettre/i);
        fireEvent.click(submitButton);

        // Wait for any promises to resolve
        await new Promise(resolve => setImmediate(resolve));

        // Check if fetch was called with the expected arguments
        expect(fetchSpy).toHaveBeenCalledWith(
            'http://localhost:5000/api/user/undefined', // Note: You need to replace 'undefined' with the actual user ID
            expect.objectContaining({
                method: 'PUT',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    Authorization: expect.stringMatching(/^Bearer .+$/),
                }),
                body: JSON.stringify({
                    name: 'John Doe',
                    email: 'user@example.com', // Replace with the actual user email
                    newPassword: undefined, // Replace with the actual new password if needed
                }),
            })
        );

        // Clean up the spy
        fetchSpy.mockRestore();
    });
});
