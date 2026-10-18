import fs from 'fs';
import path from 'path';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

interface GalleryItem {
  id?: string;
  caption: string;
  image: string;
  uploadedAt?: string;
}

let firestoreDb: Firestore | null = null;

function getFirestoreDb(): Firestore {
  if (firestoreDb) {
    return firestoreDb;
  }

  if (getApps().length === 0) {
    const localServiceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
    const useLocalServiceAccount =
      process.env.NODE_ENV !== 'production' && fs.existsSync(localServiceAccountPath);
    const serviceAccountCandidates = [
      process.env.GOOGLE_APPLICATION_CREDENTIALS,
      localServiceAccountPath,
    ].filter(Boolean) as string[];

    // During local development, prefer the downloaded key file. This avoids a stale
    // production-style env value silently overriding a freshly rotated local key.
    const serviceAccountJson = useLocalServiceAccount
      ? undefined
      : process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const serviceAccountPath = serviceAccountCandidates.find((candidate) => fs.existsSync(candidate));
    if (!serviceAccountJson && !serviceAccountPath) {
      throw new Error('Missing Firebase service account JSON. Set FIREBASE_SERVICE_ACCOUNT_KEY, place serviceAccountKey.json in the project root, or set GOOGLE_APPLICATION_CREDENTIALS.');
    }

    const serviceAccount = serviceAccountJson
      ? JSON.parse(serviceAccountJson)
      : JSON.parse(fs.readFileSync(serviceAccountPath as string, 'utf8'));
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  firestoreDb = getFirestore();
  return firestoreDb;
}

// Read gallery items
export async function readGallery(): Promise<GalleryItem[]> {
  try {
    const snapshot = await getFirestoreDb().collection('gallery').orderBy('uploadedAt', 'desc').get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      caption: doc.data().caption || '',
      image: doc.data().image || '',
      uploadedAt: doc.data().uploadedAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to read gallery from Firestore:', error);
    return [];
  }
}

// Write gallery items
export async function writeGallery(items: GalleryItem[]): Promise<void> {
  const db = getFirestoreDb();
  const existingDocs = await db.collection('gallery').get();
  const batch = db.batch();

  existingDocs.docs.forEach((docSnap) => batch.delete(docSnap.ref));
  items.forEach((item) => {
    const docRef = db.collection('gallery').doc(item.id);
    batch.set(docRef, {
      caption: item.caption,
      image: item.image,
      uploadedAt: item.uploadedAt || new Date().toISOString(),
    });
  });

  await batch.commit();
}

// Add new gallery items
export async function addGalleryItems(newItems: GalleryItem[]): Promise<GalleryItem[]> {
  const db = getFirestoreDb();
  const created: GalleryItem[] = [];

  for (const item of newItems) {
    const docRef = item.id ? db.collection('gallery').doc(item.id) : db.collection('gallery').doc();
    const normalized = {
      caption: item.caption,
      image: item.image,
      uploadedAt: item.uploadedAt || new Date().toISOString(),
    };
    await docRef.set(normalized, { merge: true });
    created.push({ id: docRef.id, ...normalized });
  }

  return created;
}

// Update gallery items
export async function updateGalleryItems(items: GalleryItem[]): Promise<GalleryItem[]> {
  await writeGallery(items);
  return items;
}

// Delete a gallery item
export async function deleteGalleryItem(itemId: string): Promise<GalleryItem[]> {
  const db = getFirestoreDb();
  await db.collection('gallery').doc(itemId).delete();
  return readGallery();
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const items = await readGallery();
      return res.status(200).json(items);
    }

    if (req.method === 'POST') {
      const newItems = req.body;
      if (!Array.isArray(newItems)) {
        return res.status(400).json({ error: 'Body must be an array' });
      }

      const created = await addGalleryItems(newItems);
      return res.status(200).json(created);
    }

    if (req.method === 'PUT') {
      const items = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Body must be an array' });
      }

      const updated = await updateGalleryItems(items);
      return res.status(200).json(updated);
    }

    res.setHeader('Allow', 'GET,POST,PUT');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Gallery API failed:', error);
    const message = error instanceof Error ? error.message : 'Gallery API failed';
    return res.status(500).json({ error: message });
  }
}
