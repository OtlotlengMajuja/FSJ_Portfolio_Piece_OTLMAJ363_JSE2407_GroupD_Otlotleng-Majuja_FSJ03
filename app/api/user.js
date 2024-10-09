import { getAuth } from "firebase-admin/auth";

export default async function handler(req, res) {
    const sessionCookie = req.cookies.session;

    if (!sessionCookie) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decodedClaims = await getAuth().verifySessionCookie(sessionCookie, true);
        res.status(200).json(decodedClaims);
    } catch (error) {
        res.status(401).json({ error: 'Invalid session' });
    }
}
