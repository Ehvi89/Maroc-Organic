function PaginationControls({ currentPage, totalPages, onPrevious, onNext, onFirst, onLast }) {
    return (
        <div className='pageNumberNavigation'>
            {currentPage >  1 && (
                <div onClick={onFirst}> {'<<'}</div>
            )}
            {currentPage >  1 && (
                <button onClick={onPrevious}>Préc</button>
            )}
            <div>
                Page: {currentPage} / {totalPages}
            </div>
            {currentPage < totalPages && (
                <button onClick={onNext}>Suiv</button>
            )}
            {currentPage < totalPages && (
                <div onClick={onLast}>{'>>'}</div>
            )}
        </div>
    );
}

export default PaginationControls;
