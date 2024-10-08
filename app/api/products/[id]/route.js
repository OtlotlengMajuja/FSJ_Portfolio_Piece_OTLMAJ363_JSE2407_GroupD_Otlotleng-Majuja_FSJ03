// endpoints for individual products
import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request, { params }) {
    const { id } = params;
    // Pad the product's ID with leading zeros (assuming max 3 digits)
    const paddedId = id.toString().padStart(3, "0");

    try {
        const productDoc = doc(db, 'products', paddedId);
        const docSnap = await getDoc(productDoc);

        if (!docSnap.exists()) {
            return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
        }

        return NextResponse.json(docSnap.data());
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}