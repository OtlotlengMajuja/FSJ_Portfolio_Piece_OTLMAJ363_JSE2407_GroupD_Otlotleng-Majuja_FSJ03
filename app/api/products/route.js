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
        let productsQuery = query(collection(db, 'products'));

        if (category) {
            productsQuery = query(productsQuery, where('category', '==', category));
        }

        productsQuery = query(productsQuery, orderBy(sortBy, sortOrder));
        productsQuery = query(productsQuery, limit(pageSize * page));

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

        // Pagination
        const startIndex = (page - 1) * pageSize;
        const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

        return new Response(JSON.stringify({
            products: paginatedProducts,
            totalProducts: products.length,
            currentPage: page,
            totalPages: Math.ceil(products.length / pageSize),
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}