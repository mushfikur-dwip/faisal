# Gallery Backend Setup

এই ফাইল বিস্তারিত আছে কীভাবে backend সার্ভার সেটআপ করবেন যাতে gallery items persistent হয় এবং সব ডিভাইস থেকে access করা যায়।

## সমস্যা ও সমাধান

### সমস্যা
- ইমেজ আপলোড সফল হচ্ছে কিন্তু ব্রাউজার localStorage তে সেভ হচ্ছে
- localStorage ক্লিয়ার করলে সব ইমেজ হারিয়ে যাচ্ছে
- অন্য ডিভাইস থেকে ব্রাউজ করলে ইমেজ দেখা যাচ্ছে না

### সমাধান
Backend API server তৈরি করা হয়েছে যা:
1. Gallery items সার্ভার এ persist করে
2. সব ডিভাইস থেকে একই data access করতে পারে
3. localStorage ক্লিয়ার করলেও ডাটা সেফ থাকে

## সেটআপ করার ধাপ

### ১. Dependencies ইনস্টল করুন

```bash
npm install
```

এটি `cors` প্যাকেজ সহ সব dependencies ইনস্টল করবে।

### ২. Environment Variables সেট করুন

`.env.local` ফাইল এ নিচের ভ্যারিয়েবলগুলি যোগ করুন:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_ADMIN_PASSWORD=your_secure_password
VITE_API_URL=http://localhost:5000
```

### ৩. Backend Server চালান

নতুন টার্মিনাল উইন্ডোতে:

```bash
npm run server
```

আপনি দেখবেন:
```
Gallery API server running on port 5000
```

### ৪. Frontend চালান

অন্য টার্মিনাল উইন্ডোতে:

```bash
npm run dev
```

এখন frontend `localhost:3000` এ চলবে এবং backend API `localhost:5000` এ থাকবে।

## Production Deployment (Vercel)

### Local file storage সমস্যা

Vercel এ local files persist হয় না। Production এ আপনাকে একটি database ব্যবহার করতে হবে:

**অপশন ১: MongoDB (সবচেয়ে সহজ)**
1. MongoDB Atlas একাউন্ট তৈরি করুন (free tier আছে)
2. Connection string পান
3. Backend কে MongoDB connect করার কোড যোগ করুন

**অপশন ২: Supabase PostgreSQL**
1. Supabase project তৈরি করুন
2. PostgreSQL টেবিল তৈরি করুন `gallery_items` নামে
3. API ব্যবহার করুন

**অপশন ৩: Firebase Realtime Database**
1. Firebase project সেট আপ করুন
2. Frontend থেকে সরাসরি Firebase এ write করুন

### ছোট সমাধান (Development এ ঠিক আছে)

আপাতত `gallery-data.json` এ data সেভ হচ্ছে যা local server এ fine আছে।

## কীভাবে কাজ করছে

1. **Frontend**: `src/api/gallery.ts` এ API endpoints কল করে
2. **Backend**: `api/server.ts` Express API চালায়
3. **Storage**: `api/gallery.ts` ব্যবহার করে `gallery-data.json` এ data persist করে

### API Endpoints

- `GET /api/gallery` - সব gallery items ফেচ করে
- `POST /api/gallery` - নতুন items add করে
- `PUT /api/gallery` - সব items update করে
- `DELETE /api/gallery/:id` - একটি item delete করে

## Development Tips

- Backend সার্ভার running না থাকলে app localStorage fallback ব্যবহার করবে
- প্রতিটি আপলোডের পর data `/gallery-data.json` এ সেভ হয়
- `.gitignore` এ `gallery-data.json` আছে (যেন version control এ না আসে)

## Troubleshooting

**সমস্যা: Backend সার্ভার কানেক্ট হচ্ছে না**
- নিশ্চিত করুন `npm run server` চলছে
- `VITE_API_URL=http://localhost:5000` .env.local এ আছে কিনা চেক করুন

**সমস্যা: Port 5000 ইতিমধ্যে ব্যবহৃত**
```bash
# macOS/Linux এ পোর্ট খুঁজে বের করুন
lsof -i :5000
# Kill the process
kill -9 <PID>
```

**সমস্যা: CORS error পাচ্ছেন**
- নিশ্চিত করুন `cors` package ইনস্টল আছে: `npm install cors`
- Backend সার্ভার restart করুন
