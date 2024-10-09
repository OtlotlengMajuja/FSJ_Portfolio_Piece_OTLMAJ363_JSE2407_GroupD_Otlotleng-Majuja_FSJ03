import { useState } from 'react';
import { useAuth } from '../lib/useAuth';

export default function AddReview({ productId, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in to submit a review');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/reviews/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, rating, comment }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            const data = await response.json();
            setComment('');
            setRating(5);
            onReviewAdded(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Add Your Review</h3>
            <div className="mb-4">
                <label className="block mb-1">Rating:</label>
                <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border rounded px-2 py-1"
                >
                    {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                            {value} Star{value !== 1 ? 's' : ''}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-1">Comment:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    rows="4"
                    required
                />
            </div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}