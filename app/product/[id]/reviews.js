"use client";

import { useState } from 'react';
import Reviews from '@/app/components/reviews';
import { useAuth } from '@/app/lib/useAuth';

/**
 * Renders the reviews section with sorting functionality.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.reviews - Array of reviews to display.
 * @returns {JSX.Element} The rendered reviews section component.
 * 
 * @example
 * // Example usage:
 * const reviews = [
 *   { id: 1, rating: 5, date: '2024-09-01', comment: 'Great product!' },
 *   { id: 2, rating: 3, date: '2024-08-15', comment: 'It was okay.' }
 * ];
 * 
 * <ReviewsSection reviews={reviews} />
 */
export default function ProductReviews({ initialReviews, productId }) {
    // State to store the current sort option for the reviews
    const [reviewSort, setReviewSort] = useState('date-desc');
    const [allReviews, setReviews] = useState(initialReviews); // Manage reviews state
    const { user } = useAuth;

    const handleAddReview = async (newReview) => {
        try {
            const response = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReview),
            });

            if (!response.ok) {
                throw new Error('Failed to add review');
            }

            const addedReview = await response.json();
            setReviews((prevReviews) => [...prevReviews, addedReview]);
            alert('Your review has been added successfully!');
        } catch (error) {
            console.error('Error adding review:', error);
            alert('Failed to add review. Please try again.');
        }
    };

    const handleReviewUpdated = async (updatedReview) => {
        try {
            const response = await fetch(`/api/products/${productId}/reviews/${updatedReview.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedReview),
            });

            if (!response.ok) {
                throw new Error('Failed to update review');
            }

            const updated = await response.json();
            setReviews((prevReviews) =>
                prevReviews.map((review) => (review.id === updated.id ? updated : review))
            );
            alert('Your review has been updated successfully!');
        } catch (error) {
            console.error('Error updating review:', error);
            alert('Failed to update review. Please try again.');
        }
    };

    const handleReviewDeleted = async (reviewId) => {
        try {
            const response = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete review');
            }

            setReviews((prevReviews) =>
                prevReviews.filter((review) => review.id !== reviewId)
            );
            alert('Your review has been deleted successfully!');
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review. Please try again.');
        }
    };

    /**
     * Sorts the reviews array based on the current sorting criteria.
     * Available sorting options:
     * - 'date-desc': Newest reviews first.
     * - 'date-asc': Oldest reviews first.
     * - 'rating-desc': Highest rating first.
     * - 'rating-asc': Lowest rating first.
     *
     * @returns {Array} A sorted array of reviews.
     */
    const sortedReviews = [...reviews].sort((a, b) => {
        if (reviewSort === 'date-desc') {
            return new Date(b.date) - new Date(a.date);
        } else if (reviewSort === 'date-asc') {
            return new Date(a.date) - new Date(b.date);
        } else if (reviewSort === 'rating-desc') {
            return b.rating - a.rating;
        } else if (reviewSort === 'rating-asc') {
            return a.rating - b.rating;
        }
        return 0;
    });

    return (
        <div className="mt-12 p-8 border-t">
            {/* Header with title and sorting dropdown */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold mb-4 text-primary">
                    Customer Reviews
                </h3>

                {/* Dropdown to select sorting method */}
                <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value)}
                    className="p-2 border rounded-md text-secondary"
                >
                    <option value="date-desc">Most Recent</option>
                    <option value="date-asc">Oldest</option>
                    <option value="rating-desc">Highest Rating</option>
                    <option value="rating-asc">Lowest Rating</option>
                </select>
            </div>

            {user && (
                <AddReviewForm onAddReview={handleAddReview} />
            )}

            {/* Render sorted reviews */}
            {sortedReviews.map((review) => (
                <Reviews
                    key={review.id}
                    review={review}
                    productId={productId}
                    onReviewUpdated={handleReviewUpdated}
                    onReviewDeleted={handleReviewDeleted}
                    isOwnReview={user && user.email === review.reviewerEmail}
                />
            ))}
        </div>
    );
}

function AddReviewForm({ onAddReview }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddReview({ rating, comment });
        setRating(5);
        setComment('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <h4 className="text-lg font-semibold mb-2">Add Your Review</h4>
            <div className="mb-4">
                <label className="block mb-2">Rating:</label>
                <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                >
                    {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                            {value} star{value !== 1 ? 's' : ''}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2">Comment:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="4"
                    required
                ></textarea>
            </div>
            <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-black transition-colors duration-300"
            >
                Submit Review
            </button>
        </form>
    );
}