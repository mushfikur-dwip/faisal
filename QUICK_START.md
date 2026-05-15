# ⚡ Quick Start - 3 মিনিটে সেটআপ করুন

## শুধুমাত্র এই ধাপগুলি করুন:

### 1️⃣ Terminal এ install করুন
```bash
npm install
```

### 2️⃣ `.env.local` ফাইলে এই লাইন যোগ করুন
```
VITE_API_URL=http://localhost:5000
```

### 3️⃣ **Terminal Window 1** - Backend চালু করুন
```bash
npm run server
```

দেখবেন: `Gallery API server running on port 5000` ✅

### 4️⃣ **Terminal Window 2** (নতুন) - Frontend চালু করুন
```bash
npm run dev
```

দেখবেন: `VITE v6.2.3 ready in 123 ms` ✅

### 5️⃣ ব্রাউজারে খুলুন
```
http://localhost:3000
```

---

## এবার কী হবে?

✅ Admin panel এ ছবি upload করুন  
✅ Browser data clear করুন (Ctrl+Shift+Delete)  
✅ Page refresh করুন  
✅ **ছবিগুলি এখনও থাকবে!**

---

## এর পর কী?

- বিস্তারিত guide: [BACKEND_SETUP.md](BACKEND_SETUP.md)
- সমাধান বিবরণ: [SOLUTION_SUMMARY.md](SOLUTION_SUMMARY.md)

---

## কি কি চেঞ্জ হয়েছে?

✨ Localhost তে সব ঠিক কাজ করবে  
✨ Gallery data এখন server এ save হবে  
✨ সব device থেকে একই data দেখাবে

**Important**: Production (Vercel) এ deploy করার আগে একটি database (MongoDB/Supabase) সেট আপ করতে হবে।

---

## Help!

Error পেলে দেখুন [BACKEND_SETUP.md](BACKEND_SETUP.md) এর Troubleshooting section।
