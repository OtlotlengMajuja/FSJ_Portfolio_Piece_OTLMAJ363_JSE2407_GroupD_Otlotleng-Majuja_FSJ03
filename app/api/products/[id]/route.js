import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request, { params }) {
    const { id } = params;

    try {
        const productDoc = await getDoc(doc(db, 'products', id));

        if (!productDoc.exists()) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const product = {
            id: productDoc.id,
            ...productDoc.data()
        };

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}