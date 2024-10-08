// endpoint for categories
import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { verifyIdToken } from '@/app/lib/authMiddleware';

export async function GET() {
    return verifyIdToken(request, null, async () => {
        try {
            const categoriesSnapshot = await getDocs(collection(db, 'categories', "allCategories"));
            const categories = categoriesSnapshot.docs.map(doc => doc.data());

            return NextResponse.json(categories);
        } catch (error) {
            return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
        }
    });
}