/**
 * @module api/user
 * @description Handles user session verification
 */
import { getAuth } from "firebase-admin/auth";

/**
 * @function handler
 * @async
 * @description Handles requests to verify user session
 * @param {Object} req - The incoming request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
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
