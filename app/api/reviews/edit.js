import { verifyIdToken } from '@/app/lib/authMiddleware';
import { db } from '@/app/lib/firebase-admin';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const user = await verifyIdToken(req);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { productId, reviewId, rating, comment } = req.body;

        if (!productId || !reviewId || !rating || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const reviewRef = db.collection('products').doc(productId).collection('reviews').doc(reviewId);
        const reviewDoc = await reviewRef.get();

        if (!reviewDoc.exists) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (reviewDoc.data().reviewerEmail !== user.email) {
            return res.status(403).json({ error: 'You can only edit your own reviews' });
        }

        await reviewRef.update({
            rating: Number(rating),
            comment,
            date: new Date().toISOString(),
        });

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
        }

        res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'An error occurred while updating the review' });
    }
}