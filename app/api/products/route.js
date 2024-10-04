import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, query, orderBy, limit, startAfter, getDocs, where } from 'firebase/firestore';
import Fuse from 'fuse.js';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize')) || 20;
    const lastProductId = searchParams.get('lastProductId') || null;
    const lastPrice = parseFloat(searchParams.get('lastPrice')) || null;
    const searchTerm = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'id';

    try {
        let productsQuery = collection(db, 'products');

        // Apply category filter if provided
        if (category) {
            productsQuery = query(productsQuery, where('category', '==', category));
        }

        // Apply sorting
        if (sort === 'price_asc') {
            productsQuery = query(productsQuery, orderBy('price', 'asc'), orderBy('id'));
        } else if (sort === 'price_desc') {
            productsQuery = query(productsQuery, orderBy('price', 'desc'), orderBy('id'));
        } else {
            productsQuery = query(productsQuery, orderBy('id'));
        }

        // Apply pagination
        if (lastProductId && lastPrice !== null) {
            if (sort === 'price_asc') {
                productsQuery = query(productsQuery, startAfter(lastPrice, lastProductId));
            } else if (sort === 'price_desc') {
                productsQuery = query(productsQuery, startAfter(lastPrice, lastProductId));
            } else {
                productsQuery = query(productsQuery, startAfter(lastProductId));
            }
        }

        productsQuery = query(productsQuery, limit(pageSize * 2)); // Fetch more to allow for filtering  

        const productsSnapshot = await getDocs(productsQuery);
        let products = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // If there's a search term, use Fuse.js to filter the products
        if (searchTerm) {
            const fuse = new Fuse(products, {
                keys: ['title', 'description'],
                threshold: 0.3
            });
            products = fuse.search(searchTerm).map(result => result.item);
        }

        // Trim the results to the requested page size
        products = products.slice(0, pageSize);

        const lastProduct = products.length > 0 ? products[products.length - 1] : null;

        return NextResponse.json({
            products,
            lastProductId: lastProduct ? lastProduct.id : null,
            lastPrice: lastProduct ? lastProduct.price : null,
            hasMore: products.length === pageSize
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}