import { verifyIdToken } from '../../middleware/verifyToken';

export default async function handler(req, res) {
    await verifyIdToken(req, res, async () => {
        res.status(200).json({ message: 'This is a protected route' });
    });
}
