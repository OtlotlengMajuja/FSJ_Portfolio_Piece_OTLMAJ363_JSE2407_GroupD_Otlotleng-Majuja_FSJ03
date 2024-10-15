/**
 * @module api/login
 * @description Handles user login and session creation
 */
import { auth } from '../lib/firebase-admin';
import { serialize } from 'cookie';

/**
 * @function handler
 * @async
 * @description Handles POST requests for user login
 * @param {Object} req - The incoming request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { idToken } = req.body;

    try {
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
        const options = {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        };

        res.setHeader('Set-Cookie', serialize('session', sessionCookie, options));
        res.status(200).end();
    } catch (error) {
        res.status(401).send('UNAUTHORIZED REQUEST!');
    }
}
