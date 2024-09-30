const API_BASE_URL = 'https://next-ecommerce-api.vercel.app';

/**
 * Fetches a list of products from the e-commerce API.
 *
 * @param {Object} params - The parameters for fetching products.
 * @param {number} [params.page=1] - The page number to fetch. Defaults to 1.
 * @param {number} [params.limit=20] - The number of products to fetch per page. Defaults to 20.
 * @param {string} [params.search=''] - The search query to filter products by name or description.
 * @param {string} [params.category=''] - The category to filter products.
 * @param {string} [params.sort=''] - The sort option for products (e.g., 'price_asc', 'price_desc').
 * @returns {Promise<Object>} A promise that resolves to the product data in JSON format.
 * @throws {Error} If the request fails or the response is not OK.
 */
export async function getProducts({ page = 1, limit = 20, search = '', category = '', sort = '' }) {
    // Construct query parameters
    const params = new URLSearchParams({
        limit: limit.toString(),
        skip: ((page - 1) * limit).toString(),
        q: search,
        category,
    });

    // Apply sorting if provided
    if (sort === 'price_asc') {
        params.append('sort', 'price');
        params.append('order', 'asc');
    } else if (sort === 'price_desc') {
        params.append('sort', 'price');
        params.append('order', 'desc');
    }

    // Fetch the product data
    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
    });

    // Check if the response is successful, throw an error if not
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    // Return the product data in JSON format
    return response.json();
}

/**
 * Fetches a specific product by its ID from the e-commerce API.
 *
 * @param {string} id - The unique identifier of the product.
 * @returns {Promise<Object>} A promise that resolves to the product data in JSON format.
 * @throws {Error} If the request fails or the response is not OK.
 */
export async function getProductById(id) {
    // Fetch the product by its ID
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
    });

    // Check if the response is successful, throw an error if not
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }

    // Return the product data in JSON format
    return response.json();
}

/**
 * Fetches the list of product categories from the e-commerce API.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of category names in JSON format.
 * @throws {Error} If the request fails or the response is not OK.
 */
export async function getCategories() {
    // Fetch the categories data
    const response = await fetch(`${API_BASE_URL}/categories`, {
        next: { revalidate: 86400 }, // Cache for 24 hours
    });

    // Check if the response is successful, throw an error if not
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }

    // Return the category data in JSON format
    return response.json();
}
