import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from "firebase/auth";

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

export const signOutUser = async () => {
    try {
        await firebaseSignOut(auth);
        await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
        console.error("Sign-out error:", error);
        throw error;
    }
};

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

export const getCurrentUser = async () => {
    const response = await fetch('/api/user');
    if (response.ok) {
        return response.json();
    }
    return null;
};
