import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase'; // Ensure this path is correct
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize')) || 20;
    const lastProductId = searchParams.get('lastProductId') || null;

    try {
        let productsQuery = query(collection(db, 'products'), orderBy('id'), limit(pageSize));

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