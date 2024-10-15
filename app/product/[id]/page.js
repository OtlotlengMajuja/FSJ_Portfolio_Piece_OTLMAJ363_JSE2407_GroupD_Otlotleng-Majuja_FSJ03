import { notFound } from 'next/navigation';
import { getProductById } from '@/app/lib/api';
import ProductPage from './ProductPage';

/**
 * Generates metadata for the product page.
 * 
 * @param {Object} params - The route parameters.
 * @param {string} params.id - The ID of the product.
 * @returns {Promise<Object>} The metadata object containing title and description.
 */
export async function generateMetadata({ params }) {
    const product = await getProductById(params.id);

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.',
        };
    }

    return {
        title: `${product.title} | QuickCart Emporium`,
        description: product.description,
    };
}

/**
 * Fetches product data by ID.
 * 
 * @param {string} id - The ID of the product to fetch.
 * @returns {Promise<Object>} The product data.
 * @throws {Error} If the product is not found.
 */
async function getProductData(id) {
    const product = await getProductById(id);
    if (!product) notFound();
    return product;
}

/**
 * The main product page component.
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.params - The route parameters.
 * @param {string} props.params.id - The ID of the product.
 * @returns {Promise<JSX.Element>} The rendered ProductPage component.
 */
export default async function Page({ params }) {
    const product = await getProductData(params.id);
    return <ProductPage product={product} params={params} />;
}