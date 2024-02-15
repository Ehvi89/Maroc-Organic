import { render, fireEvent, screen } from '@testing-library/react';
import PaginationControls from "../components/PaginationControls";

describe('PaginationControls Component', () => {
    // Helper function to simulate page change
    const simulatePageChange = (pageNumber) => {
        return jest.fn().mockImplementation((callback) => callback(pageNumber));
    };

    test('handles previous page selection', () => {
        const mockSelectPage = simulatePageChange(1); // Simulate going back to page  1
        render(<PaginationControls currentPage={2} totalPages={10} selectPage={mockSelectPage} />);
        const prevButton = screen.getByText(/Préc/i);
        fireEvent.click(prevButton);
        expect(mockSelectPage).toHaveBeenCalledWith(expect.any(Function));
        // Verify that the page has been decremented
        expect(mockSelectPage).toHaveBeenLastCalledWith(1);
    });

    test('handles next page selection', () => {
        const mockSelectPage = simulatePageChange(3); // Simulate going forward to page  3
        render(<PaginationControls currentPage={2} totalPages={10} selectPage={mockSelectPage} />);
        const nextButton = screen.getByText(/Suiv/i);
        fireEvent.click(nextButton);
        expect(mockSelectPage).toHaveBeenCalledWith(expect.any(Function));
        // Verify that the page has been incremented
        expect(mockSelectPage).toHaveBeenLastCalledWith(3);
    });
});
