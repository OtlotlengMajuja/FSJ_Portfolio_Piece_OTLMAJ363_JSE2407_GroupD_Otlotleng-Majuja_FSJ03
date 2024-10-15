import { db } from "@/app/lib/firebase";
import { verifyIdToken } from "@/app/lib/authMiddleware";

// Add Review
export const POST = async (req, res) => {
    await verifyIdToken(req, res, async () => {
        const { productId } = req.query;
        return addReview(req, res, productId);
    });
};

// Edit Review
export const PUT = async (req, res) => {
    await verifyIdToken(req, res, async () => {
        const { productId, id: reviewId } = req.query;
        return editReview(req, res, productId, reviewId);
    });
};

// Delete Review
export const DELETE = async (req, res) => {
    await verifyIdToken(req, res, async () => {
        const { productId, id: reviewId } = req.query;
        return deleteReview(req, res, productId, reviewId);
    });
};

async function addReview(req, res, productId) {
    try {
        const { rating, comment } = req.body;
        const { user } = req;

        const newReview = {
            rating: Number(rating),
            comment,
            date: new Date().toISOString(),
            reviewerEmail: user.email,
            reviewerName: user.name || "Anonymous",
        };

        const reviewRef = await db.collection("products").doc(productId).update({
            newReview,
        });

        res.status(201).json({
            message: "Review added successfully",
            id: reviewRef.id,
            ...newReview,
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding review", error: error.message });
    }
}

async function editReview(req, res, productId, reviewId) {
    try {
        const { rating, comment } = req.body;
        const { user } = req;

        const reviewRef = db
            .collection("products")
            .doc(productId)
            .collection("reviews")
            .doc(reviewId);
        const review = await reviewRef.get();

        if (!review.exists) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.data().reviewerEmail !== user.email) {
            return res.status(403).json({ message: "Not authorized to edit this review" });
        }

        const updatedReview = {
            rating: Number(rating),
            comment,
            date: new Date().toISOString(),
        };

        await reviewRef.update(updatedReview);

        res.status(200).json({
            message: "Review updated successfully",
            id: reviewId,
            ...updatedReview,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating review", error: error.message });
    }
}

async function deleteReview(req, res, productId, reviewId) {
    try {
        const { user } = req;

        const reviewRef = db
            .collection("products")
            .doc(productId)
            .collection("reviews")
            .doc(reviewId);
        const review = await reviewRef.get();

        if (!review.exists) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.data().reviewerEmail !== user.email) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await reviewRef.delete();

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error: error.message });
    }
}
