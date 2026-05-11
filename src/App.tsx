import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AdminPage from './AdminPage';

interface GalleryItem {
  id?: string;
  caption: string;
  image: string;
  uploadedAt?: string;
}

export default function App() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      caption: 'জনসেবামূলক সভা',
      image:
        'https://images.unsplash.com/photo-1468779065891-103dac4a7c48?auto=format&fit=crop&w=900&q=80',
    },
    {
      caption: 'শিক্ষা উন্নয়ন কার্যক্রম',
      image:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    },
    {
      caption: 'যুব সংগঠনের সাথে',
      image:
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
    },
    {
      caption: 'গ্রামীণ উন্নয়ন ভিজিট',
      image:
        'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&w=900&q=80',
    },
    {
      caption: 'শীতবস্ত্র বিতরণ',
      image:
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
    },
    {
      caption: 'নির্বাচনী প্রচারণা',
      image:
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80',
    },
  ]);

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
