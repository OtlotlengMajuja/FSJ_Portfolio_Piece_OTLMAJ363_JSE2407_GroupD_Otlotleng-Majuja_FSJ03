import { auth } from "./firebase";

export const verifyIdToken = async (req, res, next) => {
    const idToken = req.headers.authorization;

    if (idToken) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }

};
