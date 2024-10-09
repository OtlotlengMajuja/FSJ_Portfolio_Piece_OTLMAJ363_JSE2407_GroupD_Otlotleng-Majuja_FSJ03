import { verifyIdToken } from '@/app/lib/authMiddleware';
import { db } from '@/app/lib/firebase-admin';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const user = await verifyIdToken(req);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { productId, reviewId } = req.query;

        if (!productId || !reviewId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const reviewRef = db.collection('products').doc(productId).collection('reviews').doc(reviewId);
        const reviewDoc = await reviewRef.get();

        if (!reviewDoc.exists) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (reviewDoc.data().reviewerEmail !== user.email) {
            return res.status(403).json({ error: 'You can only delete your own reviews' });
        }

        await reviewRef.delete();

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'An error occurred while deleting the review' });
    }
}