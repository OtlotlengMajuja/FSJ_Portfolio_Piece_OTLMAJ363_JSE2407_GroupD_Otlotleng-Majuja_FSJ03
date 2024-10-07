import Home from '../page';
import { getProducts, getCategories } from '../lib/api';

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