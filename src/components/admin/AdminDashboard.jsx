'use client';

import { useEffect, useMemo, useState } from 'react';
import { mergeSiteConfig, siteDefaults } from '@/lib/siteDefaults';

const navItems = [
  ['overview', 'Overview'],
  ['content', 'Hero & Media'],
  ['benefits', 'Benefits'],
  ['offer', 'Offer'],
  ['packages', 'Packages'],
  ['reviews', 'Reviews'],
  ['orders', 'Orders'],
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
  const [newProduct, setNewProduct] = useState({ name: '', description: 'Magic Tissue', price: 0, discount: 0, image: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', order: 0, active: true });

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
      setMessage('Dashboard load করা যায়নি।');
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
    setMessage('Site content updated হয়েছে।');
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
            <div className="text-xs font-black uppercase tracking-[0.25em] text-rose-400">Magic Tissue</div>
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
                copy="Headline, subtext, warning banner and video embed URL"
                action={<button type="button" onClick={saveSiteConfig} className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Save Changes</button>}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <input className={inputClass} value={siteConfig.hero.badge} onChange={(event) => setSiteConfig((prev) => ({ ...prev, hero: { ...prev.hero, badge: event.target.value } }))} placeholder="Badge" />
                  <input className={inputClass} value={siteConfig.hero.videoEmbedUrl} onChange={(event) => setSiteConfig((prev) => ({ ...prev, hero: { ...prev.hero, videoEmbedUrl: event.target.value } }))} placeholder="YouTube embed URL" />
                  <input className={inputClass} value={siteConfig.hero.title} onChange={(event) => setSiteConfig((prev) => ({ ...prev, hero: { ...prev.hero, title: event.target.value } }))} placeholder="Main title" />
                  <input className={inputClass} value={siteConfig.hero.highlight} onChange={(event) => setSiteConfig((prev) => ({ ...prev, hero: { ...prev.hero, highlight: event.target.value } }))} placeholder="Highlight title" />
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
              copy="উপকারিতা section heading এবং list"
              action={<button type="button" onClick={saveSiteConfig} className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Save Benefits</button>}
            >
              <input className={inputClass} value={siteConfig.benefits.title} onChange={(event) => setSiteConfig((prev) => ({ ...prev, benefits: { ...prev.benefits, title: event.target.value } }))} placeholder="Benefits title" />
              <textarea className={`${inputClass} mt-4 min-h-64`} value={siteConfig.benefits.items.join('\n')} onChange={(event) => setSiteConfig((prev) => ({ ...prev, benefits: { ...prev.benefits, items: linesToArray(event.target.value) } }))} placeholder="প্রতি লাইনে একটি item লিখুন" />
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
            <Section title="Reviews Approval" copy="Approve করলে public UI-তে review show হবে">
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-lg font-bold text-white">{review.name}</div>
                        <div className="mt-1 text-sm text-gray-400">Rating: {review.rating}/5</div>
                        <p className="mt-3 text-sm leading-6 text-gray-300">{review.comment}</p>
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={async () => {
                          await patchItem(`/api/admin/reviews/${review._id}`, { verified: !review.verified }, (data) => {
                            setReviews((prev) => prev.map((item) => (item._id === review._id ? data : item)));
                          });
                        }} className={`rounded-2xl px-4 py-3 text-sm font-black ${review.verified ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-black'}`}>
                          {review.verified ? 'Approved' : 'Approve'}
                        </button>
                        <button type="button" onClick={async () => {
                          await deleteItem(`/api/admin/reviews/${review._id}`, () => setReviews((prev) => prev.filter((item) => item._id !== review._id)));
                        }} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white">
                          Delete
                        </button>
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
                        <div>Product: {order.productLabel || 'Magic Tissue'}</div>
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
                  setNewProduct({ name: '', description: 'Magic Tissue', price: 0, discount: 0, image: '' });
                  setMessage('নতুন product create হয়েছে।');
                }} className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white">
                  Add Product
                </button>
              </div>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="grid gap-4 rounded-[24px] border border-white/10 bg-black/20 p-4 md:grid-cols-5">
                    <input className={inputClass} value={product.name} onChange={(event) => setProducts((prev) => prev.map((item) => item._id === product._id ? { ...item, name: event.target.value } : item))} />
                    <input className={inputClass} type="number" value={product.price} onChange={(event) => setProducts((prev) => prev.map((item) => item._id === product._id ? { ...item, price: Number(event.target.value) } : item))} />
                    <input className={inputClass} type="number" value={product.discount || 0} onChange={(event) => setProducts((prev) => prev.map((item) => item._id === product._id ? { ...item, discount: Number(event.target.value) } : item))} />
                    <input className={inputClass} value={product.image || ''} onChange={(event) => setProducts((prev) => prev.map((item) => item._id === product._id ? { ...item, image: event.target.value } : item))} />
                    <div className="flex gap-3">
                      <button type="button" onClick={async () => { await patchItem(`/api/admin/products/${product._id}`, product); setMessage('Product updated হয়েছে।'); }} className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white">Save</button>
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
                  setMessage('নতুন FAQ create হয়েছে।');
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
                        <button type="button" onClick={async () => { await patchItem(`/api/admin/faqs/${faq._id}`, faq); setMessage('FAQ updated হয়েছে।'); }} className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white">Save</button>
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

              <Section title="Create New Admin" copy="Master key + username + password দিয়ে নতুন admin তৈরি করুন">
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
                      setMessage('নতুন admin create হয়েছে।');
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
