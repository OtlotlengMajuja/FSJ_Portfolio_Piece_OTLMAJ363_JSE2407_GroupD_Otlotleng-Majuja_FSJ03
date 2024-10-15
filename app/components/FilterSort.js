import React, { useCallback } from "react";
import SearchBar from "./SearchBar";

/**
 * FilterSort component for filtering, sorting, and searching products.
 *
 * @param {Object} props - The component props.
 * @param {Array<string>} props.categories - List of product categories.
 * @param {string} props.currentCategory - Currently selected category.
 * @param {string} props.currentSortBy - Currently selected sort criterion.
 * @param {string} props.currentSortOrder - Currently selected sort order (asc/desc).
 * @param {string} props.currentSearch - Current search query.
 * @param {Function} props.onFilter - Callback function for filtering products.
 * @param {Function} props.onSort - Callback function for sorting products.
 * @param {Function} props.onSearch - Callback function for searching products.
 * @param {Function} props.onReset - Callback function for resetting filters and search.
 *
 * @returns {JSX.Element} The rendered FilterSort component.
 */
export default function FilterSort({
    categories,
    currentCategory,
    currentSortBy,
    currentSortOrder,
    currentSearch,
    onFilter,
    onSort,
    onSearch,
    onReset
}) {
    const handleSearchChange = useCallback((newValue) => {
        onSearch(newValue);
    }, [onSearch]);

    return (
        <div className="mb-8">
            <div className="mb-4">
                <SearchBar initialValue={currentSearch} onSearchChange={handleSearchChange} />
            </div>
            <div className="flex flex-wrap items-center gap-4">
                <FilterByCategory
                    categories={categories}
                    selectedCategory={currentCategory}
                    onCategoryChange={onFilter}
                />
                <SortOptions
                    currentSort={`${currentSortBy}-${currentSortOrder}`}
                    onSortChange={(value) => {
                        const [sortBy, sortOrder] = value.split('-');
                        onSort(sortBy, sortOrder);
                    }}
                />
                <ResetFilters onReset={onReset} />
            </div>
        </div>
    );
}


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
            {categories && categories.map((category) => (
                <option key={category} value={category}>
                    {category}
                </option>
            ))}
        </select>
    );
}

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


