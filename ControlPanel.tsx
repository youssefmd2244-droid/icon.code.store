import React, { useState } from 'react';
// تم تصحيح المسارات هنا من ../ إلى ./ لأن كل الملفات في نفس المجلد الرئيسي
import { StoreData, Product, StoreSettings, MediaType, SocialLink } from './types';
import { ADMIN_PASSWORD } from './constants';

interface Props {
  data: StoreData;
  goBack: () => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onAddCategory: (name: string, icon: string) => void;
  onRemoveCategory: (name: string) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProduct: (updated: Product) => void;
}

const ControlPanel: React.FC<Props> = ({ 
  data, goBack, onUpdateSettings, onAddCategory, onRemoveCategory, onAddProduct, onDeleteProduct, onUpdateProduct 
}) => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [tab, setTab] = useState<'settings' | 'products' | 'categories' | 'links' | 'ai'>('settings');

  // Form states
  const [newProd, setNewProd] = useState<Partial<Product>>({ mediaType: 'image', category: 'General' });
  const [newCat, setNewCat] = useState({ name: '', icon: '🏷️' });

  const handleDownload = () => {
    // Generate fresh HTML with injected data for "self-modifying" concept
    const currentData = JSON.stringify(data);
    const html = document.documentElement.outerHTML.replace(
      /localStorage\.getItem\('icon_code_pro_v3'\)/,
      `'${currentData}'`
    );
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `store_backup_${new Date().toLocaleDateString()}.html`;
    a.click();
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-6xl font-black tracking-tighter text-white mb-12">ADMIN</h1>
          <input 
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full bg-white/5 border-2 border-white/10 rounded-3xl p-6 text-2xl text-center text-white focus:border-white/40 outline-none transition-all"
          />
          <div className="flex gap-4">
            <button 
              onClick={goBack}
              className="flex-1 p-6 rounded-3xl font-black text-xl bg-white/5 text-white/40 hover:bg-white/10 transition-all"
            >
              رجوع
            </button>
            <button 
              onClick={() => {
                if (pass === ADMIN_PASSWORD) setAuth(true);
                else alert('كلمة مرور خاطئة');
              }}
              className="flex-1 p-6 bg-white text-black rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all"
            >
              دخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16 font-sans pb-40">
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h2 className="text-7xl font-black tracking-tighter mb-4">لوحة التحكم</h2>
            <p className="text-white/40 text-xl">إدارة محتوى المتجر والإعدادات المتقدمة</p>
          </div>
          <button 
            onClick={goBack}
            className="px-12 py-5 bg-white text-black rounded-3xl font-black text-xl hover:scale-105 transition-all"
          >
            عرض المتجر
          </button>
        </header>

        <nav className="flex flex-wrap gap-4 border-b border-white/10 pb-8">
          {[
            { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
            { id: 'products', label: 'المنتجات', icon: '📦' },
            { id: 'categories', label: 'التصنيفات', icon: '🏷️' },
            { id: 'links', label: 'الروابط', icon: '🔗' },
            { id: 'ai', label: 'تصدير الموقع', icon: '🚀' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-8 py-4 rounded-2xl font-black text-lg transition-all flex items-center gap-3 ${
                tab === t.id ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'settings' && (
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
            <div className="space-y-10">
              <h3 className="text-3xl font-black">هوية المتجر</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-white/40 mb-3 text-sm font-bold uppercase tracking-widest">اسم المتجر</label>
                  <input 
                    value={data.settings.storeName}
                    onChange={(e) => onUpdateSettings({ ...data.settings, storeName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xl outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-white/40 mb-3 text-sm font-bold uppercase tracking-widest">شعار المتجر (Emoji أو نص)</label>
                  <input 
                    value={data.settings.logo}
                    onChange={(e) => onUpdateSettings({ ...data.settings, logo: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xl outline-none focus:border-white/30"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <h3 className="text-3xl font-black">الألوان والإضاءة</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/40 mb-3 text-sm font-bold">اللون الأساسي</label>
                  <input 
                    type="color"
                    value={data.settings.primaryColor}
                    onChange={(e) => onUpdateSettings({ ...data.settings, primaryColor: e.target.value })}
                    className="w-full h-16 rounded-xl bg-transparent cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-white/40 mb-3 text-sm font-bold">شدة الإضاءة</label>
                  <input 
                    type="range" min="0" max="1" step="0.1"
                    value={data.settings.lightingIntensity}
                    onChange={(e) => onUpdateSettings({ ...data.settings, lightingIntensity: parseFloat(e.target.value) })}
                    className="w-full accent-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div className="space-y-12">
            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
              <h3 className="text-3xl font-black mb-8">إضافة منتج جديد</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <input 
                  placeholder="اسم المنتج"
                  value={newProd.name || ''}
                  onChange={e => setNewProd({...newProd, name: e.target.value})}
                  className="bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-white/40"
                />
                <input 
                  placeholder="السعر"
                  value={newProd.price || ''}
                  onChange={e => setNewProd({...newProd, price: e.target.value})}
                  className="bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-white/40"
                />
                <select 
                  value={newProd.category}
                  onChange={e => setNewProd({...newProd, category: e.target.value})}
                  className="bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-white/40"
                >
                  {data.categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <input 
                  placeholder="رابط الصورة أو الفيديو"
                  value={newProd.mediaUrl || ''}
                  onChange={e => setNewProd({...newProd, mediaUrl: e.target.value})}
                  className="md:col-span-2 bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-white/40"
                />
                <select 
                   value={newProd.mediaType}
                   onChange={e => setNewProd({...newProd, mediaType: e.target.value as MediaType})}
                   className="bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-white/40"
                >
                  <option value="image">صورة</option>
                  <option value="video">فيديو</option>
                </select>
                <button 
                  onClick={() => {
                    if (newProd.name && newProd.price && newProd.mediaUrl) {
                      onAddProduct({ 
                        ...(newProd as Product), 
                        id: Math.random().toString(36).substr(2, 9),
                        description: '' 
                      });
                      setNewProd({ mediaType: 'image', category: 'General' });
                    }
                  }}
                  className="md:col-span-3 py-6 bg-white text-black rounded-2xl font-black text-xl hover:scale-[1.02] transition-all"
                >
                  تأكيد الإضافة
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {data.products.map(p => (
                 <div key={p.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex items-center gap-6 group hover:bg-white/10 transition-all">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/10">
                      {p.mediaType === 'image' ? (
                        <img src={p.mediaUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📹</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-xl truncate mb-1">{p.name}</h4>
                      <p className="text-white/40 font-bold">{p.price}</p>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button onClick={() => onDeleteProduct(p.id)} className="flex-1 py-3 bg-red-600/20 text-red-400 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all">حذف</button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {tab === 'ai' && (
          <div className="max-w-4xl space-y-12">
            <h3 className="text-4xl font-black">التحكم الذكي والتحديث الذاتي</h3>
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-16 rounded-[4rem] border border-white/10 text-center space-y-10">
               <i className="fas fa-magic text-8xl text-indigo-400 animate-bounce"></i>
               <h4 className="text-3xl font-black">نظام التعديل الذاتي للبرمجيات</h4>
               <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
                  عند النقر على الزر، سيتم إنشاء نسخة كاملة وجديدة من المتجر بملف واحد (HTML) يحتوي على كافة المنتجات والصور والتعديلات التي قمت بها. يمكنك رفع هذا الملف في أي مكان وسيعمل تلقائياً دون الحاجة لقواعد بيانات.
               </p>
               <button 
                onClick={handleDownload}
                className="px-16 py-6 bg-white text-black rounded-3xl font-black text-2xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]"
               >
                 تحميل الموقع بالكامل الآن
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
