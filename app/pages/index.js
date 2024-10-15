import Home from '../page';
import { getProducts, getCategories } from '../lib/api';

/**
 * Fetches initial data for the home page.
 * 
 * @param {Object} context - The context object from Next.js.
 * @param {Object} context.query - The query parameters from the URL.
 * @returns {Promise<Object>} An object containing the props for the Home component.
 */
export async function getServerSideProps(context) {
    const { page = 1, search = '', category = '', sort = '' } = context.query;

    try {
        const initialProducts = await getProducts({ page: Number(page), limit: 20, search, category, sort });
        const categories = await getCategories();

        return {
            props: {
                initialProducts: initialProducts.products,
                initialCategories: categories,
                initialPage: Number(page),
                initialSearch: search,
                initialCategory: category,
                initialSort: sort,
            },
        };
    } catch (error) {
        return {
            props: {
                error: 'Failed to fetch initial data',
            },
        };
    }
}

export default Home;