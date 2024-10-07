'use client';
import React from "react";

/**
 * SortOptions component allows users to sort products by various fields (price, title, etc.).
 * 
 * @param {Object} props - The component props.
 * @param {string} props.currentSortBy - The currently selected sort field (e.g., 'price' or 'title').
 * @param {string} props.currentSortOrder - The currently selected sort order ('asc' or 'desc').
 * @param {Function} props.onSortChange - Callback function to handle changes in sorting.
 * @returns {JSX.Element} The rendered dropdown component for sorting options.
 */
export function SortOptions({ currentSort, onSortChange }) {
    return (
        <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="p-2 border rounded"
        >
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Title: A-Z</option>
            <option value="title-desc">Title: Z-A</option>
        </select>
    );
}
