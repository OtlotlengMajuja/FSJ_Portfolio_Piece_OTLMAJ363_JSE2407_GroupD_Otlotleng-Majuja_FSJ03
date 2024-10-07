import React from "react";

/**
 * Pagination component that provides navigation links for paginated content.
 * It displays "Previous" and "Next" buttons based on the current page and availability of more pages.
 *
 * @param {Object} props - The properties passed to the Pagination component.
 * @param {number} props.currentPage - The current page number being viewed.
 * @param {boolean} props.hasMore - A flag indicating whether there are more pages available.
 * @returns {JSX.Element} A JSX element with pagination controls, including "Previous" and "Next" buttons.
 */
const Pagination = React.memo(function Pagination({ currentPage, hasMore, onPageChange }) {
    return (
        <div className="flex justify-center items-center space-x-4 my-12">
            {currentPage > 1 && (
                <button onClick={() => onPageChange(currentPage - 1)} className="bg-black text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors duration-300 mt-4 ml-2">
                    Previous
                </button>
            )}
            <span className="text-black font-semibold justify-center items-center mt-4">Page {currentPage}</span>
            {hasMore && (
                <button onClick={() => onPageChange(currentPage + 1)} className="bg-black text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors duration-300 mt-4 ml-2">
                    Next
                </button>
            )}
        </div>
    );
});

export default Pagination;
