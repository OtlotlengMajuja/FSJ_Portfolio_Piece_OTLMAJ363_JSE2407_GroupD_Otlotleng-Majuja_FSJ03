'use client';

import { useAuth } from './lib/useAuth';
import Loading from './loading';

export function AuthProvider({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    return children;
}