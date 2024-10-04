import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import Fuse from 'fuse.js';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize')) || 20;
    const lastProductId = searchParams.get('lastProductId') || null;
    const searchTerm = searchParams.get('search') || '';

    try {
        let productsQuery = query(collection(db, 'products'), orderBy('id'), limit(pageSize * 2));

        if (lastProductId) {
            const lastProductDoc = await getDocs(query(collection(db, 'products'), where('id', '==', lastProductId)));
            if (!lastProductDoc.empty) {
                productsQuery = query(productsQuery, startAfter(lastProductDoc.docs[0]));
            }
        }

        const productsSnapshot = await getDocs(productsQuery);
        const products = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // If there's a search term, use Fuse.js to filter the products
        if (searchTerm) {
            const fuse = new Fuse(products, {
                keys: ['title'],
                threshold: 0.3
            });
            products = fuse.search(searchTerm).map(result => result.item);
        }

        // Trim the results to the requested page size
        products = products.slice(0, pageSize);

        return NextResponse.json({
            products,
            lastProductId: products.length > 0 ? products[products.length - 1].id : null,
            hasMore: products.length === pageSize
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}