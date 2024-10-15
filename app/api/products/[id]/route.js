/**
 * GET API endpoint for retrieving a specific product by ID.
 *
 * @param {Request} request - The request object.
 * @param {Object} params - Route parameters containing the product ID.
 * @returns {NextResponse} - A JSON response with the product data or an error message.
 */
import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * @function GET
 * @async
 * @description Retrieves a specific product by ID
 * @param {Object} request - The incoming request object
 * @param {Object} params - Route parameters
 * @param {string} params.id - The product ID
 * @returns {Promise<NextResponse>} JSON response containing the product data
 * @throws {Error} If there's an issue retrieving the product
 */
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
