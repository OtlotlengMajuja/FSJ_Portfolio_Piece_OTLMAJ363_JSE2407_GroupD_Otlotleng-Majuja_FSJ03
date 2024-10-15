import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from "firebase/auth";

/**
 * Signs up a user with email and password using Firebase Authentication.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} A promise that resolves to the signed-up user's data.
 * @throws {Error} If the sign-up process fails.
 */
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createSession(userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Sign-up error:", error);
        throw error;
    }
};

/**
 * Signs in a user with email and password using Firebase Authentication.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} A promise that resolves to the signed-in user's data.
 * @throws {Error} If the sign-in process fails, with a custom error message for invalid credentials.
 */
export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await createSession(userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Sign-in error:", error);
        if (error.code === 'auth/invalid-credential') {
            throw new Error('Invalid email or password. Please try again.');
        }
        throw error;
    }
};

/**
 * Signs out the currently authenticated user from Firebase and ends their session.
 *
 * @returns {Promise<void>} A promise that resolves when the user is signed out.
 * @throws {Error} If the sign-out process fails.
 */
export const signOutUser = async () => {
    try {
        await firebaseSignOut(auth);
        await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
        console.error("Sign-out error:", error);
        throw error;
    }
};

/**
 * Creates a session for the authenticated user by sending the ID token to the backend.
 *
 * @param {Object} user - The authenticated user object.
 * @returns {Promise<void>} A promise that resolves when the session is created.
 */
const createSession = async (user) => {
    const idToken = await user.getIdToken();
    await fetch('/api/session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
    });
};

/**
 * Retrieves the current authenticated user's information from the backend API.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the current user's data, or null if not authenticated.
 */
export const getCurrentUser = async () => {
    const response = await fetch('/api/user');
    if (response.ok) {
        return response.json();
    }
    return null;
};
