'use client'
import React from "react";

/**
 * ResetFilters component provides a button to reset all applied filters.
 * 
 * @param {Object} props - The component props.
 * @param {Function} props.onReset - Callback function to reset all filters.
 * @returns {JSX.Element} The rendered button component for resetting filters.
 */
export function ResetFilters({ onReset }) {
    return (
        <button
            onClick={onReset}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-black transition-colors duration-300 ml-2"
        >
            Reset All Filters
        </button>
    );
}
