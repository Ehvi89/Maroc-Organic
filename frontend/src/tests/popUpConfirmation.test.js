import { render, screen } from '@testing-library/react';
import ConfirmPopup from "../components/ConfirmationPopup";

describe('ConfirmPopup Component', () => {
    test('does not render when not shown', () => {
        render(<ConfirmPopup show={false} title="Test Title" message="Test Message" onConfirm={jest.fn()} onCancel={jest.fn()} />);
        const popup = screen.queryByRole('dialog');
        expect(popup).not.toBeInTheDocument();
    });

    test('renders when shown', () => {
        render(<ConfirmPopup show={true} title="Test Title" message="Test Message" onConfirm={jest.fn()} onCancel={jest.fn()} />);
        const popup = screen.getByRole('dialog');
        expect(popup).toBeInTheDocument();
    });

    test('handles confirm action', () => {
        const mockOnConfirm = jest.fn();
        render(<ConfirmPopup show={true} title="Test Title" message="Test Message" onConfirm={mockOnConfirm} onCancel={jest.fn()} />);
        const confirmButton = screen.getByText(/Confirmer/i);
        fireEvent.click(confirmButton);
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    test('handles cancel action', () => {
        const mockOnCancel = jest.fn();
        render(<ConfirmPopup show={true} title="Test Title" message="Test Message" onConfirm={jest.fn()} onCancel={mockOnCancel} />);
        const cancelButton = screen.getByText(/Annuler/i);
        fireEvent.click(cancelButton);
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
});
