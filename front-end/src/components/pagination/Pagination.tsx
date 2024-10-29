import React from 'react';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const getPaginationItems = () => {
        const paginationItems: JSX.Element[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                paginationItems.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-4 py-2 rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // Always show first page
            paginationItems.push(
                <button key={1} onClick={() => handlePageChange(1)} className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}>
                    1
                </button>
            );

            // Show ellipsis if needed
            if (currentPage > 3) {
                paginationItems.push(<span key="ellipsis1">...</span>);
            }

            // Show range of pages
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                paginationItems.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-4 py-2 rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
                    >
                        {i}
                    </button>
                );
            }

            // Show ellipsis if needed
            if (currentPage < totalPages - 2) {
                paginationItems.push(<span key="ellipsis2">...</span>);
            }

            // Always show last page
            paginationItems.push(
                <button key={totalPages} onClick={() => handlePageChange(totalPages)} className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}>
                    {totalPages}
                </button>
            );
        }

        return paginationItems;
    };

    return (
        <div className="flex justify-center mt-4 space-x-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300">
                <BiLeftArrow />
            </button>
            {getPaginationItems()}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300">
                <BiRightArrow />
            </button>
        </div>
    );
};

export default Pagination;
