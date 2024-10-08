// endpoints for individual products
import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { verifyIdToken } from '@/app/lib/authMiddleware';

export async function GET(request, { params }) {
    return verifyIdToken(request, null, async () => {
        const { id } = params;
        // Pad the product's ID with leading zeros (assuming max 3 digits)
        const paddedId = id.toString().padStart(3, "0");

        try {
            const productDoc = await getDoc(doc(db, 'products', paddedId));

            if (!productDoc.exists()) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }

            const product = { id: productDoc.id, ...productDoc.data() };

            return NextResponse.json(product);
        } catch (error) {
            return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
        }
    });
}