'use client'
import React from "react";

/**
 * FilterByCategory component allows users to filter products by category.
 * 
 * @param {Object} props - The component props.
 * @param {Array<string>} props.categories - List of categories available for filtering.
 * @param {string} props.selectedCategory - The currently selected category.
 * @param {Function} props.onCategoryChange - Callback function to handle category change.
 * @returns {JSX.Element} The rendered dropdown component for filtering categories.
 */
export function FilterByCategory({ categories, selectedCategory, onCategoryChange }) {
    const safeCategories = Array.isArray(categories) ? categories : [];

    return (
        <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="p-2 border rounded-md"
        >
            <option value="">All Categories</option>
            {safeCategories.map((category) => (
                <option key={category} value={category}>
                    {category}
                </option>
            ))}
        </select>
    );
}
