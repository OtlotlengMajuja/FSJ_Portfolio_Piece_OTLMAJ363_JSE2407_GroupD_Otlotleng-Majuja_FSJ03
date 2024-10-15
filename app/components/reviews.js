'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/useAuth";

/**
 * @typedef {Object} Review
 * @property {string} reviewerName - The name of the person who wrote the review
 * @property {string} date - The date the review was written, in a valid date format
 * @property {number} rating - The rating given by the reviewer, between 1 and 5
 * @property {string} comment - The review text or comment provided by the customer
 */

/**
 * @typedef {Object} ReviewsProps
 * @property {Review[]} reviews - An array of review objects to be displayed
 * @property {string} productId - The ID of the product being reviewed
 * @property {Function} onReviewAdded - Callback function when a review is added
 * @property {Function} onReviewUpdated - Callback function when a review is updated
 * @property {Function} onReviewDeleted - Callback function when a review is deleted
 */

/**
 * Reviews component that displays a list of customer reviews for a product.
 * The reviews can be sorted by the most recent date or by rating.
 *
 * @param {ReviewsProps} props - The properties passed to the Reviews component
 * @returns {JSX.Element} A list of customer reviews, including reviewer name, date, rating, and comment
 */
export default function Reviews({
    reviews,
    productId,
    onReviewAdded,
    onReviewUpdated,
    onReviewDeleted
}) {
    const router = useRouter(); // Hook to handle routing
    const [sortOption, setSortOption] = useState(''); // State to track the selected sort option
    const [sortedReviews, setSortedReviews] = useState(reviews);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [editingReview, setEditingReview] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignedIn, setIsSignedIn] = useState(false);
    const { user, signIn } = useAuth() || {};

    useEffect(() => {
        const sortReviews = () => {
            const [field, order] = sortOption.split('-');
            const sorted = [...reviews].sort((a, b) => {
                if (field === 'date') {
                    return order === 'asc'
                        ? new Date(a.date) - new Date(b.date)
                        : new Date(b.date) - new Date(a.date);
                } else if (field === 'rating') {
                    return order === 'asc'
                        ? a.rating - b.rating
                        : b.rating - a.rating;
                }
                return 0;
            });
            setSortedReviews(sorted);
        };

        if (sortOption) {
            sortReviews();
            router.push(`?reviewSort=${sortOption}`, { scroll: false });
        }
    }, [sortOption, reviews, router]);

    /**
     * Handles the change in sort option for reviews
     * @param {React.ChangeEvent<HTMLSelectElement>} e - The event object
     */
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    /**
     * Handles user sign-in
     */
    const handleSignIn = async () => {
        try {
            await signIn(email, password);
            setIsSignedIn(true);
            setEmail('');
            setPassword('');
            setSuccessMessage('Successfully signed in!');
        } catch (error) {
            setError(error.message);
        }
    };

    /**
     * Handles adding a new review
     */
    const handleAddReview = async () => {
        if (!user) {
            setError('You must be logged in to add a review.');
            return;
        }

        try {
            const response = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify(newReview)
            });

            if (response.ok) {
                const addedReview = await response.json();
                onReviewAdded(addedReview);
                setNewReview({ rating: 5, comment: '' });
                setSuccessMessage('Review added successfully!');
            } else {
                throw new Error('Failed to add review');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    /**
     * Handles editing an existing review
     * @param {string} reviewId - The ID of the review to edit
     */
    const handleEditReview = async (reviewId) => {
        try {
            const response = await fetch(`/api/products/${productId}/reviews`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify({ ...editingReview, reviewId })
            });

            if (response.ok) {
                const updatedReview = await response.json();
                onReviewUpdated(updatedReview);
                setEditingReview(null);
                setSuccessMessage('Review updated successfully!');
            } else {
                throw new Error('Failed to update review');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    /**
     * Handles deleting a review
     * @param {string} reviewId - The ID of the review to delete
     */
    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await fetch(`/api/products/${productId}/reviews`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`
                }
            });

            if (response.ok) {
                onReviewDeleted(reviewId);
                setSuccessMessage('Review deleted successfully!');
            } else {
                throw new Error('Failed to delete review');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    /**
     * Renders star rating
     * @param {number} rating - The rating to render
     * @returns {JSX.Element} Star rating display
     */
    const renderStars = (rating) => {
        return (
            <div className="flex text-black" aria-label={`Rating: ${rating} out of 5`}>
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-2xl ${i < rating ? "text-black" : "text-gray-300"}`}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8 mt-12 p-8 border-t">
            <h2 className="text-xl font-bold mb-4 text-primary">Customer Reviews</h2>
            {error && <div className="text-red-600">{error}</div>}
            {successMessage && <div className="text-green-600">{successMessage}</div>}

            {!isSignedIn && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <h3 className="text-lg font-semibold mb-4">Sign In</h3>
                    <div className="mb-4">
                        <label className="block mb-2">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded w-full"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 rounded w-full"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button onClick={handleSignIn} className="bg-primary text-white py-2 px-4 rounded">
                        Sign In
                    </button>
                </div>
            )}

            {isSignedIn && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Add a Review</h3>
                    <div className="mb-4">
                        <label className="block mb-2">Rating:</label>
                        <select
                            value={newReview.rating}
                            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                            className="border p-2 rounded w-full"
                        >
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <option key={rating} value={rating}>
                                    {rating}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Comment:</label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            className="border p-2 rounded w-full"
                            placeholder="Enter your review"
                        />
                    </div>
                    <button onClick={handleAddReview} className="bg- text-white py-2 px-4 rounded">
                        Submit Review
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary">Customer reviews:</h3>
                <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="p-2 border rounded-md text-secondary"
                >
                    <option value="">Sort by</option>
                    <option value="date-desc">Most Recent</option>
                    <option value="date-asc">Oldest</option>
                    <option value="rating-desc">Highest Rating</option>
                    <option value="rating-asc">Lowest Rating</option>
                </select>
            </div>

            <div className="space-y-6">
                {sortedReviews.map((review, index) => (
                    <div key={index} className="card rounded-lg shadow-md p-6 transition-transform duration-300 hover:scale-105">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-lg text-black">{review.reviewerName}</span>
                            <span className="text-sm text-primary">
                                {new Date(review.date).toLocaleDateString('en-GB')}
                            </span>
                        </div>
                        <div className="flex items-center mb-2">
                            {renderStars(review.rating)}
                            <span className="text-primary ml-2">{review.rating} / 5</span>
                        </div>
                        <p className="text-black">{review.comment}</p>
                        {user && user.email === review.reviewerEmail && (
                            <div className="mt-4">
                                <button onClick={() => setEditingReview(review)} className="text-blue-600 mr-2">Edit</button>
                                <button onClick={() => handleDeleteReview(review.id)} className="text-red-600">Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
