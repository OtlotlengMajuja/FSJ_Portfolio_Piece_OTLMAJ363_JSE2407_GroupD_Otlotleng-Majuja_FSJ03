// endpoint for categories
import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
    try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        const categories = new Set();

        snapshot.forEach(doc => {
            const product = doc.data();
            if (product.category) {
                categories.add(product.category);
            }
        });

        return NextResponse.json(Array.from(categories));
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
