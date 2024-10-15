//const API_BASE_URL = 'https://curated-finds-boutique.vercel.app/api'; // Base URL for API

/**
 * Fetches a list of products from the e-commerce API.
 *
 * @param {Object} params - The parameters for fetching products.
 * @param {number} [params.page=1] - The page number to fetch. Defaults to 1.
 * @param {number} [params.limit=20] - The number of products to fetch per page. Defaults to 20.
 * @param {string} [params.search] - The search query to filter products by name or description.
 * @param {string} [params.category] - The category to filter products.
 * @param {string} [params.sortBy='id'] - The field to sort by (e.g., 'price', 'title').
 * @param {string} [params.order='asc'] - The sort order ('asc' or 'desc').
 * @returns {Promise<Object>} A promise that resolves to the product data in JSON format.
 * @throws {Error} If the request fails or the response is not OK.
 */
export async function getProducts({
    page = 1,
    limit = 20,
    search,
    category,
    sortBy = 'id',
    order = 'asc' }) {
    try {
        // Construct query parameters
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sortBy,
            order,
        });

        if (category) {
            params.append('category', category);
        }

        if (search) {
            params.append('search', search);
        }

        if (sortBy) {
            params.append("sortBy", sortBy);
        }
        if (order) {
            params.append("order", order);
        }

        // Fetch the product data
        const response = await fetch(`/api/products?${params}`, {
            next: { revalidate: 60 },
        });

        // Check if the response is successful, throw an error if not
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        // Return the product data in JSON format
        return response.json();

    } catch (error) {
        console.error('Error fetching products:', error);
        throw error; // Optionally rethrow the error for further handling
    }
}

/**
 * Fetches a specific product by its ID from the e-commerce API.
 *
 * @param {string} id - The unique identifier of the product.
 * @returns {Promise<Object>} A promise that resolves to the product data in JSON format.
 * @throws {Error} If the request fails or the response is not OK.
 */
export async function getProductById(id) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Fetch the product by its ID
        const response = await fetch(`${baseUrl}/api/products/${id}`, {
            next: { revalidate: 300 },
        });

        // Check if the response is successful, throw an error if not
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }

        // Return the product data in JSON format
        return response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error; // Optionally rethrow the error for further handling
    }
}

/**
 * Fetches the list of product categories from the e-commerce API.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of category names in JSON format.
 * @throws {Error} If the request fails or the response is not OK.
 */
export async function getCategories() {
    try {
        // Fetch the categories data
        const response = await fetch("/api/categories", {
            next: { revalidate: 3600 },
        });

        // Check if the response is successful, throw an error if not
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        // Return the category data in JSON format
        return response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error; // Optionally rethrow the error for further handling
    }
}
