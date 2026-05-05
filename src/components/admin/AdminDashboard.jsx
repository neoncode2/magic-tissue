'use client';

import { useEffect, useMemo, useState } from 'react';
import { mergeSiteConfig, siteDefaults } from '@/lib/siteDefaults';

const navItems = [
  ['overview', 'Overview'],
  ['content', 'Hero & Media'],
  ['orders', 'Orders'],
  ['benefits', 'Benefits'],
  ['features', 'Features'],
  ['offer', 'Offer'],
  ['packages', 'Packages'],
  ['reviews', 'Reviews'],
  ['products', 'Products'],
  ['faqs', 'FAQ'],
  ['admins', 'Admins'],
];

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-rose-500 focus:bg-black/50';
const panelClass = 'rounded-[28px] border border-white/10 bg-[#111111] p-5 shadow-[0_25px_70px_rgba(0,0,0,0.35)]';

function money(value) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function linesToArray(value) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

// এই নতুন ফাংশনটি iframe থেকে শুধু URL বের করে আনবে
function extractIframeSrc(input) {
  if (!input) return '';
  if (input.includes('<iframe') && input.includes('src=')) {
    const match = input.match(/src=["'](.*?)["']/);
    return match ? match[1] : input;
  }
  return input;
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 px-5 py-4">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
    </div>
  );
}

function Section({ title, copy, action, children }) {
  return (
    <section className={panelClass}>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black text-white">{title}</h2>
          {copy ? <p className="mt-2 text-sm leading-6 text-gray-400">{copy}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function BarChart({ items }) {
  const maxValue = Math.max(...items.map((item) => item.revenue), 1);
  return (
    <div className="flex h-72 items-end gap-4 rounded-[24px] border border-white/5 bg-black/20 p-5">
      {items.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
          <div className="flex h-full w-full items-end">
            <div
              className="w-full rounded-t-2xl bg-gradient-to-t from-rose-700 to-orange-400"
              style={{ height: `${Math.max((item.revenue / maxValue) * 100, 8)}%` }}
            />
          </div>
          <div className="text-center">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">{item.label}</div>
            <div className="mt-1 text-xs text-white">{money(item.revenue)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Doughnut({ items }) {
  const colors = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#6b7280'];
  const total = items.reduce((sum, item) => sum + item.count, 0) || 1;
  const segments = items.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
    portion: (item.count / total) * 100,
    offset: items.slice(0, index).reduce((sum, entry) => sum + (entry.count / total) * 100, 0),
  }));

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 42 42" className="h-40 w-40 -rotate-90">
        {segments.map((item) => (
            <circle
              key={item.status}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={item.color}
              strokeWidth="4"
              strokeDasharray={`${item.portion} ${100 - item.portion}`}
              strokeDashoffset={-item.offset}
              strokeLinecap="round"
            />
          ))}
      </svg>
      <div className="space-y-3">
        {segments.map((item) => (
          <div key={item.status} className="flex items-center gap-3 text-sm text-gray-300">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="min-w-24 capitalize">{item.status}</span>
            <span className="font-bold text-white">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard({ admin }) {
  const [active, setActive] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [siteConfig, setSiteConfig] = useState(siteDefaults);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [masterKey, setMasterKey] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: 'EVER GLOW FACE PACK', price: 0, discount: 0, image: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', order: 0, active: true });
  const [newReview, setNewReview] = useState({
    name: 'ভেরিফায়েড গ্রাহক',
    rating: 5,
    comment: '',
    image: '',
    verified: true,
  });

  async function loadAll() {
    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch('/api/admin/overview', { cache: 'no-store' }),
        fetch('/api/admin/site-config', { cache: 'no-store' }),
        fetch('/api/admin/orders', { cache: 'no-store' }),
        fetch('/api/admin/reviews', { cache: 'no-store' }),
        fetch('/api/admin/products', { cache: 'no-store' }),
        fetch('/api/admin/faqs', { cache: 'no-store' }),
        fetch('/api/admin/admins', { cache: 'no-store' }),
      ]);

      const data = await Promise.all(responses.map((response) => response.json()));
      setOverview(data[0]);
      setSiteConfig(mergeSiteConfig(data[1]));
      setOrders(data[2]);
      setReviews(data[3]);
      setProducts(data[4]);
      setFaqs(data[5]);
      setAdmins(data[6]);
    } catch {
      setMessage('Dashboard load করা যায়নি।');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const overviewCards = useMemo(() => {
    if (!overview) return [];
    return [
      ['Total Orders', overview.totalOrders],
      ['Total Revenue', money(overview.totalRevenue)],
      ['Pending Reviews', overview.pendingReviews],
      ['Customers', overview.activeCustomers],
    ];
  }, [overview]);

  async function patchItem(url, payload, handler) {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Update failed');
    if (handler) handler(data);
    return data;
  }

  async function deleteItem(url, handler) {
    const response = await fetch(url, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Delete failed');
    if (handler) handler();
  }

  async function saveSiteConfig() {
    const response = await fetch('/api/admin/site-config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteConfig),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Config save failed');
    setSiteConfig(mergeSiteConfig(data.config));
    setMessage('Site content updated হয়েছে।');
  }

  async function uploadImageToImgbb(file) {
    const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY?.trim();
    if (!key) {
      throw new Error('NEXT_PUBLIC_IMGBB_API_KEY env missing');
    }

    const body = new FormData();
    body.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: 'POST',
      body,
    });

    const data = await response.json();
    if (!response.ok || !data?.success || !data?.data?.url) {
      throw new Error(data?.error?.message || 'Image upload failed');
    }

    return data.data.url;
  }

  async function handleLocalImageUpload(file, onDone) {
    if (!file) return;

    setIsUploadingImage(true);
    setMessage('Image upload হচ্ছে...');

    try {
      const url = await uploadImageToImgbb(file);
      onDone(url);
      setMessage('Image upload complete.');
    } catch (error) {
      setMessage(error.message || 'Image upload failed');
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#070707] text-rose-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[32px] border border-white/10 bg-[#101010] p-5 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
          <div className="rounded-[26px] border border-rose-500/20 bg-gradient-to-br from-rose-600/15 to-transparent p-5">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-rose-400">EVER GLOW FACE PACK</div>
            <h1 className="mt-3 text-2xl font-black text-white">Admin Dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {admin.displayName || admin.username}
              <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-gray-500">{admin.role}</span>
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                  active === id ? 'bg-rose-600 text-white shadow-[0_15px_35px_rgba(229,9,20,0.25)]' : 'bg-white/[0.03] text-gray-300 hover:bg-white/[0.06]'
                }`}
              >
                <span>{label}</span>
                <span className="text-xs text-white/60">›</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-4">
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-gray-500">Master Key</label>
            <input value={masterKey} onChange={(event) => setMasterKey(event.target.value)} type="password" className={inputClass} placeholder="Create admin এর জন্য" />
          </div>

          <a
            href="/dashboard/settings"
            className="mt-4 flex w-full items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-600/10 px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-600/20"
          >
            Meta Pixel &amp; CAPI
          </a>

          <button type="button" onClick={handleLogout} className="mt-6 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-white/[0.08]">
            Logout
          </button>
        </aside>

        <main className="space-y-6">
          <header className="rounded-[32px] border border-white/10 bg-[#101010] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.25em] text-rose-400">Operations Control</div>
                <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Content, approvals, orders and revenue</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
                  Hero video থেকে শুরু করে benefits, offer, packages, reviews approval, orders, FAQ এবং admin accounts সবকিছু এখান থেকে manage করুন।
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {overviewCards.map(([label, value]) => <StatCard key={label} label={label} value={value} />)}
              </div>
            </div>
            {message ? <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">{message}</div> : null}
            {isUploadingImage ? <div className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Uploading image to ImageBB...</div> : null}
          </header>

          {active === 'overview' && overview ? (
            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <Section title="Revenue Graph" copy="Last 6 months revenue movement">
                <BarChart items={overview.revenueByMonth} />
              </Section>
              <Section title="Order Status Split" copy="বর্তমান order pipeline এর অবস্থা">
                <Doughnut items={overview.statusBreakdown} />
              </Section>
              <Section title="Period Analytics" copy="Daily, weekly, monthly, yearly performance">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {Object.entries(overview.periodStats).map(([key, value]) => (
                    <StatCard key={key} label={key} value={`${value.orders} | ${money(value.revenue)}`} />
                  ))}
                </div>
              </Section>
              <Section title="Recent Orders" copy="সর্বশেষ আসা orders">
                <div className="space-y-3">
                  {overview.recentOrders.map((order) => (
                    <div key={order._id} className="rounded-[22px] border border-white/10 bg-black/20 p-4 md:flex md:items-center md:justify-between">
                      <div>
                        <div className="text-sm font-bold text-white">{order.name}</div>
                        <div className="mt-1 text-sm text-gray-400">{order.phone}</div>
                      </div>
                      <div className="mt-3 text-sm text-gray-400 md:mt-0">{money(order.totalPrice)}</div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          ) : null}

          {active === 'content' ? (
            <div className="space-y-6">
              <Section
                title="Hero Content"
                copy="Headline, subtext, warning banner, YouTube/Facebook video URL এবং Hero BG image। Meta Pixel + Conversion API: সাইডবারের Meta Pixel & CAPI লিঙ্ক।"
                action={<button type="button" onClick={saveSiteConfig} className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Save Changes</button>}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <input className={inputClass} value={siteConfig.hero.badge} onChange={(event) => setSiteConfig((prev) => ({ ...prev, hero: { ...prev.hero, badge: event.target.value } }))} placeholder="Badge" />
                  
                  <div className="col-span-1 flex flex-col gap-2 md:col-span-2">
                    <input 
                      className={inputClass} 
                      value={siteConfig.hero.videoEmbedUrl} 
                      onChange={(event) => {
                        const rawValue = event.target.value;
                        const extractedUrl = extractIframeSrc(rawValue);
                        setSiteConfig((prev) => ({ ...prev, hero: { ...prev.hero, videoEmbedUrl: extractedUrl } }));
                      }} 
                      placeholder="YouTube/Facebook video Embed URL (অথবা পুরো iframe কোড পেস্ট করুন)" 
                    />
                    {siteConfig.hero.videoEmbedUrl && (
                      <div className="mt-2 aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-black/40">
                        <iframe 
                          src={siteConfig.hero.videoEmbedUrl} 
                          className="h-full w-full" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>

                  <input className={inputClass} value={siteConfig.hero.backgroundImage || ''} onChange={(event) => setSiteConfig((prev) => ({ ...prev, hero: { ...prev.hero, backgroundImage: event.target.value } }))} placeholder="Hero background image URL" />
                  <input className={inputClass} value={siteConfig.hero.title} onChange={(event) => setSiteConfig((prev) => ({ ...prev, hero: { ...prev.hero, title: event.target.value } }))} placeholder="Main title" />
                  <input className={inputClass} value={siteConfig.hero.highlight} onChange={(event) => setSiteConfig((prev) => ({ ...prev, hero: { ...prev.hero, highlight: event.target.value } }))} placeholder="Highlight title" />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <label className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                    Upload Hero BG
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        handleLocalImageUpload(file, (url) => {
                          setSiteConfig((prev) => ({ ...prev, hero: { ...prev.hero, backgroundImage: url } }));
                        });
                        event.target.value = '';
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-400">ImageBB থেকে URL auto set হবে</span>
                </div>

                <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-gray-400">Hero 3D carousel images</h3>
                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    হোমপেজের শুধু Hero ক্যারোসেলের স্লাইডগুলো এখান থেকে URL দিন বা আপলোড করুন। Save Changes চাপতে ভুলবেন না।
                  </p>
                  <div className="mt-4 space-y-4">
                    {(siteConfig.hero.carouselImages || []).map((url, index) => (
                      <div key={`${url}-${index}`} className="grid gap-3 rounded-[20px] border border-white/10 bg-black/30 p-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                        <input
                          className={inputClass}
                          value={url}
                          onChange={(event) =>
                            setSiteConfig((prev) => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                carouselImages: (prev.hero.carouselImages || []).map((item, itemIndex) =>
                                  itemIndex === index ? event.target.value : item
                                ),
                              },
                            }))
                          }
                          placeholder="Carousel image URL"
                        />
                        <label className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-bold text-white">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              handleLocalImageUpload(file, (uploadedUrl) => {
                                setSiteConfig((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    carouselImages: (prev.hero.carouselImages || []).map((item, itemIndex) =>
                                      itemIndex === index ? uploadedUrl : item
                                    ),
                                  },
                                }));
                              });
                              event.target.value = '';
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setSiteConfig((prev) => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                carouselImages: (prev.hero.carouselImages || []).filter((_, itemIndex) => itemIndex !== index),
                              },
                            }))
                          }
                          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSiteConfig((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              carouselImages: [...(prev.hero.carouselImages || []), ''],
                            },
                          }))
                        }
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white"
                      >
                        Add carousel image
                      </button>
                    </div>
                  </div>
                </div>

                <textarea className={`${inputClass} mt-4 min-h-28`} value={siteConfig.hero.subtitle} onChange={(event) => setSiteConfig((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: event.target.value } }))} placeholder="Subtitle" />
                <textarea className={`${inputClass} mt-4 min-h-24`} value={siteConfig.hero.warningText} onChange={(event) => setSiteConfig((prev) => ({ ...prev, hero: { ...prev.hero, warningText: event.target.value } }))} placeholder="Warning text" />
              </Section>

              <Section title="Media Posts" copy="YouTube বা অন্য platform এর media links">
                <div className="space-y-4">
                  {siteConfig.mediaPosts.map((item, index) => (
                    <div key={item.id || index} className="grid gap-4 rounded-[24px] border border-white/10 bg-black/20 p-4 md:grid-cols-3">
                      <input className={inputClass} value={item.title} onChange={(event) => setSiteConfig((prev) => ({ ...prev, mediaPosts: prev.mediaPosts.map((entry, entryIndex) => entryIndex === index ? { ...entry, title: event.target.value } : entry) }))} placeholder="Title" />
                      <input className={inputClass} value={item.platform} onChange={(event) => setSiteConfig((prev) => ({ ...prev, mediaPosts: prev.mediaPosts.map((entry, entryIndex) => entryIndex === index ? { ...entry, platform: event.target.value } : entry) }))} placeholder="Platform" />
                      <input className={inputClass} value={item.url} onChange={(event) => setSiteConfig((prev) => ({ ...prev, mediaPosts: prev.mediaPosts.map((entry, entryIndex) => entryIndex === index ? { ...entry, url: event.target.value } : entry) }))} placeholder="URL" />
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setSiteConfig((prev) => ({ ...prev, mediaPosts: [...prev.mediaPosts, { id: `media-${Date.now()}`, title: '', platform: '', url: '' }] }))} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white">Add Media Post</button>
                    <button type="button" onClick={saveSiteConfig} className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">Save Media</button>
                  </div>
                </div>
              </Section>
            </div>
          ) : null}

          {active === 'benefits' ? (
            <Section
              title="Benefits Section"
              copy="উপকারিতা section এর টাইটেল এবং লিস্ট এডিট করুন"
              action={<button type="button" onClick={saveSiteConfig} className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Save Benefits</button>}
            >
              <input className={inputClass} value={siteConfig.benefits.title} onChange={(event) => setSiteConfig((prev) => ({ ...prev, benefits: { ...prev.benefits, title: event.target.value } }))} placeholder="Benefits title" />
              <textarea className={`${inputClass} mt-4 min-h-64`} value={siteConfig.benefits.items.join('\n')} onChange={(event) => setSiteConfig((prev) => ({ ...prev, benefits: { ...prev.benefits, items: linesToArray(event.target.value) } }))} placeholder="প্রতি লাইনে একটি item লিখুন" />
            </Section>
          ) : null}

          {active === 'features' ? (
            <Section
              title="Features Section (cards)"
              copy="হোমপেজের #features গ্রিড — eyebrow, মেইন টাইটেল এবং প্রতিটি কার্ডের শিরোনাম, বর্ণনা, আইকন (ইমোজি) এডিট করুন"
              action={<button type="button" onClick={saveSiteConfig} className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Save Features</button>}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className={inputClass}
                  value={siteConfig.features?.eyebrow ?? ''}
                  onChange={(event) =>
                    setSiteConfig((prev) => ({
                      ...prev,
                      features: { ...(prev.features || siteDefaults.features), eyebrow: event.target.value },
                    }))
                  }
                  placeholder="Eyebrow (উপরের ছোট লেবেল)"
                />
                <input
                  className={inputClass}
                  value={siteConfig.features?.title ?? ''}
                  onChange={(event) =>
                    setSiteConfig((prev) => ({
                      ...prev,
                      features: { ...(prev.features || siteDefaults.features), title: event.target.value },
                    }))
                  }
                  placeholder="Section মেইন টাইটেল"
                />
              </div>
              <div className="mt-6 space-y-4">
                {(siteConfig.features?.items || []).map((item, index) => (
                  <div key={item.id || index} className="grid gap-3 rounded-[24px] border border-white/10 bg-black/20 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_80px_auto] md:items-end">
                    <input
                      className={inputClass}
                      value={item.title}
                      onChange={(event) =>
                        setSiteConfig((prev) => ({
                          ...prev,
                          features: {
                            ...(prev.features || siteDefaults.features),
                            items: (prev.features?.items || []).map((row, i) =>
                              i === index ? { ...row, title: event.target.value } : row
                            ),
                          },
                        }))
                      }
                      placeholder="কার্ড শিরোনাম"
                    />
                    <input
                      className={inputClass}
                      value={item.desc}
                      onChange={(event) =>
                        setSiteConfig((prev) => ({
                          ...prev,
                          features: {
                            ...(prev.features || siteDefaults.features),
                            items: (prev.features?.items || []).map((row, i) =>
                              i === index ? { ...row, desc: event.target.value } : row
                            ),
                          },
                        }))
                      }
                      placeholder="বর্ণনা"
                    />
                    <input
                      className={inputClass}
                      value={item.icon}
                      onChange={(event) =>
                        setSiteConfig((prev) => ({
                          ...prev,
                          features: {
                            ...(prev.features || siteDefaults.features),
                            items: (prev.features?.items || []).map((row, i) =>
                              i === index ? { ...row, icon: event.target.value } : row
                            ),
                          },
                        }))
                      }
                      placeholder="⚡"
                      maxLength={8}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSiteConfig((prev) => ({
                          ...prev,
                          features: {
                            ...(prev.features || siteDefaults.features),
                            items: (prev.features?.items || []).filter((_, i) => i !== index),
                          },
                        }))
                      }
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSiteConfig((prev) => ({
                        ...prev,
                        features: {
                          ...(prev.features || siteDefaults.features),
                          items: [
                            ...(prev.features?.items || []),
                            { id: `feat-${Date.now()}`, title: '', desc: '', icon: '✨' },
                          ],
                        },
                      }))
                    }
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white"
                  >
                    Add card
                  </button>
                </div>
              </div>
            </Section>
          ) : null}

          {active === 'offer' ? (
            <Section
              title="Offer Section"
              copy="Offer image, title, timer, price, CTA update করুন"
              action={<button type="button" onClick={saveSiteConfig} className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Save Offer</button>}
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <input className={inputClass} value={siteConfig.offer.badge} onChange={(event) => setSiteConfig((prev) => ({ ...prev, offer: { ...prev.offer, badge: event.target.value } }))} placeholder="Badge" />
                <input className={inputClass} value={siteConfig.offer.title} onChange={(event) => setSiteConfig((prev) => ({ ...prev, offer: { ...prev.offer, title: event.target.value } }))} placeholder="Title" />
                <input className={inputClass} value={siteConfig.offer.highlight} onChange={(event) => setSiteConfig((prev) => ({ ...prev, offer: { ...prev.offer, highlight: event.target.value } }))} placeholder="Highlight" />
                <input className={inputClass} value={siteConfig.offer.backgroundImage} onChange={(event) => setSiteConfig((prev) => ({ ...prev, offer: { ...prev.offer, backgroundImage: event.target.value } }))} placeholder="Background image path" />
                <input className={inputClass} type="number" value={siteConfig.offer.originalPrice} onChange={(event) => setSiteConfig((prev) => ({ ...prev, offer: { ...prev.offer, originalPrice: Number(event.target.value) } }))} placeholder="Original price" />
                <input className={inputClass} type="number" value={siteConfig.offer.salePrice} onChange={(event) => setSiteConfig((prev) => ({ ...prev, offer: { ...prev.offer, salePrice: Number(event.target.value) } }))} placeholder="Sale price" />
                <input className={inputClass} type="number" value={siteConfig.offer.countdownMinutes} onChange={(event) => setSiteConfig((prev) => ({ ...prev, offer: { ...prev.offer, countdownMinutes: Number(event.target.value) } }))} placeholder="Timer minutes" />
                <input className={inputClass} value={siteConfig.offer.ctaText} onChange={(event) => setSiteConfig((prev) => ({ ...prev, offer: { ...prev.offer, ctaText: event.target.value } }))} placeholder="CTA text" />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <label className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                  Upload Offer Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      handleLocalImageUpload(file, (url) => {
                        setSiteConfig((prev) => ({ ...prev, offer: { ...prev.offer, backgroundImage: url } }));
                      });
                      event.target.value = '';
                    }}
                  />
                </label>
                <span className="text-xs text-gray-400">Offer image ImageBB URL দিয়ে auto fill হবে</span>
              </div>
              <textarea className={`${inputClass} mt-4 min-h-24`} value={siteConfig.offer.stockText} onChange={(event) => setSiteConfig((prev) => ({ ...prev, offer: { ...prev.offer, stockText: event.target.value } }))} placeholder="Urgency text" />
              <textarea className={`${inputClass} mt-4 min-h-28`} value={siteConfig.offer.benefitBullets.join('\n')} onChange={(event) => setSiteConfig((prev) => ({ ...prev, offer: { ...prev.offer, benefitBullets: linesToArray(event.target.value) } }))} placeholder="প্রতি লাইনে একটি benefit লিখুন" />
            </Section>
          ) : null}

          {active === 'packages' ? (
            <Section
              title="Package Section"
              copy="Order section-এর package cards এখান থেকে update করুন"
              action={<button type="button" onClick={saveSiteConfig} className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Save Packages</button>}
            >
              <div className="space-y-4">
                {siteConfig.packages.map((item, index) => (
                  <div key={item.id || index} className="grid gap-4 rounded-[24px] border border-white/10 bg-black/20 p-4 md:grid-cols-4">
                    <input className={inputClass} value={item.label} onChange={(event) => setSiteConfig((prev) => ({ ...prev, packages: prev.packages.map((entry, entryIndex) => entryIndex === index ? { ...entry, label: event.target.value } : entry) }))} placeholder="Label" />
                    <input className={inputClass} value={item.badge || ''} onChange={(event) => setSiteConfig((prev) => ({ ...prev, packages: prev.packages.map((entry, entryIndex) => entryIndex === index ? { ...entry, badge: event.target.value } : entry) }))} placeholder="Badge" />
                    <input className={inputClass} value={item.shipping} onChange={(event) => setSiteConfig((prev) => ({ ...prev, packages: prev.packages.map((entry, entryIndex) => entryIndex === index ? { ...entry, shipping: event.target.value } : entry) }))} placeholder="Shipping copy" />
                    <input className={inputClass} type="number" value={item.price} onChange={(event) => setSiteConfig((prev) => ({ ...prev, packages: prev.packages.map((entry, entryIndex) => entryIndex === index ? { ...entry, price: Number(event.target.value) } : entry) }))} placeholder="Price" />
                  </div>
                ))}
                <button type="button" onClick={() => setSiteConfig((prev) => ({ ...prev, packages: [...prev.packages, { id: `pkg-${Date.now()}`, label: '', badge: '', shipping: '', price: 0 }] }))} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white">Add Package</button>
              </div>
            </Section>
          ) : null}

          {active === 'reviews' ? (
            <Section
              title="রিভিউ স্ক্রিনশট (#reviews)"
              copy="হোমপেজের রিভিউ স্লাইডারের ছবি এখানে URL দিন বা ফাইল আপলোড করুন। “Verified” থাকলে সাইটে দেখা যাবে।"
            >
              <div className="mb-8 grid gap-6 rounded-[24px] border border-dashed border-white/10 bg-black/20 p-4 lg:grid-cols-[minmax(0,200px)_1fr]">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">প্রিভিউ</span>
                  <div className="relative aspect-[4/5] w-full max-w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    {newReview.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={newReview.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full min-h-[160px] items-center justify-center p-3 text-center text-xs text-gray-500">
                        আপলোড বা URL দিলে এখানে দেখা যাবে
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className={inputClass}
                    value={newReview.name}
                    onChange={(event) => setNewReview((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="নাম (যেমন: ভেরিফায়েড গ্রাহক)"
                  />
                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    max="5"
                    value={newReview.rating}
                    onChange={(event) => setNewReview((prev) => ({ ...prev, rating: Number(event.target.value) }))}
                    placeholder="রেটিং ১–৫"
                  />
                  <input
                    className={`${inputClass} md:col-span-2`}
                    value={newReview.comment}
                    onChange={(event) => setNewReview((prev) => ({ ...prev, comment: event.target.value }))}
                    placeholder="কমেন্ট (ঐচ্ছিক — শুধু স্ক্রিনশট হলে খালি রাখতে পারেন)"
                  />
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <input
                      className={inputClass}
                      value={newReview.image}
                      onChange={(event) => setNewReview((prev) => ({ ...prev, image: event.target.value }))}
                      placeholder="রিভিউ স্ক্রিনশটের ইমেজ URL"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white">
                        ছবি আপলোড
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingImage}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            handleLocalImageUpload(file, (url) => {
                              setNewReview((prev) => ({ ...prev, image: url }));
                            });
                            event.target.value = '';
                          }}
                        />
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-300">
                        <input
                          type="checkbox"
                          checked={newReview.verified}
                          onChange={(event) => setNewReview((prev) => ({ ...prev, verified: event.target.checked }))}
                        />
                        নতুন রিভিউ সরাসরি Verified
                      </label>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            if (!String(newReview.image || '').trim()) {
                              setMessage('অনুগ্রহ করে ছবির URL দিন বা আপলোড করুন।');
                              return;
                            }
                            const response = await fetch('/api/admin/reviews', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                ...newReview,
                                name: newReview.name.trim() || 'ভেরিফায়েড গ্রাহক',
                                comment: newReview.comment.trim(),
                              }),
                            });
                            const data = await response.json();
                            if (!response.ok) throw new Error(data.error || 'Create review failed');
                            setReviews((prev) => [data, ...prev]);
                            setNewReview({
                              name: 'ভেরিফায়েড গ্রাহক',
                              rating: 5,
                              comment: '',
                              image: '',
                              verified: true,
                            });
                            setMessage('নতুন রিভিউ যোগ হয়েছে।');
                          } catch (error) {
                            setMessage(error.message || 'Create review failed');
                          }
                        }}
                        className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black text-white"
                      >
                        রিভিউ যোগ করুন
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                      <div className="relative h-40 w-full max-w-[140px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={review.image || '/images/user-avatar.jpg'}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-3">
                        <div>
                          <div className="text-lg font-bold text-white">{review.name}</div>
                          <div className="mt-1 text-sm text-gray-400">রেটিং: {review.rating}/5</div>
                          {review.comment ? <p className="mt-2 text-sm leading-6 text-gray-300">{review.comment}</p> : null}
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                          <input
                            className={`${inputClass} min-w-0 flex-1 sm:max-w-xl`}
                            value={review.image}
                            onChange={(event) =>
                              setReviews((prev) =>
                                prev.map((item) =>
                                  item._id === review._id ? { ...item, image: event.target.value } : item
                                )
                              )
                            }
                            placeholder="ইমেজ URL"
                          />
                          <label className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-bold text-white">
                            আপলোড
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploadingImage}
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                handleLocalImageUpload(file, async (url) => {
                                  try {
                                    await patchItem(`/api/admin/reviews/${review._id}`, { image: url }, (data) => {
                                      setReviews((prev) => prev.map((item) => (item._id === review._id ? data : item)));
                                    });
                                    setMessage('রিভিউ ছবি আপডেট হয়েছে।');
                                  } catch (error) {
                                    setMessage(error.message || 'Update failed');
                                  }
                                });
                                event.target.value = '';
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await patchItem(
                                  `/api/admin/reviews/${review._id}`,
                                  { image: review.image },
                                  (data) => {
                                    setReviews((prev) => prev.map((item) => (item._id === review._id ? data : item)));
                                  }
                                );
                                setMessage('ইমেজ URL সেভ হয়েছে।');
                              } catch (error) {
                                setMessage(error.message || 'Save failed');
                              }
                            }}
                            className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white"
                          >
                            URL সেভ
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-3 pt-1">
                          <button
                            type="button"
                            onClick={async () => {
                              await patchItem(`/api/admin/reviews/${review._id}`, { verified: !review.verified }, (data) => {
                                setReviews((prev) => prev.map((item) => (item._id === review._id ? data : item)));
                              });
                            }}
                            className={`rounded-2xl px-4 py-3 text-sm font-black ${review.verified ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-black'}`}
                          >
                            {review.verified ? 'Verified' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await deleteItem(`/api/admin/reviews/${review._id}`, () =>
                                setReviews((prev) => prev.filter((item) => item._id !== review._id))
                              );
                            }}
                            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {active === 'orders' ? (
            <Section title="Orders & Client Info" copy="কোন client কোন product/package order করেছে এবং contact details">
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr_0.6fr]">
                      <div className="space-y-2">
                        <div className="text-lg font-bold text-white">{order.name}</div>
                        <div className="text-sm text-gray-400">{order.phone}</div>
                        <div className="text-sm text-gray-400">{order.address}</div>
                        <div className="text-sm text-gray-500">{order.city}</div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div>Product: {order.productLabel || 'EVER GLOW FACE PACK'}</div>
                        <div>Package: {order.packageLabel || '-'}</div>
                        <div>Payment: {order.paymentMethod}</div>
                        <div>Total: {money(order.totalPrice)}</div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <select value={order.status} onChange={async (event) => {
                          await patchItem(`/api/admin/orders/${order._id}`, { status: event.target.value }, (data) => {
                            setOrders((prev) => prev.map((item) => (item._id === order._id ? data : item)));
                          });
                        }} className={inputClass}>
                          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <a href={`tel:${order.phone}`} className="rounded-2xl bg-rose-600 px-4 py-3 text-center text-sm font-black uppercase tracking-[0.15em] text-white">Call Client</a>
                        <button
                          type="button"
                          onClick={async () => {
                            const confirmed = window.confirm('এই order টি delete করতে চান? এটি UI এবং database দুটো থেকেই delete হবে।');

                            if (!confirmed) {
                              return;
                            }

                            try {
                              await deleteItem(`/api/admin/orders/${order._id}`, () => {
                                setOrders((prev) => prev.filter((item) => item._id !== order._id));
                              });
                              setMessage('Order delete হয়েছে।');
                            } catch (error) {
                              setMessage(error.message || 'Order delete failed');
                            }
                          }}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
                        >
                          Delete Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {active === 'products' ? (
            <Section title="Products" copy="Backend product data edit এবং delete করুন">
              <div className="mb-6 grid gap-4 rounded-[24px] border border-dashed border-white/10 bg-black/20 p-4 md:grid-cols-5">
                <input className={inputClass} value={newProduct.name} onChange={(event) => setNewProduct((prev) => ({ ...prev, name: event.target.value }))} placeholder="New product name" />
                <input className={inputClass} type="number" value={newProduct.price} onChange={(event) => setNewProduct((prev) => ({ ...prev, price: Number(event.target.value) }))} placeholder="Price" />
                <input className={inputClass} type="number" value={newProduct.discount} onChange={(event) => setNewProduct((prev) => ({ ...prev, discount: Number(event.target.value) }))} placeholder="Discount" />
                <input className={inputClass} value={newProduct.image} onChange={(event) => setNewProduct((prev) => ({ ...prev, image: event.target.value }))} placeholder="Image path" />
                <button type="button" onClick={async () => {
                  const response = await fetch('/api/admin/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...newProduct, features: [], inStock: true }),
                  });
                  const data = await response.json();
                  if (!response.ok) throw new Error(data.error || 'Create product failed');
                  setProducts((prev) => [data, ...prev]);
                  setNewProduct({ name: '', description: 'EVER GLOW FACE PACK', price: 0, discount: 0, image: '' });
                  setMessage('নতুন product create হয়েছে।');
                }} className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white">
                  Add Product
                </button>
              </div>
              <div className="mb-6 flex items-center gap-3">
                <label className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                  Upload New Product Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      handleLocalImageUpload(file, (url) => setNewProduct((prev) => ({ ...prev, image: url })));
                      event.target.value = '';
                    }}
                  />
                </label>
              </div>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="grid gap-4 rounded-[24px] border border-white/10 bg-black/20 p-4 md:grid-cols-5">
                    <input className={inputClass} value={product.name} onChange={(event) => setProducts((prev) => prev.map((item) => item._id === product._id ? { ...item, name: event.target.value } : item))} />
                    <input className={inputClass} type="number" value={product.price} onChange={(event) => setProducts((prev) => prev.map((item) => item._id === product._id ? { ...item, price: Number(event.target.value) } : item))} />
                    <input className={inputClass} type="number" value={product.discount || 0} onChange={(event) => setProducts((prev) => prev.map((item) => item._id === product._id ? { ...item, discount: Number(event.target.value) } : item))} />
                    <input className={inputClass} value={product.image || ''} onChange={(event) => setProducts((prev) => prev.map((item) => item._id === product._id ? { ...item, image: event.target.value } : item))} />
                    <div className="flex gap-3">
                      <button type="button" onClick={async () => { await patchItem(`/api/admin/products/${product._id}`, product); setMessage('Product updated হয়েছে।'); }} className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white">Save</button>
                      <label className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            handleLocalImageUpload(file, (url) =>
                              setProducts((prev) => prev.map((item) => (item._id === product._id ? { ...item, image: url } : item)))
                            );
                            event.target.value = '';
                          }}
                        />
                      </label>
                      <button type="button" onClick={async () => { await deleteItem(`/api/admin/products/${product._id}`, () => setProducts((prev) => prev.filter((item) => item._id !== product._id))); }} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {active === 'faqs' ? (
            <Section title="FAQ Manager" copy="Question / answer add, edit, delete">
              <div className="mb-6 grid gap-4 rounded-[24px] border border-dashed border-white/10 bg-black/20 p-4 lg:grid-cols-[1fr_1fr_160px]">
                <input className={inputClass} value={newFaq.question} onChange={(event) => setNewFaq((prev) => ({ ...prev, question: event.target.value }))} placeholder="New question" />
                <input className={inputClass} value={newFaq.answer} onChange={(event) => setNewFaq((prev) => ({ ...prev, answer: event.target.value }))} placeholder="New answer" />
                <button type="button" onClick={async () => {
                  const response = await fetch('/api/admin/faqs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newFaq),
                  });
                  const data = await response.json();
                  if (!response.ok) throw new Error(data.error || 'Create FAQ failed');
                  setFaqs((prev) => [...prev, data]);
                  setNewFaq({ question: '', answer: '', order: 0, active: true });
                  setMessage('নতুন FAQ create হয়েছে।');
                }} className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white">
                  Add FAQ
                </button>
              </div>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq._id} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_160px]">
                      <input className={inputClass} value={faq.question} onChange={(event) => setFaqs((prev) => prev.map((item) => item._id === faq._id ? { ...item, question: event.target.value } : item))} />
                      <input className={inputClass} value={faq.answer} onChange={(event) => setFaqs((prev) => prev.map((item) => item._id === faq._id ? { ...item, answer: event.target.value } : item))} />
                      <div className="flex gap-3">
                        <button type="button" onClick={async () => { await patchItem(`/api/admin/faqs/${faq._id}`, faq); setMessage('FAQ updated হয়েছে।'); }} className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white">Save</button>
                        <button type="button" onClick={async () => { await deleteItem(`/api/admin/faqs/${faq._id}`, () => setFaqs((prev) => prev.filter((item) => item._id !== faq._id))); }} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {active === 'admins' ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <Section title="Admin Team" copy="Current admin accounts">
                <div className="space-y-4">
                  {admins.map((entry) => (
                    <div key={entry._id} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                      <div className="text-lg font-bold text-white">{entry.displayName || entry.username}</div>
                      <div className="mt-1 text-sm text-gray-400">@{entry.username}</div>
                      <div className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-500">
                        Last Login: {entry.lastLoginAt ? new Date(entry.lastLoginAt).toLocaleString() : 'Never'}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Create New Admin" copy="Master key + username + password দিয়ে নতুন admin তৈরি করুন">
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    try {
                      const response = await fetch('/api/admin/admins', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          masterKey,
                          displayName: formData.get('displayName'),
                          username: formData.get('username'),
                          password: formData.get('password'),
                        }),
                      });
                      const data = await response.json();
                      if (!response.ok) throw new Error(data.error || 'Create admin failed');
                      event.currentTarget.reset();
                      setMessage('নতুন admin create হয়েছে।');
                      const refreshed = await fetch('/api/admin/admins', { cache: 'no-store' }).then((value) => value.json());
                      setAdmins(refreshed);
                    } catch (error) {
                      setMessage(error.message);
                    }
                  }}
                  className="space-y-4"
                >
                  <input name="displayName" className={inputClass} placeholder="Display name" required />
                  <input name="username" className={inputClass} placeholder="Username" required />
                  <input name="password" type="password" className={inputClass} placeholder="Password" required />
                  <button type="submit" className="w-full rounded-2xl bg-rose-600 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white">
                    Create Admin
                  </button>
                </form>
              </Section>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
