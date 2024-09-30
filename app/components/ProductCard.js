'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * ProductCard component displays a product with an image carousel, title, price, category, and rating.
 * Each card is clickable and navigates to the product details page.
 *
 * @param {Object} props - The properties passed to the ProductCard component.
 * @param {Object} props.product - The product object containing details like id, title, images, price, category, and rating.
 * @param {number} props.product.id - The unique identifier of the product.
 * @param {string} props.product.title - The title of the product.
 * @param {string[]} props.product.images - Array of URLs for the product images.
 * @param {string} props.product.thumbnail - The thumbnail image for the product.
 * @param {number} props.product.price - The price of the product.
 * @param {string} props.product.category - The category the product belongs to.
 * @param {number} props.product.rating - The product's rating out of 5.
 * 
 * @returns {JSX.Element} The product card component with product details and an image carousel.
 */
export default function ProductCard({ product }) {
    // State to track the current image index in the product's image array
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const searchParams = useSearchParams();

    /**
     * Navigate to the next image in the carousel.
     * Loops back to the first image if the current image is the last.
     *
     * @param {Event} e - The click event triggered by the user.
     */
    const nextImage = (e) => {
        e.preventDefault();
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % product.images.length
        );
    };

    /**
     * Navigate to the previous image in the carousel.
     * Loops back to the last image if the current image is the first.
     *
     * @param {Event} e - The click event triggered by the user.
     */
    const prevImage = (e) => {
        e.preventDefault();
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + product.images.length) % product.images.length
        );
    };

    /**
     * Builds the product link with current search parameters.
     * Removes any existing 'page' parameter from the URL to maintain state when navigating.
     *
     * @returns {string} The URL string to navigate to the product details page.
     */
    const buildProductLink = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('page'); // Remove page parameter
        return `/product/${product.id}?${params.toString()}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Link to the product details page */}
            <Link href={buildProductLink()}>
                <div className="relative">
                    {/* Display the current image of the product */}
                    <Image
                        src={product.images[currentImageIndex] || product.thumbnail}
                        alt={product.title}
                        width={250}
                        height={250}
                        objectFit="cover"
                    />
                    {/* Image navigation buttons */}
                    {product.images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-xl"
                            >
                                &#8249;
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-xl"
                            >
                                &#8250;
                            </button>
                        </>
                    )}
                </div>

                {/* Product details */}
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4 text-black">{product.title}</h2>
                    <p className="inline-block font-semibold bg-primary rounded-full px-3 py-1 text-sm text-white mr-2 mb-2">
                        {product.category}
                    </p>
                    <span className="text-sm text-black">Rating: {product.rating}/5</span>
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-black">R{product.price.toFixed(2)}</span>
                        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-black transition-colors duration-300 mt-4 ml-2">
                            View Details
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
}
