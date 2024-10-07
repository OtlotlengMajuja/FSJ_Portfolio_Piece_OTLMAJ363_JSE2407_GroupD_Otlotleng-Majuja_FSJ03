// endpoint for categories
import { db } from '@/app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
    try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories', "allCategories"));
        const categories = categoriesSnapshot.docs.map(doc => doc.data());

        return new Response(JSON.stringify(categories), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}