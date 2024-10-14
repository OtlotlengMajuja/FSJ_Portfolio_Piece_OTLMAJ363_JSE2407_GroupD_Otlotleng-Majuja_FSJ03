import { notFound } from 'next/navigation';
import { fetchProductById } from '@/app/api';
import ProductPage from './ProductPage';

export async function generateMetadata({ params }) {
    const product = await fetchProductById(params.id);

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

async function fetchProductData(id) {
    const product = await fetchProductById(id);
    if (!product) notFound();
    return product;
}

export default async function Page({ params }) {
    const product = await fetchProductData(params.id);
    return <ProductPage product={product} params={params} />;
}