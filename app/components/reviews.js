'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Reviews component that displays a list of customer reviews for a product.
 * The reviews can be sorted by the most recent date or by rating.
 *
 * @param {Object} props - The properties passed to the Reviews component.
 * @param {Object[]} props.reviews - An array of review objects to be displayed.
 * @param {string} props.reviews[].reviewerName - The name of the person who wrote the review.
 * @param {string} props.reviews[].date - The date the review was written, in a valid date format.
 * @param {number} props.reviews[].rating - The rating given by the reviewer, between 1 and 5.
 * @param {string} props.reviews[].comment - The review text or comment provided by the customer.
 * 
 * @returns {JSX.Element} A list of customer reviews, including reviewer name, date, rating, and comment.
 */
export default function Reviews({ reviews }) {
    const router = useRouter(); // Hook to handle routing
    const [sortOption, setSortOption] = useState(''); // State to track the selected sort option
    const [sortedReviews, setSortedReviews] = useState(reviews);

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

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    return (
        <div className="mt-12 p-8 border-t">
            {/* Section heading and sort dropdown */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold mb-4 text-primary">Customer reviews:</h3>
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

            {/* List of reviews */}
            <div className="space-y-6">
                {/* Map over the reviews array and render each review */}
                {sortedReviews.map((review, index) => (
                    <div key={index} className="card rounded-lg shadow-md p-6 transition-transform duration-300 hover:scale-105">
                        {/* Reviewer name and date */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-lg text-black">{review.reviewerName}</span>
                            <span className="text-sm text-primary">
                                {new Date(review.date).toLocaleDateString('en-GB')}
                            </span>
                        </div>

                        {/* Star rating display */}
                        <div className="flex items-center mb-2">
                            <div className="text-black-500 mr-2">
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                            <span className="text-primary">{review.rating} / 5</span>
                        </div>

                        {/* Review comment */}
                        <p className="text-black">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
