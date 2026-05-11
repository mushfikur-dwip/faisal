import { useState, useEffect } from 'react';
import { Upload, X, Lock, LogOut, Loader, ArrowLeft, ImagePlus, Sparkles, FolderOpen } from 'lucide-react';
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
  const [bulkCaption, setBulkCaption] = useState('');
  const [selectedBulkFiles, setSelectedBulkFiles] = useState<File[]>([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
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

  const persistGallery = (items: GalleryItem[]) => {
    onGalleryUpdate(items);
    localStorage.setItem('faisal-gallery-items', JSON.stringify(items));
  };

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

      persistGallery(updatedGallery);
      setSuccess('ছবি আপডেট সফল!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('ছবি আপলোড ব্যর্থ। আবার চেষ্টা করুন।');
      console.error(err);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [itemIndex]: false }));
    }
  };

  const handleBulkFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedBulkFiles(files);
    setError('');
  };

  const handleBulkUpload = async () => {
    if (!selectedBulkFiles.length) {
      setError('কমপক্ষে একটি ছবি নির্বাচন করুন।');
      return;
    }

    const caption = bulkCaption.trim();
    if (!caption) {
      setError('বাল্ক আপলোডের আগে ক্যাপশন লিখুন।');
      return;
    }

    if (!cloudName) {
      setError('Cloudinary cloud name সেট করা নেই। .env চেক করুন।');
      return;
    }

    setIsBulkUploading(true);
    setError('');
    setSuccess('');

    try {
      const uploadPromises = selectedBulkFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'faisal_gallery');
        formData.append('folder', 'faisal-gallery');

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const responseText = await response.text();
        const responseData = responseText ? JSON.parse(responseText) : {};

        if (!response.ok) {
          throw new Error(responseData?.error?.message || 'Upload failed');
        }

        return {
          caption,
          image: responseData.secure_url,
          uploadedAt: new Date().toISOString(),
        };
      });

      const uploadedItems = await Promise.all(uploadPromises);
      persistGallery([...currentGallery, ...uploadedItems]);
      setSuccess(`${selectedBulkFiles.length} টি ছবি সফলভাবে আপলোড হয়েছে!`);
      setBulkCaption('');
      setSelectedBulkFiles([]);
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`বাল্ক আপলোড ব্যর্থ: ${message}`);
      console.error(err);
    } finally {
      setIsBulkUploading(false);
    }
  };

  const handleDeleteImage = (itemIndex: number) => {
    const updatedGallery = [...currentGallery];
    updatedGallery[itemIndex] = {
      ...updatedGallery[itemIndex],
      caption: captionDrafts[itemIndex] || updatedGallery[itemIndex].caption,
      image: 'https://images.unsplash.com/photo-1606857521220-98e5dba7214e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    };
    persistGallery(updatedGallery);
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#1a4a8d] p-3 text-white shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">গ্যালারি ম্যানেজমেন্ট সিস্টেম</h1>
              <p className="text-sm text-slate-600">Bulk event upload + caption-based gallery</p>
            </div>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-[#d92c2c] px-5 py-2.5 font-semibold text-white transition hover:bg-[#b82626]"
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
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#1a4a8d] flex items-center justify-center mx-auto mb-4 text-white shadow-sm">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-slate-900">অ্যাডমিন প্যানেল</h2>
                <p className="text-slate-600">গ্যালারি ছবি আপডেট করতে লগইন করুন</p>
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
                    className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-[#1a4a8d] focus:outline-none transition"
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded"
                  >
                    {success}
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#1a4a8d] hover:bg-[#163a70] text-white font-bold py-3 rounded-lg transition shadow-sm"
                >
                  লগইন করুন
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 transition"
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
            className="space-y-8 pb-16"
          >
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1a4a8d]">
                      <Sparkles className="w-4 h-4" />
                      Bulk Event Upload
                    </div>
                      <h2 className="mt-4 text-4xl font-bold text-slate-900">একসাথে বহু ছবি আপলোড</h2>
                      <p className="mt-2 max-w-2xl text-slate-600">
                      একটি caption লিখে একাধিক event photo একসাথে Cloudinary-তে পাঠান। প্রতিটি ছবি একই caption নিয়ে gallery-তে যোগ হবে।
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/')}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    মূল পৃষ্ঠায় যান
                  </button>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-6">
                    <div className="flex items-center gap-3 text-[#1a4a8d] mb-4">
                      <FolderOpen className="w-5 h-5" />
                      <span className="font-semibold">Image Pack</span>
                    </div>
                    <label className="group flex min-h-45 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-[#1a4a8d] hover:bg-blue-50/60">
                      <ImagePlus className="w-10 h-10 text-[#1a4a8d] transition group-hover:scale-110" />
                      <span className="mt-4 text-lg font-semibold text-slate-900">একসাথে ছবি নির্বাচন করুন</span>
                      <span className="mt-2 text-sm text-slate-500">Multiple files select করা যাবে</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleBulkFilesChange}
                        className="hidden"
                      />
                    </label>

                    {selectedBulkFiles.length > 0 && (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
                          <span>Selected files</span>
                          <button
                            onClick={() => setSelectedBulkFiles([])}
                            className="text-slate-500 transition hover:text-[#1a4a8d]"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedBulkFiles.map((file) => (
                            <span
                              key={file.name}
                              className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 border border-slate-200"
                            >
                              {file.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Caption</label>
                    <textarea
                      value={bulkCaption}
                      onChange={(e) => setBulkCaption(e.target.value)}
                      placeholder="এই event-এর caption লিখুন"
                      rows={6}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#1a4a8d] focus:outline-none"
                    />

                    <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
                      একবারে একটি event-এর অনেক ছবি upload করুন। একই caption সব ছবিতে apply হবে।
                    </div>

                    <button
                      onClick={handleBulkUpload}
                      disabled={isBulkUploading}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a4a8d] px-5 py-4 font-bold text-white shadow-sm transition hover:bg-[#163a70] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBulkUploading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          আপলোড হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          Bulk Upload Complete করুন
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-50 p-3 text-[#1a4a8d]">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Admin Tips</h3>
                    <p className="text-sm text-slate-500">Simple workflow</p>
                  </div>
                </div>

                <ol className="mt-6 space-y-4 text-sm text-slate-700">
                  <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">1. একটি event-এর জন্য caption লিখুন</li>
                  <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">2. একাধিক ছবি select করুন</li>
                  <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">3. upload দিলে প্রতিটি ছবি gallery-তে আলাদা card হিসেবে যোগ হবে</li>
                </ol>

                <div className="mt-6 rounded-2xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-slate-700">
                  বড় event-এর জন্য আলাদা caption ব্যবহার করুন, যেমন “ঈদ পুনর্মিলনী ২০২৬”, “গ্রামভিত্তিক সভা”, ইত্যাদি।
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg"
              >
                {success}
              </motion.div>
            )}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {currentGallery.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:border-blue-300"
                >
                  <div className="space-y-4 p-4">
                    <div className="aspect-4/3 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                        <img
                          src={item.image}
                          alt={item.caption}
                          className="w-full h-full object-cover transition duration-500 hover:scale-105"
                        />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Caption</label>
                      <input
                        type="text"
                        value={captionDrafts[index] || ''}
                        onChange={(e) => handleCaptionChange(index, e.target.value)}
                        placeholder="এই ছবির ক্যাপশন লিখুন"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a4a8d]"
                      />
                    </div>

                    <div className="flex gap-3">
                      <label className="flex-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1a4a8d] px-4 py-3 font-semibold text-white transition hover:bg-[#163a70]">
                        {uploadingFiles[index] ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            আপলোড হচ্ছে...
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5" />
                            Replace Image
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
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d92c2c] px-4 py-3 font-semibold text-white transition hover:bg-[#b82626]"
                      >
                        <X className="w-5 h-5" />
                        মুছুন
                      </button>
                    </div>

                    {item.uploadedAt && (
                      <p className="text-xs text-slate-500">
                        আপলোড: {new Date(item.uploadedAt).toLocaleDateString('bn-BD')}
                      </p>
                    )}
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
