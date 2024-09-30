import Link from 'next/link';
import ProductCard from './ProductCard';

/**
 * ProductGrid component that displays a grid of products using the ProductCard component.
 *
 * @param {Object} props - The properties passed to the ProductGrid component.
 * @param {Object[]} props.products - An array of product objects to be displayed.
 * Each product object should contain the necessary details such as id, title, price, images, category, and rating.
 * @returns {JSX.Element} A grid layout displaying the list of products.
 */
export default function ProductGrid({ products }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Map over the products array and render a ProductCard for each product */}
            {products.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id} className="block">
                    <ProductCard product={product} />
                </Link>
            ))}
        </div>
    );
}
