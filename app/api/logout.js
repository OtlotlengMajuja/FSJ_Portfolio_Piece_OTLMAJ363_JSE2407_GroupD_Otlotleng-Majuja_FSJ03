/**
 * @module api/logout
 * @description Handles user logout
 */
import { serialize } from 'cookie';

/**
 * @function handler
 * @async
 * @description Handles POST requests for user logout
 * @param {Object} req - The incoming request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    res.setHeader('Set-Cookie', 'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    res.status(200).json({ success: true });
}
