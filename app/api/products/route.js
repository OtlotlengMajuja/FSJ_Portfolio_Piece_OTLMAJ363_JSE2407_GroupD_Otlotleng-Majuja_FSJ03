// create API endpoints
import { db } from '@/app/lib/firebase';
import { collection, query, getDocs, orderBy, limit, startAfter, where } from 'firebase/firestore';
import Fuse from 'fuse.js';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 10;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'price';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    try {
        let productsQuery = collection(db, 'products');

        // Apply category filter
        if (category) {
            productsQuery = query(productsQuery, where('category', '==', category));
        }

        // Apply sorting
        productsQuery = query(productsQuery, orderBy(sortBy, sortOrder));

        // Apply pagination
        const startAtDoc = page > 1 ? await getStartAtDoc(productsQuery, page, pageSize) : null;
        productsQuery = startAtDoc
            ? query(productsQuery, startAfter(startAtDoc), limit(pageSize))
            : query(productsQuery, limit(pageSize));

        const snapshot = await getDocs(productsQuery);
        let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Search functionality using Fuse.js
        if (search) {
            const fuse = new Fuse(products, {
                keys: ['title'],
                threshold: 0.3,
            });
            products = fuse.search(search).map(result => result.item);
        }

        return new Response(JSON.stringify({
            products,
            currentPage: page,
            pageSize,
            hasMore: products.length === pageSize,
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function getStartAtDoc(query, page, pageSize) {
    const startAtSnapshot = await getDocs(query, limit((page - 1) * pageSize));
    return startAtSnapshot.docs[startAtSnapshot.docs.length - 1];
}
