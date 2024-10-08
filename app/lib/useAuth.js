import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
    const [authState, setAuthState] = useState({ user: null, loading: true });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthState({ user, loading: false });
        });

        return () => unsubscribe();
    }, []);

    return authState;
};