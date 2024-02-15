// Composant pour contrôler la pagination
function PaginationControls({ currentPage, totalPages, selectPage }) {
    // Fonction pour charger plus de données en avançant d'une page
    const loadMoreData = () => {
        selectPage(prevPageNumber => prevPageNumber +  1);
    };

    // Fonction pour charger moins de données en reculant d'une page
    const loadLessData = () => {
        selectPage(prevPageNumber => prevPageNumber -  1);
    };

    // Fonction pour charger plus de données en avançant de 5 pages
    const handle5Prev = () => {
        selectPage(prevPageNumber => prevPageNumber -  5);
    };

    // Fonction pour charger plus de données en reculant de 5 pages
    const handle5Next = () => {
        selectPage(prevPageNumber => prevPageNumber +  5);
    };

    // Retourne le JSX pour le composant de contrôle de pagination
    return (
        <div className='pageNumberNavigation'>
            {/* Bouton pour aller aux 5 premières pages précédentes si possible */}
            {currentPage >  5 && (
                <div onClick={handle5Prev}> {'<<'}</div>
            )}
            {/* Bouton pour aller à la page précédente si possible */}
            {currentPage >  1 && (
                <button onClick={loadLessData}>Préc</button>
            )}
            {/* Affichage de la page courante et du nombre total de pages */}
            <div>
                Page: {currentPage} / {totalPages}
            </div>
            {/* Bouton pour aller à la page suivante si possible */}
            {currentPage < totalPages && (
                <button onClick={loadMoreData}>Suiv</button>
            )}
            {/* Bouton pour aller aux 5 prochaines pages suivantes si possible */}
            {currentPage < totalPages -  5 && (
                <div onClick={handle5Next}>{'>>'}</div>
            )}
        </div>
    );
}

// Exportation du composant PaginationControls
export default PaginationControls;
