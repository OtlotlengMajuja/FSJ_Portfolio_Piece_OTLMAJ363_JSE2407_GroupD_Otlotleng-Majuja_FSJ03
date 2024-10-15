import { verifyIdToken } from "@/app/lib/authMiddleware";

export default async function handler(req, res) {
    await verifyIdToken(req, res, async () => {
        res.status(200).json({ message: 'This is a protected route' });
    });
}