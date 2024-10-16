/**
 * @module api/products/[id]/reviews
 * @description Handles POST, PUT, and DELETE requests for product reviews
 */
import { db } from "@/app/lib/firebase";
import { verifyIdToken } from "@/app/lib/authMiddleware";

/**
 * @function POST
 * @async
 * @description Adds a new review for a product
 * @param {Object} req - The incoming request object
 * @returns {Promise<Response>} JSON response confirming the addition of the review
 * @throws {Error} If there's an issue adding the review
 */
// Add Review
export async function POST(req) {
    return await verifyIdToken(req, async (user) => {
        const { id: productId } = req.params;
        const { rating, comment } = await req.json();

        try {
            const newReview = {
                rating: Number(rating),
                comment,
                date: new Date().toISOString(),
                reviewerEmail: user.email,
                reviewerName: user.displayName || "Anonymous",
            };

            const productRef = db.collection("products").doc(productId);
            const reviewRef = await productRef.collection("reviews").add(newReview);

            return Response.json({
                message: "Review added successfully",
                id: reviewRef.id,
                ...newReview,
            }, { status: 201 });
        } catch (error) {
            return Response.json({ message: "Error adding review", error: error.message }, { status: 500 });
        }
    });
}

/**
 * @function PUT
 * @async
 * @description Updates an existing review for a product
 * @param {Object} req - The incoming request object
 * @returns {Promise<Response>} JSON response confirming the update of the review
 * @throws {Error} If there's an issue updating the review
 */
// Edit Review
export async function PUT(req) {
    return await verifyIdToken(req, async (user) => {
        const { id: productId, reviewId } = req.params;
        const { rating, comment } = await req.json();

        try {
            const reviewRef = db
                .collection("products")
                .doc(productId)
                .collection("reviews")
                .doc(reviewId);
            const review = await reviewRef.get();

            if (!review.exists) {
                return Response.json({ message: "Review not found" }, { status: 404 });
            }

            if (review.data().reviewerEmail !== user.email) {
                return Response.json({ message: "Not authorized to edit this review" }, { status: 403 });
            }

            const updatedReview = {
                rating: Number(rating),
                comment,
                date: new Date().toISOString(),
            };

            await reviewRef.update(updatedReview);

            return Response.json({
                message: "Review updated successfully",
                id: reviewId,
                ...updatedReview,
            }, { status: 200 });
        } catch (error) {
            return Response.json({ message: "Error updating review", error: error.message }, { status: 500 });
        }
    });
}

/**
 * @function DELETE
 * @async
 * @description Deletes a review for a product
 * @param {Object} req - The incoming request object
 * @returns {Promise<Response>} JSON response confirming the deletion of the review
 * @throws {Error} If there's an issue deleting the review
 */
// Delete Review
export async function DELETE(req) {
    return await verifyIdToken(req, async (user) => {
        const { id: productId, reviewId } = req.params;

        try {
            const reviewRef = db
                .collection("products")
                .doc(productId)
                .collection("reviews")
                .doc(reviewId);
            const review = await reviewRef.get();

            if (!review.exists) {
                return Response.json({ message: "Review not found" }, { status: 404 });
            }

            if (review.data().reviewerEmail !== user.email) {
                return Response.json({ message: "Not authorized to delete this review" }, { status: 403 });
            }

            await reviewRef.delete();

            return Response.json({ message: "Review deleted successfully" }, { status: 200 });
        } catch (error) {
            return Response.json({ message: "Error deleting review", error: error.message }, { status: 500 });
        }
    });
}