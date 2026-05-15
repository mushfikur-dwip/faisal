import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AdminPage from './AdminPage';
import { fetchGalleryItems } from './api/gallery';

interface GalleryItem {
  id?: string;
  caption: string;
  image: string;
  uploadedAt?: string;
}

export default function App() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load gallery items from Firebase on app start
  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setIsLoading(true);
    try {
      const items = await fetchGalleryItems();
      setGalleryItems(items);
    } catch (error) {
      console.error('Failed to load gallery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

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
