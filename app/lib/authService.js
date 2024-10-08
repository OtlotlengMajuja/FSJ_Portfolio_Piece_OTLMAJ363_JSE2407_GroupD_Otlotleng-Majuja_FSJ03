import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        // Send token to backend to set as an HTTP-only cookie
        await fetch('/api/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
        });

        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

export const listenToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback)
};
