import { render, screen } from '@testing-library/react';
import Banner from "../components/Banner";

describe('Banner Component', () => {
    test('renders banner content', () => {
        render(<Banner />);
        const marocOrganicText = screen.getByText(/MAROC ORGANIC/i);
        const distributeurText = screen.getByText(/distributeur #1 au Maroc de produits naturels et bio/i);
        const toolsText = screen.getByText(/Outils de gestion des ventes et de suivi des clients/i);
        expect(marocOrganicText).toBeInTheDocument();
        expect(distributeurText).toBeInTheDocument();
        expect(toolsText).toBeInTheDocument();
    });
});