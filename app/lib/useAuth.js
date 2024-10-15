'use client'

import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

/**
 * Custom React hook that manages Firebase Authentication state.
 * Provides signIn, signOut, and the user's authentication status.
 *
 * @returns {Object} An object containing:
 * - `user` (Object|null): The current authenticated user, or null if not signed in.
 * - `loading` (boolean): A flag indicating if the authentication state is still loading.
 * - `signIn` (Function): A function to sign in the user.
 * - `signOut` (Function): A function to sign out the user.
 */
export const useAuth = () => {
    const [authState, setAuthState] = useState({ user: null, loading: true });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthState({ user, loading: false });
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const signOut = async () => {
        await auth.signOut();
        setAuthState({ user: null, loading: false });
    };

    return { ...authState, signIn, signOut };
};