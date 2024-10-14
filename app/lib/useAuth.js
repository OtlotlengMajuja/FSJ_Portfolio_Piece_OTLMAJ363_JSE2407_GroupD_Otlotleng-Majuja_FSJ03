'use client'

import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

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