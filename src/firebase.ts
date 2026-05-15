import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';

interface GalleryItem {
  id?: string;
  caption: string;
  image: string;
  uploadedAt?: string;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredFirebase = !!(firebaseConfig.apiKey && firebaseConfig.projectId);
export const firebaseEnabled = requiredFirebase;

// Fallback storage key and helpers
const LS_KEY = 'faisal-gallery-items';
const readLocal = (): GalleryItem[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const writeLocal = (items: GalleryItem[]) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
};

if (!requiredFirebase) {
  console.warn('Firebase env vars missing — using localStorage fallback for gallery.');
}

let db: ReturnType<typeof getFirestore> | null = null;
if (requiredFirebase) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

// Fetch all gallery items (Firebase when configured, otherwise localStorage)
export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  if (!requiredFirebase || !db) {
    return Promise.resolve(readLocal());
  }

  try {
    const q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({
      id: d.id,
      caption: (d.data() as any).caption || '',
      image: (d.data() as any).image || '',
      uploadedAt: (d.data() as any).uploadedAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch gallery from Firebase:', error);
    return readLocal();
  }
}

// Save/update all gallery items
export async function saveGalleryItems(items: GalleryItem[]): Promise<GalleryItem[]> {
  if (!requiredFirebase || !db) {
    writeLocal(items);
    return Promise.resolve(items);
  }

  try {
    // Delete existing items first (simplified approach)
    const existingDocs = await getDocs(collection(db, 'gallery'));
    for (const docSnapshot of existingDocs.docs) {
      await deleteDoc(doc(db, 'gallery', docSnapshot.id));
    }

    // Add new items
    const savedItems: GalleryItem[] = [];
    for (const item of items) {
      const docRef = await addDoc(collection(db, 'gallery'), {
        caption: item.caption,
        image: item.image,
        uploadedAt: item.uploadedAt || new Date().toISOString(),
      });
      savedItems.push({
        id: docRef.id,
        ...item,
      });
    }
    return savedItems;
  } catch (error) {
    console.error('Failed to save gallery to Firebase:', error);
    throw error;
  }
}

// Add new gallery items
export async function addGalleryItems(newItems: GalleryItem[]): Promise<GalleryItem[]> {
  if (!requiredFirebase || !db) {
    const prev = readLocal();
    const items = [...prev, ...newItems.map((i, idx) => ({ id: `${Date.now()}-${idx}`, ...i }))];
    writeLocal(items);
    return Promise.resolve(items.slice(prev.length));
  }

  try {
    const addedItems: GalleryItem[] = [];
    for (const item of newItems) {
      const docRef = await addDoc(collection(db, 'gallery'), {
        caption: item.caption,
        image: item.image,
        uploadedAt: item.uploadedAt || new Date().toISOString(),
      });
      addedItems.push({
        id: docRef.id,
        ...item,
      });
    }
    return addedItems;
  } catch (error) {
    console.error('Failed to add gallery items to Firebase:', error);
    throw error;
  }
}

// Delete a specific gallery item
export async function deleteGalleryItem(itemId: string): Promise<void> {
  if (!requiredFirebase || !db) {
    const items = readLocal().filter((it) => it.id !== itemId);
    writeLocal(items);
    return Promise.resolve();
  }

  try {
    await deleteDoc(doc(db, 'gallery', itemId));
  } catch (error) {
    console.error('Failed to delete gallery item from Firebase:', error);
    throw error;
  }
}

// Update a specific gallery item
export async function updateGalleryItem(
  itemId: string,
  updates: Partial<GalleryItem>
): Promise<void> {
  if (!requiredFirebase || !db) {
    const items = readLocal().map((it) => (it.id === itemId ? { ...it, ...updates } : it));
    writeLocal(items);
    return Promise.resolve();
  }

  try {
    const docRef = doc(db, 'gallery', itemId);
    await updateDoc(docRef, {
      caption: updates.caption,
      image: updates.image,
      uploadedAt: updates.uploadedAt || new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to update gallery item in Firebase:', error);
    throw error;
  }
}
