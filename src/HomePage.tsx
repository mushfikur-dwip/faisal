import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Menu, X, Phone, Mail, MapPin, 
  GraduationCap, Briefcase, Target, HeartHandshake, Facebook, Twitter, Linkedin, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GalleryItem {
  id?: string;
  caption: string;
  image: string;
  uploadedAt?: string;
}

interface HomePageProps {
  galleryItems: GalleryItem[];
  onGalleryUpdate: (items: GalleryItem[]) => void;
}

export default function HomePage({ galleryItems, onGalleryUpdate }: HomePageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentGalleryPage, setCurrentGalleryPage] = useState(1);
  const navigate = useNavigate();

  const galleryItemsPerPage = 6;
  const totalGalleryPages = Math.max(1, Math.ceil(galleryItems.length / galleryItemsPerPage));
  const startIndex = (currentGalleryPage - 1) * galleryItemsPerPage;
  const visibleGalleryItems = galleryItems.slice(startIndex, startIndex + galleryItemsPerPage);

  useEffect(() => {
    setCurrentGalleryPage((page) => Math.min(page, totalGalleryPages));
  }, [totalGalleryPages]);

  const handlePageChange = (page: number) => {
    setCurrentGalleryPage(page);
    const gallerySection = document.getElementById('gallery');
    gallerySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 scroll-smooth selection:bg-blue-200">
      {/* Navbar - Dark Blue */}
      <nav className="fixed w-full bg-linear-to-b from-[#1a2639] to-[#0f1620] border-b border-white/10 z-50 transition-all backdrop-blur-xl bg-opacity-95 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white tracking-tight font-bengali italic hover:text-blue-300 transition-colors">ফয়সাল হোসেন</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
              <a href="#about" className="hover:text-white transition-colors">পরিচিতি</a>
              <a href="#experience" className="hover:text-white transition-colors">অভিজ্ঞতা</a>
              <a href="#politics" className="hover:text-white transition-colors">রাজনীতি</a>
              <a href="#social" className="hover:text-white transition-colors">সামাজিক কাজ</a>
              <a href="#organizational" className="hover:text-white transition-colors">সংগঠন</a>
              <a href="#gallery" className="hover:text-white transition-colors">গ্যালারি</a>
              <a href="#vision" className="hover:text-white transition-colors">লক্ষ্য</a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-300 hover:text-white"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#1a2639] border-t border-[#2a3649] px-4 pt-2 pb-6 space-y-2 shadow-lg"
          >
            <a href="#about" className="block px-3 py-2 text-slate-300 hover:text-white rounded-md" onClick={() => setIsMobileMenuOpen(false)}>পরিচিতি</a>
            <a href="#experience" className="block px-3 py-2 text-slate-300 hover:text-white rounded-md" onClick={() => setIsMobileMenuOpen(false)}>অভিজ্ঞতা</a>
            <a href="#politics" className="block px-3 py-2 text-slate-300 hover:text-white rounded-md" onClick={() => setIsMobileMenuOpen(false)}>রাজনীতি</a>
            <a href="#social" className="block px-3 py-2 text-slate-300 hover:text-white rounded-md" onClick={() => setIsMobileMenuOpen(false)}>সামাজিক কাজ</a>
            <a href="#organizational" className="block px-3 py-2 text-slate-300 hover:text-white rounded-md" onClick={() => setIsMobileMenuOpen(false)}>সংগঠন</a>
            <a href="#gallery" className="block px-3 py-2 text-slate-300 hover:text-white rounded-md" onClick={() => setIsMobileMenuOpen(false)}>গ্যালারি</a>
            <a href="#vision" className="block px-3 py-2 text-slate-300 hover:text-white rounded-md" onClick={() => setIsMobileMenuOpen(false)}>লক্ষ্য</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-linear-to-br from-white via-slate-50 to-blue-50">
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 90 L50 10 L90 90 Z' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")`,
               backgroundSize: '400px'
             }}>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
          <div className="grid lg:grid-cols-12 gap-12 items-center w-full">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 pt-12 lg:pt-0"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-slate-900 leading-tight">
                <span className="text-[#1a4a8d]">ইঞ্জিনিয়ার</span> <span className="text-[#d92c2c] block mt-1">মোঃ ফয়সাল হোসেন</span>
              </h1>
              
              <div className="w-16 h-1 bg-[#d92c2c] mt-6 mb-8"></div>

              <p className="text-xl md:text-2xl text-slate-600 max-w-2xl leading-relaxed font-bengali italic border-l-4 border-slate-200 pl-4">
                "প্রযুক্তিগত জ্ঞান ও প্রশাসনিক দক্ষতার সমন্বয়ে একটি আধুনিক, পরিকল্পনাবান ও বাস্তবমুখী নেতৃত্ব তৈরি করাই আমাদের লক্ষ্য।"
              </p>
              
              <div className="pt-8">
                <p className="text-4xl text-[#d92c2c] font-signature">Faisal Hossain</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-5 relative h-112.5 lg:h-150 flex justify-center items-end  lg:mt-0"
            >
              <div className="absolute inset-0 bg-linear-to-t from-blue-500/10 to-transparent rounded-2xl blur-2xl"></div>
              <div className="relative z-10 w-full max-w-md h-100 lg:h-137.5 flex items-end justify-center">
                <img 
                  src="/faisal.png" 
                  alt="Engineer Faisal Hossain" 
                  className="w-full h-full drop-shadow-2xl object-contain object-bottom"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                    e.currentTarget.style.maskImage = 'linear-gradient(to top, transparent 0%, black 15%)';
                    e.currentTarget.style.webkitMaskImage = 'linear-gradient(to top, transparent 0%, black 15%)';
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-linear-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-serif font-bold bg-linear-to-r from-[#1a4a8d] to-blue-700 bg-clip-text text-transparent mb-8">ব্যক্তিগত পরিচিতি</h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-lg text-slate-700">
              <div className="space-y-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:shadow-blue-500/10 border border-slate-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105">
                <p><strong className="text-slate-900 block text-sm uppercase tracking-wide mb-1">নাম</strong> ইঞ্জিনিয়ার মোঃ ফয়সাল হোসেন</p>
                <p><strong className="text-slate-900 block text-sm uppercase tracking-wide mb-1">পিতা ও মাতা</strong> মোঃ আব্দুর রউফ মন্ডল, ফয়নুর নেসা</p>
                <div className="pt-2">
                  <strong className="text-slate-900 block text-sm uppercase tracking-wide mb-1">ঠিকানা</strong>
                  <p className="flex items-start text-sm"><MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-[#d92c2c]" /> গ্রাম: আলী দেওনা, ডাকঘর: বেলকুড়ি, উপজেলা: মহাদেবপুর, জেলা: নওগাঁ। (বর্তমান: ঢাকা)</p>
                </div>
              </div>
              
              <div className="space-y-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:shadow-red-500/10 border border-slate-200 hover:border-red-300 transition-all duration-300 transform hover:scale-105">
                <p><strong className="text-slate-900 block text-sm uppercase tracking-wide mb-1">স্ত্রী</strong> ইরুফা জেমিন আইভি (শিক্ষক)</p>
                <p className="text-sm text-slate-500">বিএসসি অনার্স, বিএড, এমএসসি (Applied Chemistry, Rajshahi University)</p>
                <p className="pt-2"><strong className="text-slate-900 block text-sm uppercase tracking-wide mb-1">সন্তান</strong> ফাবলিহা বুশরা (১৪) ও ইরফান সাদিক (৭)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Experience */}
      <section id="experience" className="py-24 bg-linear-to-br from-white via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Education Timeline */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-linear-to-br from-[#d92c2c] to-red-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-serif font-bold bg-linear-to-r from-[#1a4a8d] to-blue-700 bg-clip-text text-transparent">একাডেমিক যোগ্যতা</h2>
              </div>
              
              <div className="space-y-6 relative border-l-2 border-slate-200 ml-4 pl-8">
                {[
                  { deg: "MBA", inst: "Bangladesh University of Professionals (BUP)", year: "Post Graduation" },
                  { deg: "B.Sc in Textile Engineering", inst: "Bangladesh Textile University (BUTEX), Dhaka", year: "Graduation" },
                  { deg: "HSC (Science)", inst: "Rajshahi New Govt. Degree College", year: "2002" },
                  { deg: "SSC (Science)", inst: "Rajshahi Collegiate School", year: "2000" },
                  { deg: "Primary & High School", inst: "Belkuri Govt. Primary School & High School", year: "Up to Class 7" }
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-10 mt-1.5 w-4 h-4 bg-white border-2 border-[#1a4a8d] rounded-full"></span>
                    <h3 className="font-bold text-xl text-slate-900">{item.deg}</h3>
                    <p className="text-slate-600 mt-1">{item.inst}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">{item.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-linear-to-br from-[#1a4a8d] to-blue-700 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-serif font-bold bg-linear-to-r from-[#d92c2c] to-red-600 bg-clip-text text-transparent">পেশাগত জীবন</h2>
              </div>
              
              <div className="space-y-6 relative border-l-2 border-slate-200 ml-4 pl-8">
                {[
                  { role: "AGM (Knitting and R&D)", org: "Tosrifa Industries Ltd.", desc: "১৬+ বছরের শিল্প অভিজ্ঞতা। কৌশল নির্ধারক ও ফলাফলমুখী নেতৃত্ব। আন্তর্জাতিক ব্র্যান্ডের পন্য তৈরি।" },
                  { role: "খণ্ডকালীন শিক্ষক (PGD)", org: "Bangladesh Textile University (BUTEX)", desc: "পোস্ট গ্রাজুয়েট ডিপ্লোমা কোর্সের শিক্ষক। দক্ষ মানবসম্পদ তৈরির জন্য প্রশিক্ষণ প্রদান।" },
                  { role: "সভাপতি, পরিচালনা পর্ষদ", org: "আলী দেওনা রাইপুর নেছারিয়া দ্বিমুখী আলিম মাদ্রাসা", desc: "শিক্ষা প্রতিষ্ঠান পরিচালনা ও উন্নয়ন।" },
                  { role: "Career Start", org: "Viyellatex Limited", desc: "২০০৯ সালে কর্মজীবনে প্রবেশ।" }
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-10 mt-1.5 w-4 h-4 bg-white border-2 border-[#d92c2c] rounded-full"></span>
                    <h3 className="font-bold text-xl text-slate-900">{item.role}</h3>
                    <p className="text-[#1a4a8d] font-medium mt-1">{item.org}</p>
                    <p className="text-slate-600 mt-2 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Political Journey */}
      <section id="politics" className="py-24 bg-linear-to-br from-[#0f1620] via-[#1a2639] to-[#0f1620] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-bold bg-linear-to-r from-blue-300 to-red-300 bg-clip-text text-transparent mb-4">রাজনৈতিক ও সাংগঠনিক ভূমিকা</h2>
            <div className="w-16 h-1 bg-linear-to-r from-[#64b5f6] to-[#d92c2c] mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-300 text-lg">ছাত্রজীবন থেকে শুরু করে জাতীয় পর্যায় পর্যন্ত বলিষ্ঠ রাজনৈতিক নেতৃত্ব ও সাংগঠনিক দক্ষতা।</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-linear-to-br from-[#2a3649] to-[#1a2639] p-8 rounded-2xl border border-white/10 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105">
              <h3 className="text-xl font-bold text-[#64b5f6] mb-4">ছাত্র রাজনীতি</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                বিশ্ববিদ্যালয় জীবনে ছাত্রদলের রাজনীতির সাথে সম্পৃক্ত। ঢাকাস্থ নওগাঁ জেলার ছাত্রদের নিয়ে ছাত্র কল্যাণ সমিতি গঠন এবং বুটেক্সিয়ান ছাত্র সংগঠনকে একত্রিত করায় অপরিসীম ভূমিকা। মহাদেবপুর উপজেলা আঞ্চলিক ছাত্র কল্যাণ সমিতির প্রতিষ্ঠাতা সভাপতি।
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-linear-to-br from-[#2a3649] to-[#1a2639] p-8 rounded-2xl border border-white/10 hover:border-red-400/50 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-105">
              <h3 className="text-xl font-bold text-[#64b5f6] mb-4">জাতীয় নির্বাচন ভূমিকা</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                ২০০৮ ও ২০২৬ সালের জাতীয় সংসদে সরাসরি নির্বাচনী প্রচারণা। ২০২৬ সালে নওগাঁ-৩ আসনে ফজলে হুদা বাবুল এর সাথে যুক্ত থেকে ওয়ার্ড ও ইউনিয়ন পর্যায়ে শক্তিশালী নির্বাচনী কাঠামো গড়ে বিজয়ী করতে অসামান্য ভূমিকা।
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-linear-to-br from-[#2a3649] to-[#1a2639] p-8 rounded-2xl border border-white/10 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105">
              <h3 className="text-xl font-bold text-[#64b5f6] mb-4">পেশাজীবী রাজনীতি</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                নওগাঁ জেলা খালেদা জিয়া তারেক রহমান মুক্তি পরিষদ-এর সহ-সভাপতি (২০১১)। জাতীয়তাবাদী টেক্সটাইল ইঞ্জিনিয়ার ফোরামের যুগ্ন সাধারণ সম্পাদক। এ্যাব (AEB) এরাজীপুর জেলা নির্বাচনী কমিটির যুগ্ন আহ্বায়ক এবং নওগাঁ জেলা কমিটির সদস্য (২০২৬)।
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Contributions & Vision */}
      <section id="social" className="py-24 bg-linear-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <HeartHandshake className="w-8 h-8 text-[#1a4a8d]" />
                <h2 className="text-3xl font-serif font-bold text-slate-900">সামাজিক ও মানবিক অবদান</h2>
              </div>
              <ul className="space-y-6">
                <li className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                    <GraduationCap className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-lg mb-1">শিক্ষা উন্নয়ন</strong>
                    <span className="text-slate-600 block text-sm">দরিদ্র ও মেধাবী শিক্ষার্থীদের বৃত্তি প্রদান, ক্যারিয়ার দিকনির্দেশনা এবং বেলকুড়ি হাই স্কুল পুনর্মিলনী (২০১১) সফলভাবে আয়োজন।</span>
                  </div>
                </li>
                <li className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                    <Target className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-lg mb-1">পরিবেশ সংরক্ষন</strong>
                    <span className="text-slate-600 block text-sm">আলী দেওনা গ্রামে পাখি কলোনি প্রতিষ্ঠা, পরিবেশ মেলা আয়োজন ও বৃক্ষরোপণ এবং প্রকৃতি সংরক্ষণমূলক কর্মসূচি।</span>
                  </div>
                </li>
                <li className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-1">
                    <HeartHandshake className="w-5 h-5 text-red-700" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-lg mb-1">মানবিক সহায়তা ও যুব উন্নয়ন</strong>
                    <span className="text-slate-600 block text-sm">এলাকাভিত্তিক ফুটবল টুর্নামেন্ট আয়োজন। দরিদ্র পরিবারকে সহায়তা, শীতবস্ত্র বিতরণ ও করোনাকালীন দুর্যোগে মানুষের পাশে দাঁড়ানো।</span>
                  </div>
                </li>
              </ul>
            </div>

            <div id="vision" className="bg-[#1a4a8d] rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              
              <h2 className="text-3xl font-serif font-bold mb-8 flex items-center gap-3 relative z-10">
                <Target className="w-8 h-8 text-[#f44336]" />
                রাজনৈতিক ভিশন
              </h2>
              
              <div className="space-y-4 relative z-10">
                {[
                  "প্রযুক্তিনির্ভর আধুনিক উন্নয়ন",
                  "যুব কর্মসংস্থান সৃষ্টি",
                  "কৃষি ও শিল্পের সমন্বিত অগ্রগতি",
                  "পরিবেশবান্ধব উন্নয়ন",
                  "মাদক নির্মূল সমাজ গঠন",
                  "অবকাঠামোগত উন্নয়ন"
                ].map((v, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-[#f44336]"></div>
                    <span className="font-medium text-lg">{v}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
                <p className="text-blue-100 font-bengali italic opacity-90 leading-relaxed">
                  "ছাত্র রাজনীতি, আন্দোলনে সহায়তা, জাতীয় নির্বাচনে সক্রিয় ভূমিকা, শিল্প নেতৃত্ব এবং সামাজিক গ্রহণযোগ্যতা—সব মিলিয়ে তিনি একটি ভালো সমাজসেবকের অধিকারী। আসুন একসঙ্গে উন্নত সমাজ গড়ি।"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizational & Professional Role Section */}
      <section id="organizational" className="py-24 bg-linear-to-br from-blue-50 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-bold bg-linear-to-r from-[#1a4a8d] to-[#d92c2c] bg-clip-text text-transparent mb-4">সাংগঠনিক ও পেশাগত ভূমিকা</h2>
            <div className="w-16 h-1 bg-linear-to-r from-[#1a4a8d] to-[#d92c2c] mx-auto mb-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border-2 border-[#1a4a8d] shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-[#1a4a8d] to-blue-700 rounded-lg flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">প্রধান সমন্বয়ক</h3>
                  <p className="text-[#1a4a8d] font-semibold mt-1">ঢাকাস্থ নওগাঁ-৩ সংগঠন</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">দায়িত্বশীল নেতৃত্বের মাধ্যমে সংগঠনের সম্প্রসারণ এবং শক্তিশালীকরণে গুরুত্বপূর্ণ ভূমিকা পালন।</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border-2 border-[#d92c2c] shadow-lg hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-[#d92c2c] to-red-600 rounded-lg flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">প্রতিষ্ঠাতা ও পরিচালক</h3>
                  <p className="text-[#d92c2c] font-semibold mt-1">প্রকৃতি ও পরিবেশ বন্ধু পরিষদ</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">মহাদেবপুর, নওগাঁ অঞ্চলে পরিবেশ সচেতনতা ও সংরক্ষণ কাজে অগ্রগামী ভূমিকা।</p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-linear-to-br from-[#1a4a8d]/10 to-blue-50 p-8 rounded-2xl border border-[#1a4a8d]/20">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <div className="w-2 h-8 bg-linear-to-b from-[#1a4a8d] to-blue-500 rounded-full"></div>
                সামাজিক ও পরিবেশগত ভূমিকা
              </h3>
              <p className="text-slate-700 leading-relaxed text-lg mb-4">
                ইঞ্জিনিয়ার ফয়সাল হোসেন পরিবেশ ও প্রকৃতি রক্ষায় দীর্ঘদিন ধরে সচেতনতা কার্যক্রম পরিচালনা করে আসছেন। বিশেষভাবে তাল সাম্রাজ্যের গ্রাম কুড়াপাড়াকে কেন্দ্র করে তিনি সাধারণ মানুষের মাঝে পরিবেশ সচেতনতা সৃষ্টি করেন এবং তালগাছ সংরক্ষণ আন্দোলনে জনগণকে একত্রিত করতে গুরুত্বপূর্ণ ভূমিকা পালন করেন।
              </p>
              <p className="text-slate-700 leading-relaxed text-lg">
                তাঁর নেতৃত্বে এলাকার মানুষ তালগাছ রক্ষায় ঐক্যবদ্ধ হয় এবং পরিবেশবান্ধব উদ্যোগে অংশগ্রহণ করতে উৎসাহিত হয়।
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-linear-to-br from-[#d92c2c]/10 to-red-50 p-8 rounded-2xl border border-[#d92c2c]/20">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <div className="w-2 h-8 bg-linear-to-b from-[#d92c2c] to-red-500 rounded-full"></div>
                পেশাগত দক্ষতা ও প্রশিক্ষণ কার্যক্রম
              </h3>
              <p className="text-slate-700 leading-relaxed text-lg mb-4">
                তিনি বিভিন্ন শিল্প ও প্রতিষ্ঠানে দক্ষ মানবসম্পদ তৈরির লক্ষ্যে প্রশিক্ষণ প্রদান করে থাকেন। আধুনিক প্রযুক্তি, উৎপাদন ব্যবস্থাপনা, নেতৃত্ব উন্নয়ন এবং কর্মক্ষেত্রে দক্ষতা বৃদ্ধির বিষয়ে তাঁর বিশেষ অভিজ্ঞতা রয়েছে।
              </p>
              <p className="text-slate-700 leading-relaxed text-lg">
                তিনি তরুণ প্রজন্মকে দক্ষ ও কর্মমুখী হিসেবে গড়ে তুলতে নিয়মিত কাজ করে যাচ্ছেন।
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-linear-to-br from-slate-100 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-4xl font-serif font-bold bg-linear-to-r from-[#1a4a8d] to-[#d92c2c] bg-clip-text text-transparent mb-4">
              ছবি গ্যালারি
            </h2>
            <p className="text-slate-600 text-lg">
              সামাজিক কার্যক্রম, নেতৃত্ব এবং উন্নয়ন অভিযাত্রার কিছু গুরুত্বপূর্ণ মুহূর্ত।
            </p>
          </div>

          {galleryItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleGalleryItems.map((item, index) => (
                <motion.article
                  key={`${item.caption}-${startIndex + index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md"
                >
                  <div className="aspect-4/3 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/45 to-transparent p-4">
                    <h3 className="text-lg font-semibold text-white">{item.caption}</h3>
                  </div>
                </motion.article>
              ))}
              </div>

              {totalGalleryPages > 1 && (
                <div className="mt-10 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentGalleryPage - 1))}
                      disabled={currentGalleryPage === 1}
                      className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      পূর্বের
                    </button>

                    <div className="hidden sm:flex items-center gap-2">
                      {Array.from({ length: totalGalleryPages }, (_, pageIndex) => {
                        const pageNumber = pageIndex + 1;
                        const isActive = pageNumber === currentGalleryPage;

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`min-w-10 rounded-full px-3 py-2 text-sm font-semibold transition ${
                              isActive
                                ? 'bg-[#1a4a8d] text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    <span className="sm:hidden rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      {currentGalleryPage} / {totalGalleryPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(Math.min(totalGalleryPages, currentGalleryPage + 1))}
                      disabled={currentGalleryPage === totalGalleryPages}
                      className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      পরের
                    </button>
                  </div>

                  <p className="text-sm text-slate-500">
                    পৃষ্ঠা {currentGalleryPage} / {totalGalleryPages}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Settings className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">এখনো কোনো ছবি নেই</h3>
              <p className="mt-3 text-slate-600">
                অ্যাডমিন প্যানেল থেকে নতুন event photo upload করলে এখানে auto show হবে।
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-linear-to-r from-[#0f1620] via-[#111] to-[#0f1620] py-12 text-slate-400 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              {/* <div className="w-8 h-8 bg-linear-to-br from-[#d92c2c] to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ফ</span>
              </div> */}
              <span className="text-2xl font-bold text-white tracking-tight font-bengali italic">ফয়সাল হোসেন</span>
            </div>
            <div className="flex space-x-6 items-center">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-all duration-300 transform hover:scale-110"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-400/30 transition-all duration-300 transform hover:scale-110"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600/30 transition-all duration-300 transform hover:scale-110"><Linkedin className="w-5 h-5" /></a>
              
              {/* Admin Button - Opens /admin route instead */}
              {/* <button
                onClick={() => navigate('/admin')}
                className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110 ml-2"
                title="গ্যালারি ম্যানেজমেন্ট"
              >
                <Settings className="w-5 h-5" />
              </button> */}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} সকল অধিকার সংরক্ষিত।</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">প্রাইভেসি পলিসি</a>
              <a href="#" className="hover:text-white transition-colors">যোগাযোগ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
