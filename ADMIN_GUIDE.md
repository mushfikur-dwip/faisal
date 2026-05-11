# Admin Gallery Management Guide

## Cloudinary Setup করার নিয়ম

### Step 1: Cloudinary Account তৈরি করুন
1. [cloudinary.com](https://cloudinary.com) এ যান
2. Sign up করুন
3. Dashboard এ যান

### Step 2: Upload Preset তৈরি করুন
1. Dashboard এ **Settings** → **Upload** এ যান
2. নিচে স্ক্রোল করুন এবং **Add upload preset** ক্লিক করুন
3. এই তথ্য পূরণ করুন:
   - **Name**: `faisal_gallery` (এটি গুরুত্বপূর্ণ!)
   - **Mode**: Unsigned
   - **Folder**: `faisal-gallery` (optional)
4. **Save** করুন

### Step 3: Your Cloud Name খুঁজুন
1. Dashboard এ এর উপরে আপনার **Cloud Name** দেখবেন
2. এটি `.env` ফাইলে ব্যবহার করুন

## Setup ফাইল

### `.env` ফাইল
```env
VITE_CLOUDINARY_CLOUD_NAME=faisal
VITE_ADMIN_PASSWORD=faisal2026
```

এই ফাইল ইতিমধ্যে তৈরি করা হয়েছে root directory তে।

## Admin Panel এ কিভাবে প্রবেশ করবেন

1. Website এর footer এ ছোট **Settings** আইকন (গিয়ার চিহ্ন) দেখবেন
2. এটি ক্লিক করুন
3. পাসওয়ার্ড এন্টার করুন: `faisal2026`
4. লগইন করুন

## Gallery Image আপডেট করার ধাপ

1. Admin Panel খোলার পর আপনি সব gallery items দেখবেন
2. প্রতিটি আইটেমের জন্য:
   - **নতুন ছবি আপলোড করুন** বাটনে ক্লিক করুন
   - আপনার কম্পিউটার থেকে একটি ছবি নির্বাচন করুন
   - Cloudinary এ আপলোড হবে এবং website এ আপডেট হবে

## Features

✓ Fixed Password দিয়ে Secure Login
✓ সব Gallery Items Edit করুন
✓ Cloudinary এ সরাসরি Upload
✓ Real-time Gallery Update
✓ Delete/Replace Image
✓ Upload Timestamp

## Troubleshooting

### "Upload failed" Error
- Cloudinary Dashboard এ upload preset `faisal_gallery` তৈরি করেছেন কিনা চেক করুন
- Preset এর mode "Unsigned" এ আছে কিনা দেখুন

### Password কাজ করছে না
- `.env` ফাইলে password সঠিক কিনা চেক করুন
- Website রিলোড করুন (Ctrl+R or Cmd+R)

### ছবি আপলোড হচ্ছে কিন্তু দেখা যাচ্ছে না
- আপনার Cloudinary subscription check করুন
- CDN cache clear করতে পারেন

## Development Mode এ চালানো

```bash
npm run dev
```

তারপর `http://localhost:3000` এ যান এবং footer এ Settings button দেখুন।
