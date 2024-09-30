import { getProductById } from '@/app/lib/api';
import Link from 'next/link';
import ImageGallery from '@/app/components/gallery';
import Reviews from '@/app/components/reviews';
import Error from '@/app/error';

/**
 * Generates metadata for the product page.
 *
 * @param {Object} props - The properties passed to the function.
 * @param {Object} props.params - The route parameters.
 * @param {string} props.params.id - The ID of the product.
 * @returns {Promise<Object>} The metadata object containing title and description.
 */
export async function generateMetadata({ params }) {
    const product = await getProductById(params.id);
    return {
        title: product.title,
        description: product.description,
    };
}

/**
 * ProductPage component that fetches and displays a single product's details.
 *
 * @param {Object} props - The properties passed to the ProductPage component.
 * @param {Object} props.params - The URL parameters containing the product ID.
 * @param {string} props.params.id - The ID of the product to be displayed.
 * @param {Object} searchParams - Optional search parameters for sorting reviews.
 * @param {string} [searchParams.reviewSort] - A parameter to sort reviews by 'date' or 'rating'.
 * @returns {JSX.Element} The product detail page, including product images, details, reviews, and error handling.
 */
export default async function ProductPage({ params, searchParams }) {
    const { id } = params;  // Extract product ID from URL parameters
    const { reviewSort } = searchParams;
    let product;
    let error;

    try {
        // Fetch product details by ID
        product = await getProductById(id);
    } catch (error) {
        error = error.message;  // Capture error message if fetching fails
    }

    // Display an error message if fetching product fails
    if (error) {
        return <Error error={error} reset={() => { }} />;
    }

    // Sort reviews based on the reviewSort parameter
    const sortedReviews = [...product.reviews].sort((a, b) => {
        if (reviewSort === 'date') {
            return new Date(b.date) - new Date(a.date);
        } else if (reviewSort === 'rating') {
            return b.rating - a.rating;
        }
        return 0;
    });

    const buildBackLink = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('reviewSort'); // Remove reviewSort parameter
        return `/?${params.toString()}`;
    };

    return (
        <div className="container mx-auto py-12">
            {/* Link back to products listing */}
            <Link href={buildBackLink()} className="flex items-center space-x-2 text-green-600 hover:text-black mb-8 transition-colors duration-300">
                <button className='bg-primary text-white px-4 py-2 rounded hover:bg-black transition-colors duration-300 mt-4 ml-2'>Back to products</button>
            </Link>

            {/* Product details container */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    {/* Display product images using ImageGallery component or fallback */}
                    <div className="card p-6 md:w-1/2">
                        {product.images && product.images.length > 0 ? (
                            <ImageGallery images={product.images} />
                        ) : (
                            <div className="p-4">No images available</div>
                        )}
                    </div>
                    <div className="md:w-1/2 p-8">
                        <h2 className="text-2xl font-bold mb-4 text-primary">{product.title}</h2>
                        <p className="text-secondary mb-4">{product.description}</p>
                        <p className="text-xl font-semibold text-accent mb-4">R{product.price.toFixed(2)}</p>
                        <p className="font-semibold text-secondary mb-4">Category: {product.category}</p>

                        {/* Display product tags */}
                        <div className="mb-4">
                            {product.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-block bg-primary rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Display product rating and stock information */}
                        <p className="font-semibold text-primary mb-2">Rating: {product.rating} / 5</p>
                        <p className="font-semibold text-primary mb-4">
                            Stock: {product.stock}
                            {product.stock > 0 ? (
                                <span className="text-accent ml-2">(In Stock)</span>
                            ) : (
                                <span className="text-red-600 ml-2">(Out of Stock)</span>
                            )}
                        </p>

                        {/* Add to Cart button */}
                        <button className="bg-black hover:bg-primary text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                            Add to Cart
                        </button>
                    </div>
                </div>

                {/* Render customer reviews using the Reviews component */}
                <Reviews reviews={sortedReviews} />
            </div>
        </div>
    );
}
