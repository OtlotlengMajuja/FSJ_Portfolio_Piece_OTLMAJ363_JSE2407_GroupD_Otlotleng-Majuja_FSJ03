/**
 * @module api/protected
 * @description Handles requests to a protected route
 */
import { verifyIdToken } from "@/app/lib/authMiddleware";

/**
 * @function handler
 * @async
 * @description Handles requests to a protected route
 * @param {Object} req - The incoming request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
export default async function handler(req, res) {
    await verifyIdToken(req, res, async () => {
        res.status(200).json({ message: 'This is a protected route' });
    });
}