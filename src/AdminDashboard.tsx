import { useState } from 'react';
import { Upload, X, Lock, LogOut, Loader } from 'lucide-react';
import { motion } from 'motion/react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  uploadedAt?: string;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onGalleryUpdate: (items: GalleryItem[]) => void;
  currentGallery: GalleryItem[];
}

export default function AdminDashboard({ isOpen, onClose, onGalleryUpdate, currentGallery }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'faisal_gallery';
  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
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

    if (!cloudName) {
      setError('Cloudinary cloud name সেট করা নেই। .env এ VITE_CLOUDINARY_CLOUD_NAME দিন।');
      return;
    }

    if (!uploadPreset) {
      setError('Cloudinary upload preset সেট করা নেই। .env এ VITE_CLOUDINARY_UPLOAD_PRESET দিন।');
      return;
    }

    setUploadingFiles(prev => ({ ...prev, [itemIndex]: true }));
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'faisal-gallery');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      const responseData = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        const cloudinaryMessage = responseData?.error?.message || 'Upload failed';
        throw new Error(cloudinaryMessage);
      }

      const updatedGallery = [...currentGallery];
      updatedGallery[itemIndex] = {
        ...updatedGallery[itemIndex],
        image: responseData.secure_url,
        uploadedAt: new Date().toISOString(),
      };

      onGalleryUpdate(updatedGallery);
      setSuccess('ছবি আপডেট সফল!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`ছবি আপলোড ব্যর্থ: ${message}`);
      console.error(err);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [itemIndex]: false }));
      e.target.value = '';
    }
  };

  const handleDeleteImage = (itemIndex: number) => {
    const updatedGallery = [...currentGallery];
    updatedGallery[itemIndex] = {
      ...updatedGallery[itemIndex],
      image: 'https://images.unsplash.com/photo-1606857521220-98e5dba7214e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    };
    onGalleryUpdate(updatedGallery);
    setSuccess('ছবি মুছে ফেলা হয়েছে।');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-[#1a4a8d] to-[#d92c2c] p-6 text-white flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Lock className="w-6 h-6" />
            গ্যালারি ম্যানেজমেন্ট
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!isAuthenticated ? (
            // Login Form
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleLogin}
              className="max-w-md mx-auto space-y-6"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">অ্যাডমিন লগইন</h3>
                <p className="text-slate-600">গ্যালারি আপডেট করতে পাসওয়ার্ড দিন</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড এখানে দিন"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-[#1a4a8d] focus:outline-none transition"
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded"
                >
                  {success}
                </motion.div>
              )}

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-[#1a4a8d] to-blue-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition"
                >
                লগইন করুন
              </button>
            </motion.form>
          ) : (
            // Gallery Management
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">গ্যালারি আইটেম সম্পাদনা</h3>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  লগআউট
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded"
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
                    className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 hover:border-[#1a4a8d] transition"
                  >
                    <div className="grid md:grid-cols-4 gap-4">
                      {/* Image Preview */}
                      <div className="col-span-1">
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-200">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Info and Upload */}
                      <div className="col-span-3 space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-600">শিরোনাম</p>
                          <p className="text-lg text-slate-900">{item.title}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-600">ক্যাটাগরি</p>
                          <p className="text-slate-900">{item.category}</p>
                        </div>

                        {/* Upload Section */}
                        <div className="flex gap-2 pt-2">
                          <label className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer transition disabled:opacity-50">
                            {uploadingFiles[index] ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                আপলোড হচ্ছে...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
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
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            মুছুন
                          </button>
                        </div>

                        {item.uploadedAt && (
                          <p className="text-xs text-slate-500">
                            আপলোড: {new Date(item.uploadedAt).toLocaleDateString('bn-BD')}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm text-blue-900">
                <strong>নোট:</strong> Cloudinary এ অবশ্যই একটি upload preset তৈরি করুন।
                Dashboard এ যান এবং Settings → Upload → Add upload preset → নাম দিন "{uploadPreset}"।
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
