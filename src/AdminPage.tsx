import { useState, useEffect } from 'react';
import { Upload, X, Lock, LogOut, Loader, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface GalleryItem {
  id?: string;
  caption: string;
  image: string;
  uploadedAt?: string;
}

interface AdminPageProps {
  onGalleryUpdate: (items: GalleryItem[]) => void;
  currentGallery: GalleryItem[];
}

export default function AdminPage({ onGalleryUpdate, currentGallery }: AdminPageProps) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});
  const [captionDrafts, setCaptionDrafts] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  // Check if already authenticated (from localStorage)
  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    setCaptionDrafts(currentGallery.map((item) => item.caption || ''));
  }, [currentGallery]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      setPassword('');
      setSuccess('লগইন সফল!');
      setTimeout(() => setSuccess(''), 2000);
    } else {
      setError('পাসওয়ার্ড ভুল!');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const caption = (captionDrafts[itemIndex] || '').trim();
    if (!caption) {
      setError('ছবি আপলোডের আগে ক্যাপশন লিখুন।');
      return;
    }

    setUploadingFiles(prev => ({ ...prev, [itemIndex]: true }));
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'faisal_gallery');
      formData.append('folder', 'faisal-gallery');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const updatedGallery = [...currentGallery];
      updatedGallery[itemIndex] = {
        ...updatedGallery[itemIndex],
        caption,
        image: data.secure_url,
        uploadedAt: new Date().toISOString(),
      };

      onGalleryUpdate(updatedGallery);
      setSuccess('ছবি আপডেট সফল!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('ছবি আপলোড ব্যর্থ। আবার চেষ্টা করুন।');
      console.error(err);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [itemIndex]: false }));
    }
  };

  const handleDeleteImage = (itemIndex: number) => {
    const updatedGallery = [...currentGallery];
    updatedGallery[itemIndex] = {
      ...updatedGallery[itemIndex],
      caption: captionDrafts[itemIndex] || updatedGallery[itemIndex].caption,
      image: 'https://images.unsplash.com/photo-1606857521220-98e5dba7214e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    };
    onGalleryUpdate(updatedGallery);
    setSuccess('ছবি মুছে ফেলা হয়েছে।');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleCaptionChange = (itemIndex: number, value: string) => {
    setCaptionDrafts((prev) => {
      const next = [...prev];
      next[itemIndex] = value;
      return next;
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setPassword('');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#1a4a8d] to-[#d92c2c] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8" />
            <h1 className="text-3xl font-bold">গ্যালারি ম্যানেজমেন্ট সিস্টেম</h1>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition font-semibold"
            >
              <LogOut className="w-5 h-5" />
              লগআউট
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isAuthenticated ? (
          // Login Section
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1a4a8d] to-[#d92c2c] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold mb-2">অ্যাডমিন প্যানেল</h2>
                <p className="text-slate-400">গ্যালারি ছবি আপডেট করতে লগইন করুন</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    পাসওয়ার্ড
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড এখানে দিন"
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 rounded"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-900 border-l-4 border-green-500 text-green-200 p-4 rounded"
                  >
                    {success}
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1a4a8d] to-blue-700 hover:from-blue-700 hover:to-[#1a4a8d] text-white font-bold py-3 rounded-lg transition shadow-lg"
                >
                  লগইন করুন
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                  ওয়েবসাইটে ফিরে যান
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          // Gallery Management Section
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-2">গ্যালারি আইটেম সম্পাদনা</h2>
                <p className="text-slate-400">সকল গ্যালারি ছবি এখানে আপডেট করুন</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
                মূল পৃষ্ঠায় যান
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-900 border-l-4 border-green-500 text-green-200 p-4 rounded-lg"
              >
                {success}
              </motion.div>
            )}

            <div className="grid gap-6">
              {currentGallery.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-800 p-6 rounded-xl border-2 border-slate-700 hover:border-blue-500 transition"
                >
                  <div className="grid md:grid-cols-4 gap-6">
                    {/* Image Preview */}
                    <div className="col-span-1">
                      <div className="aspect-square rounded-lg overflow-hidden bg-slate-700 border border-slate-600">
                        <img
                          src={item.image}
                          alt={item.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Caption and Upload */}
                    <div className="col-span-3 space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-400 mb-1 block">ক্যাপশন</label>
                        <input
                          type="text"
                          value={captionDrafts[index] || ''}
                          onChange={(e) => handleCaptionChange(index, e.target.value)}
                          placeholder="এই ছবির ক্যাপশন লিখুন"
                          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Upload Section */}
                      <div className="flex gap-3 pt-4">
                        <label className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg cursor-pointer transition">
                          {uploadingFiles[index] ? (
                            <>
                              <Loader className="w-5 h-5 animate-spin" />
                              আপলোড হচ্ছে...
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5" />
                              নতুন ছবি আপলোড করুন
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                            disabled={uploadingFiles[index]}
                            className="hidden"
                          />
                        </label>

                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2"
                        >
                          <X className="w-5 h-5" />
                          মুছুন
                        </button>
                      </div>

                      {item.uploadedAt && (
                        <p className="text-xs text-slate-500 pt-2">
                          আপলোড: {new Date(item.uploadedAt).toLocaleDateString('bn-BD')}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-900/30 border border-blue-700 p-6 rounded-lg">
              <p className="text-blue-200 text-sm leading-relaxed">
                <strong>নোট:</strong> Cloudinary এ <code className="bg-slate-700 px-2 py-1 rounded text-xs">faisal_gallery</code> নামের upload preset তৈরি করুন। 
                Dashboard এ Settings → Upload → Add upload preset এ যান।
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
