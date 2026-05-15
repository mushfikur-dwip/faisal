# Bug Fix: Gallery Data Persistence Solution

## সমস্যার বিবরণ

আপনার ওয়েবসাইট এ gallery ইমেজ upload করা হচ্ছে, কিন্তু:
1. **ডাটা শুধু localStorage তে সেভ হচ্ছে** - সার্ভারে নয়
2. **Browser ডাটা ক্লিয়ার করলে সব হারিয়ে যাচ্ছে**
3. **অন্য device থেকে ব্রাউজ করলে ইমেজ দেখা যাচ্ছে না**

## সমাধান কী করেছে

Backend API server তৈরি করা হয়েছে যা:
✅ Gallery items এ সার্ভারে persist করে (JSON file এ)  
✅ সব ডিভাইস থেকে একই data access করা যায়  
✅ localStorage ক্লিয়ার করলেও ডাটা safe থাকে  
✅ Cloudinary এ images still থাকে + server metadata maintain করে

---

## ফাইল যোগ হয়েছে / পরিবর্তিত হয়েছে

### নতুন ফাইল:
1. `api/gallery.ts` - Persist করার logic
2. `api/server.ts` - Express API server
3. `src/api/gallery.ts` - Frontend এ API call করার helper
4. `BACKEND_SETUP.md` - Setup instructions (বিস্তারিত)
5. `.env.example` - Environment variables এর example

### পরিবর্তিত ফাইল:
1. `src/App.tsx` - localStorage থেকে API তে shifted
2. `src/AdminPage.tsx` - সব save operations এ API use করছে
3. `package.json` - `cors` dependency যোগ + `npm run server` script যোগ
4. `.gitignore` - `gallery-data.json` যোগ

---

## দ্রুত শুরু করার ধাপ

### ১. Dependencies ইনস্টল করুন (যদি না করে থাকেন)
```bash
npm install
```

### ২. `.env.local` আপডেট করুন

আপনার `.env.local` ফাইল এ নিচের লাইন যোগ করুন:
```
VITE_API_URL=http://localhost:5000
```

### ৩. দুটি টার্মিনাল উইন্ডো খুলুন

**Terminal 1** - Backend Server:
```bash
npm run server
```

আপনি দেখবেন:
```
Gallery API server running on port 5000
```

**Terminal 2** - Frontend:
```bash
npm run dev
```

Frontend চলবে `http://localhost:3000` এ

### ৪. Test করুন

- Admin panel এ login করুন
- নতুন ছবি upload করুন
- Browser ডাটা ক্লিয়ার করুন (DevTools → Application → Clear data)
- Page refresh করুন
- **ইমেজগুলি এখনও থাকবে!** ✅

---

## কীভাবে কাজ করছে

### Data Flow:

```
Frontend Upload
    ↓
Cloudinary (image hosting) ✓ সার্ভারে upload
    ↓
Backend API (`http://localhost:5000/api/gallery`)
    ↓
`gallery-data.json` (server storage)
    ↓
Next app load করলে API থেকে fetch করে
```

### API Endpoints:

| Method | Endpoint | কী করে |
|--------|----------|---------|
| GET | `/api/gallery` | সব items fetch করে |
| POST | `/api/gallery` | নতুন items add করে |
| PUT | `/api/gallery` | সব items update করে |
| DELETE | `/api/gallery/:id` | একটি item delete করে |

---

## Production Deploy (Vercel)

### গুরুত্বপূর্ণ: Local files Vercel এ persist হয় না!

যখন Vercel এ deploy করবেন, তখন এটি काम করবে না কারণ files delete হয়ে যাবে।

**সমাধান**: একটি database ব্যবহার করুন:

#### Option 1: MongoDB (সবচেয়ে সহজ) ⭐
1. MongoDB Atlas তে free tier account তৈরি করুন
2. Connection string পান
3. Backend কে MongoDB connect করুন

#### Option 2: Supabase (PostgreSQL)
1. Supabase project তৈরি করুন
2. `gallery_items` table তৈরি করুন
3. API update করুন

#### Option 3: Firebase (নো-কোড সমাধান)
Frontend থেকে সরাসরি Firebase use করুন

**আপাতত**: Development এ এই solution perfect কাজ করছে। Production এর আগে database decide করুন।

---

## Troubleshooting

### সমস্যা: "Cannot find module 'cors'"
```bash
npm install cors
```

### সমস্যা: Port 5000 already in use
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### সমস্যা: CORS error মিলছে
- নিশ্চিত করুন backend চলছে (`npm run server`)
- `.env.local` এ `VITE_API_URL=http://localhost:5000` আছে কিনা check করুন

### সমস্যা: Frontend API call error
Backend ছাড়াই app চলবে localStorage fallback ব্যবহার করে (কিন্তু persistent হবে না)।

---

## Development এ একসাথে চালানো

একটি command দিয়ে উভয় start করতে:
```bash
npm run dev:all
```

(নোট: এটি background তে উভয় process চালাবে)

---

## File Structure

```
faisal/
├── api/
│   ├── gallery.ts (persist logic)
│   └── server.ts (Express API)
├── src/
│   ├── api/
│   │   └── gallery.ts (frontend helpers)
│   ├── App.tsx (updated - API integration)
│   ├── AdminPage.tsx (updated - API integration)
│   └── HomePage.tsx (unchanged)
├── gallery-data.json (generated on first upload)
├── BACKEND_SETUP.md (detailed setup guide)
└── package.json (updated with cors & scripts)
```

---

## পরবর্তী পদক্ষেপ

1. ✅ এই solution locally test করুন
2. 📦 Production database decide করুন (MongoDB/Supabase/Firebase)
3. 🚀 Database integration add করুন
4. 🌐 Vercel deploy করুন

---

## সংক্ষিপ্ত: কী যোগ হয়েছে?

**Backend সার্ভার**: Gallery metadata persistent করার জন্য  
**API Endpoints**: CRUD operations এর জন্য  
**Frontend Update**: localStorage এর বদলে API use করছে  
**Fallback**: API না থাকলেও localStorage fallback আছে

---

## Questions?

দেখুন `BACKEND_SETUP.md` বিস্তারিত সবকিছুর জন্য।
