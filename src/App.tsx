import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AdminPage from './AdminPage';

interface GalleryItem {
  id?: string;
  caption: string;
  image: string;
  uploadedAt?: string;
}

const GALLERY_STORAGE_KEY = 'faisal-gallery-items';

export default function App() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const savedItems = localStorage.getItem(GALLERY_STORAGE_KEY);
      if (!savedItems) return [];

      const parsedItems = JSON.parse(savedItems) as GalleryItem[];
      return Array.isArray(parsedItems) ? parsedItems : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(galleryItems));
  }, [galleryItems]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={<HomePage galleryItems={galleryItems} onGalleryUpdate={setGalleryItems} />} 
      />
      <Route 
        path="/admin" 
        element={<AdminPage currentGallery={galleryItems} onGalleryUpdate={setGalleryItems} />} 
      />
    </Routes>
  );
}
