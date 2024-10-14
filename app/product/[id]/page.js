import { notFound } from 'next/navigation';
import { getProductById } from '@/app/lib/api';
import ProductPage from './ProductPage';

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

async function getProductData(id) {
    const product = await getProductById(id);
    if (!product) notFound();
    return product;
}

export default async function Page({ params }) {
    const product = await getProductData(params.id);
    return <ProductPage product={product} params={params} />;
}