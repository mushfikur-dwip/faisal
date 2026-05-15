/*
  Usage:
  1. Save your exported local items JSON into ./local_items.json
     Use the output of:
       JSON.parse(localStorage.getItem('faisal-gallery-items') || '[]')
  2. Save your Firebase service account key as ./serviceAccountKey.json
     Firebase Console -> Project Settings -> Service accounts -> Generate new private key
  3. Run:
       npm run migrate:firestore
     or
       node ./scripts/migrateLocalToFirestore.cjs
*/

const fs = require('fs');
const path = require('path');

async function main() {
  const localPath = path.join(__dirname, '..', 'local_items.json');
  const servicePath = path.join(__dirname, '..', 'serviceAccountKey.json');

  if (!fs.existsSync(localPath)) {
    console.error('Missing local_items.json. Paste the clipboard contents into that file first.');
    process.exit(1);
  }

  if (!fs.existsSync(servicePath)) {
    console.error('Missing serviceAccountKey.json. Download it from Firebase Console -> Service accounts.');
    process.exit(1);
  }

  const admin = require('firebase-admin');
  const serviceAccount = require(servicePath);

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Failed to initialize firebase-admin:', error && error.message ? error.message : error);
    process.exit(1);
  }

  let items;
  try {
    const raw = fs.readFileSync(localPath, 'utf8');
    items = JSON.parse(raw);
    if (!Array.isArray(items)) {
      throw new Error('local_items.json must contain an array');
    }
  } catch (error) {
    console.error('Failed to read local_items.json:', error && error.message ? error.message : error);
    process.exit(1);
  }

  const db = admin.firestore();
  console.log(`Found ${items.length} items. Uploading to Firestore collection "gallery"...`);

  let successCount = 0;
  for (const item of items) {
    const doc = {
      caption: item.caption || '',
      image: item.image || '',
      uploadedAt: item.uploadedAt || new Date().toISOString(),
    };

    try {
      const ref = await db.collection('gallery').add(doc);
      successCount += 1;
      console.log(`Created ${ref.id}`);
    } catch (error) {
      console.error('Failed to create a Firestore document:', error && error.message ? error.message : error);
    }
  }

  console.log(`Done. Created ${successCount} documents.`);
}

main().catch((error) => {
  console.error('Migration failed:', error && error.message ? error.message : error);
  process.exit(1);
});
