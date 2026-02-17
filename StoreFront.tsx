import React, { useState, useEffect, useRef } from 'react';
// تم تعديل المسار من ../types إلى ./types لأن الملف في نفس المجلد
import { StoreData, Product } from './types';

interface Props {
  data: StoreData;
  goToAdmin: () => void;
}

const StoreFront: React.FC<Props> = ({ data, goToAdmin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Home');
  const [lightbox, setLightbox] = useState<Product | null>(null);
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('active');
        });
      }, { threshold: 0.1 }
    );
    revealRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [data.products, searchQuery, activeCategory]);

  const filteredProducts = data.products.filter(p => {
    // تم تعديل p.title إلى p.name لتتوافق مع تعريف المنتج في ملفاتك الأخرى
    const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Home' ? true : p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#050510] text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a1a]/85 backdrop-blur-xl border-b border-indigo-500/10 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="text-4xl">{data.settings.logo}</div>
             <h1 className="text-3xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
               {data.settings.storeName}
             </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={goToAdmin} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-16">
        {/* Search & Categories */}
        <div className="mb-20 space-y-8">
           <input 
             type="text"
             placeholder="ابحث عن المنتجات..."
             className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-xl outline-none focus:border-indigo-500/50 transition-all"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {['Home', ...data.categories.map(c => c.name)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {cat === 'Home' ? 'الرئيسية' : cat}
                </button>
              ))}
           </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product, idx) => (
            <div 
              key={product.id}
              ref={el => revealRefs.current[idx] = el}
              className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 transition-all"
            >
               <div className="aspect-square overflow-hidden relative">
                  {product.mediaType === 'image' ? (
                    <img src={product.mediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                  ) : (
                    <video src={product.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 font-black">
                    {product.price}
                  </div>
               </div>
               <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-black">{product.name}</h3>
                  <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all">
                    اطلب الآن
                  </button>
               </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 p-16">
         <div className="max-w-7xl mx-auto text-center space-y-6 opacity-40">
            <p className="font-bold">© {new Date().getFullYear()} {data.settings.storeName}</p>
            <p className="text-sm">Powered by Icon Code Pro</p>
         </div>
      </footer>
    </div>
  );
};

export default StoreFront;
