import { getAuth } from "firebase-admin/auth";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { idToken } = req.body;

        // Verify the token
        try {
            await getAuth().verifyIdToken(idToken);

            // Set the token as an HTTP-only cookie
            res.setHeader('Set-Cookie', `session=${idToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    } else {
        res.status(405).end();
    }
}