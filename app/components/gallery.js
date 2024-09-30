'use client';
import { useState } from 'react';
import Image from 'next/image';

/**
 * ImageGallery component that displays a carousel of images with navigation controls 
 * and thumbnails for selecting images.
 *
 * @param {Object} props - The component props.
 * @param {string[]} props.images - Array of image URLs to display in the gallery.
 * @returns {JSX.Element} The image gallery component.
 */
export default function ImageGallery({ images }) {
    // State to track the currently displayed image
    const [currentImage, setCurrentImage] = useState(0);

    if (!images || images.length === 0) {
        return <div className="p-4">No images available</div>;
    }

    /**
     * Move to the next image in the gallery.
     * If on the last image, it loops back to the first image.
     */
    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    /**
     * Move to the previous image in the gallery.
     * If on the first image, it loops back to the last image.
     */
    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    /**
     * Set the current image to a specific index.
     *
     * @param {number} index - The index of the image to display.
     */
    const handleImageClick = (index) => {
        setCurrentImage(index);
    };

    return (
        <div className="space-y-4">
            {/* Main image display */}
            <div className="relative w-full h-96">
                <Image
                    src={images[currentImage]}
                    alt={`Product image ${currentImage + 1}`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                />
                {images.length > 1 && (
                    <>
                        {/* Button to go to the previous image */}
                        <button
                            onClick={prevImage}
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                            aria-label="Previous image"
                        >
                            &#8592;
                        </button>
                        {/* Button to go to the next image */}
                        <button
                            onClick={nextImage}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                            aria-label="Next image"
                        >
                            &#8594;
                        </button>
                    </>
                )}
                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleImageClick(index)}
                            className={`w-3 h-3 rounded-full ${index === currentImage ? 'bg-white' : 'bg-gray-400'
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Thumbnails for each image */}
            {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            onClick={() => handleImageClick(index)}
                            className={`h-16 w-16 relative cursor-pointer rounded-md transition-transform duration-300 hover:scale-110 ${currentImage === index ? 'border-2 border-indigo-600' : 'border border-gray-300'
                                }`}
                        >
                            <Image
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-md"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
