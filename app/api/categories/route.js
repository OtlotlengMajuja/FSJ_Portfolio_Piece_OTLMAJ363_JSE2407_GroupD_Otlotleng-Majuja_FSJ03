// endpoint for categories
import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { doc, getDocs } from 'firebase/firestore';

export async function GET() {
    try {
        const categoriesDocRef = doc(db, "categories", "allCategories");
        const docSnap = await getDoc(categoriesDocRef);

        // Check if the document exists
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Categories data:", data);

            // Check if the categories array exists in the document
            if (data && Array.isArray(data.categories)) {
                return NextResponse.json(data.categories);
            } else {
                console.log("Categories array not found in the document");
                return NextResponse.json(
                    { error: "Categories not found" },
                    { status: 404 }
                );
            }
        } else {
            console.log("No such document!");
            return NextResponse.json(
                { error: "Categories document not found" },
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}
