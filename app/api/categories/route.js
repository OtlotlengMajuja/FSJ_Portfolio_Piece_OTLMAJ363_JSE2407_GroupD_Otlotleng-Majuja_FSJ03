/**
 * GET API endpoint for retrieving unique product categories.
 * 
 * @returns {NextResponse} - A JSON response with an array of unique categories.
 */
import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * @function GET
 * @async
 * @description Retrieves all unique product categories from the database
 * @returns {Promise<NextResponse>} JSON response containing an array of unique categories
 * @throws {Error} If there's an issue retrieving the categories
 */
export async function GET() {
    try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        const categories = new Set();

        // Loop through product documents and collect categories
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
