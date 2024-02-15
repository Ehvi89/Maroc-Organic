import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AddClient from '../pages/AddClient';
import { useAuth } from '../components/context/AuthContext';

// Mock the useAuth hook to provide a mock authToken and user object
jest.mock('../components/context/AuthContext', () => ({
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

describe('AddClient Component', () => {
    test('renders add client form', () => {
        render(
            <Router>
                <AddClient />
            </Router>
        );
        const clientInput = screen.getByPlaceholderText(/Nom du client/i);
        const citySelect = screen.getByLabelText(/Ville/i);
        const submitButton = screen.getByText(/Enregistrer/i);
        expect(clientInput).toBeInTheDocument();
        expect(citySelect).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    test('handles form submission', async () => {
        render(
            <Router>
                <AddClient />
            </Router>
        );
        const clientInput = screen.getByPlaceholderText(/Nom du client/i);
        const citySelect = screen.getByLabelText(/Ville/i);
        const submitButton = screen.getByText(/Enregistrer/i);

        fireEvent.change(clientInput, { target: { value: 'Test Client' } });
        fireEvent.change(citySelect, { target: { value: 'Casablanca' } });
        fireEvent.click(submitButton);

        // Wait for any promises to resolve
        await waitFor(() => expect(global.fetch).toHaveBeenCalled());

        // Check if fetch was called with the expected arguments
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:5000/api/client',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer mockAuthToken',
                }),
                body: expect.stringMatching(/Test Client/),
            })
        );

        // Clean up the spy
        global.fetch.mockRestore();
    });

    test('handles removing a catalogue', () => {
        // This test assumes that you have implemented a way to remove catalogues in your component
        // For example, you might have a delete button for each catalogue row
        render(
            <Router>
                <AddClient />
            </Router>
        );
        // Click the add catalogue button twice to create two catalogue rows
        const addCatalogueButton = screen.getByText(/Ajouter un catalogue/i);
        fireEvent.click(addCatalogueButton);
        fireEvent.click(addCatalogueButton);

        // Find the delete buttons for the catalogue rows and click the first one
        const deleteButtons = screen.getAllByText(/Supprimer/i);
        fireEvent.click(deleteButtons[0]);

        // Check that only one catalogue row remains
        const remainingCatalogueSelects = screen.getAllByLabelText(/Catalogue/i);
        expect(remainingCatalogueSelects.length).toBe(1);
    });

    test('handles modifying catalogue data', () => {
        render(
            <Router>
                <AddClient />
            </Router>
        );
        // Click the add catalogue button to create a catalogue row
        const addCatalogueButton = screen.getByText(/Ajouter un catalogue/i);
        fireEvent.click(addCatalogueButton);

        // Select a catalogue option
        const catalogueSelect = screen.getByLabelText(/Catalogue/i);
        fireEvent.change(catalogueSelect, { target: { value: 'Dragon' } });

        // Check that the selected catalogue option is reflected in the DOM
        expect(catalogueSelect).toHaveValue('Dragon');
    });

    test('handles selecting a contact method', () => {
        render(
            <Router>
                <AddClient />
            </Router>
        );
        const emailRadio = screen.getByLabelText(/E-mail/i);
        const physicalAddressRadio = screen.getByLabelText(/Adresse physique/i);

        // Check initial state
        expect(emailRadio).not.toBeChecked();
        expect(physicalAddressRadio).not.toBeChecked();

        // Select email as the contact method
        fireEvent.click(emailRadio);
        expect(emailRadio).toBeChecked();
        expect(physicalAddressRadio).not.toBeChecked();

        // Select physical address as the contact method
        fireEvent.click(physicalAddressRadio);
        expect(emailRadio).not.toBeChecked();
        expect(physicalAddressRadio).toBeChecked();
    });

    test('validates form inputs before submission', async () => {
        render(
            <Router>
                <AddClient />
            </Router>
        );
        const submitButton = screen.getByText(/Enregistrer/i);
        fireEvent.click(submitButton);

        // Check that validation errors are displayed
        const clientError = await screen.findByText(/Le champ Nom du client est obligatoire./i);
        const cityError = await screen.findByText(/Le champ Ville est obligatoire./i);
        expect(clientError).toBeInTheDocument();
        expect(cityError).toBeInTheDocument();

        // Fill in the required fields
        const clientInput = screen.getByPlaceholderText(/Nom du client/i);
        const citySelect = screen.getByLabelText(/Ville/i);
        fireEvent.change(clientInput, { target: { value: 'Test Client' } });
        fireEvent.change(citySelect, { target: { value: 'Casablanca' } });

        // Submit the form again
        fireEvent.click(submitButton);

        // Check that no validation errors are displayed
        const noClientError = screen.queryByText(/Le champ Nom du client est obligatoire./i);
        const noCityError = screen.queryByText(/Le champ Ville est obligatoire./i);
        expect(noClientError).not.toBeInTheDocument();
        expect(noCityError).not.toBeInTheDocument();
    });

    // Add more tests as needed for other functionalities like adding catalogues, changing categories, etc.
});
