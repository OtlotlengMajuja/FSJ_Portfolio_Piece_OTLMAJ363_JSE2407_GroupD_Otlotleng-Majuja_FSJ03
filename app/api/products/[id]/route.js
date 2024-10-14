// /api/product/[id]/route.js
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
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Return the product data along with its ID
        return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}