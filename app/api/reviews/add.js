import { verifyIdToken } from '@/app/lib/authMiddleware';
import { db } from '@/app/lib/firebase-admin';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Verify the user's token
        const user = await verifyIdToken(req);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { productId, rating, comment } = req.body;

        if (!productId || !rating || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Add the review to the database
        const reviewRef = db.collection('products').doc(productId).collection('reviews').doc();
        await reviewRef.set({
            rating: Number(rating),
            comment,
            date: new Date().toISOString(),
            reviewerEmail: user.email,
            reviewerName: user.name || 'Anonymous',
        });

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
        }

        res.status(200).json({ message: 'Review added successfully', reviewId: reviewRef.id });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'An error occurred while adding the review' });
    }
}