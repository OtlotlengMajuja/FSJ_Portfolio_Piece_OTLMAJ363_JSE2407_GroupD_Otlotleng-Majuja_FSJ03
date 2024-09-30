'use client';

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
export default function SearchBar({ initialValue, onSearchChange }) {
    return (
        <input
            type="text"
            value={initialValue} // The current value of the input field
            onChange={(e) => onSearchChange(e.target.value)} // Calls the onSearchChange callback when the input changes
            placeholder="Search products..." // Placeholder text for the input field
            className="p-2 border rounded" // Basic styling
        />
    );
}
