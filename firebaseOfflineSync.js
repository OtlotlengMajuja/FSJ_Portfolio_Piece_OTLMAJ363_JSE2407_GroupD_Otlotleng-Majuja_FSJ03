import { db } from './app/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const OFFLINE_STORAGE_KEY = 'offlineChanges';

/**
 * Saves an offline change to local storage.
 * This function stores the details of changes made while offline, 
 * including the collection name, document ID, and data to be saved.
 *
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} documentId - The ID of the document to update or create.
 * @param {Object} data - The data to be saved in the document.
 */
export function saveOfflineChange(collectionName, documentId, data) {
    const offlineChanges = JSON.parse(localStorage.getItem(OFFLINE_STORAGE_KEY) || '[]');
    offlineChanges.push({ collectionName, documentId, data });
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineChanges));
}

/**
 * Synchronizes offline changes stored in local storage with Firestore.
 * This function attempts to apply all offline changes to Firestore
 * once the application is back online. It removes the changes from
 * local storage after successful syncing.
 *
 * @returns {Promise<void>} - A promise that resolves when all changes are synced.
 */
export async function syncOfflineChanges() {
    const offlineChanges = JSON.parse(localStorage.getItem(OFFLINE_STORAGE_KEY) || '[]');

    for (const change of offlineChanges) {
        const { collectionName, documentId, data } = change;
        const docRef = doc(db, collectionName, documentId);

        try {
            await setDoc(docRef, data, { merge: true });
        } catch (error) {
            console.error('Error syncing offline change:', error);
        }
    }

    localStorage.removeItem(OFFLINE_STORAGE_KEY);
}

/**
 * Event listener that triggers synchronization of offline changes 
 * when the application comes back online. It calls the syncOfflineChanges 
 * function to process any pending changes.
 */
window.addEventListener('online', syncOfflineChanges);
