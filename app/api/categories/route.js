import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
    try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categories = categoriesSnapshot.docs.map(doc => doc.data().name);

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}