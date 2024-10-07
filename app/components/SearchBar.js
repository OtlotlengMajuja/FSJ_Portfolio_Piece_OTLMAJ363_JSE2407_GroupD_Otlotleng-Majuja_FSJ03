'use client';

import React, { useCallback, useState } from "react";

/**
 * SearchBar component allows users to input a search query to filter products.
 *
 * @param {Object} props - The properties passed to the SearchBar component.
 * @param {string} props.initialValue - The initial value of the search input, used for controlled input behavior.
 * @param {Function} props.onSearchChange - Callback function that handles the search input change.
 * The function is called whenever the user types in the search bar.
 * 
 * @returns {JSX.Element} A text input field for product search.
 */
const SearchBar = React.memo(function SearchBar({ initialValue, onSearchChange }) {
    const [searchTerm, setSearchTerm] = useState(initialValue || '');

    const handleChange = useCallback((e) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        onSearchChange(newValue);
    }, [onSearchChange]);

    return (
        <div className="relative">
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search products..."
                className="w-full p-2 pr-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
        </div>
    );
});

export default SearchBar;
