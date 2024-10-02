// endpoints for individual products
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request, { params }) {
    const { id } = params;

    try {
        const productDoc = await getDoc(doc(db, 'products', id));

        if (!productDoc.exists()) {
            return new Response(JSON.stringify({ error: 'Product not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const product = { id: productDoc.id, ...productDoc.data() };

        return new Response(JSON.stringify(product), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch product' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}