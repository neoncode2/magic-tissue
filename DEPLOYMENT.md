# 🚀 মাজিক টিস্যু - স্থাপনা গাইড

এই ফাইলটি আপনাকে Magic Tissue ল্যান্ডিং পেজ স্থাপন করতে সাহায্য করবে।

## 📊 স্থাপনা বিকল্প

### অপশন 1: Vercel (সুপারিশকৃত) ⭐

**কেন Vercel?**
- Next.js এর জন্য অফিশিয়াল হোস্টিং
- স্বয়ংক্রিয় স্থাপনা
- বিনামূল্যে **SSL সার্টিফিকেট**
- দ্রুত CDN বিশ্বব্যাপী

#### ধাপে ধাপে:

1. **GitHub এ পুশ করুন**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/magic-tissue.git
   git push -u origin main
   ```

2. **Vercel এ সাইন আপ করুন**
   - [vercel.com](https://vercel.com) এ যান
   - GitHub দিয়ে সাইন আপ করুন
   - অনুমতি দিন

3. **নতুন প্রকল্প তৈরি করুন**
   - "New Project" ক্লিক করুন
   - `magic-tissue` রিপোজিটরি নির্বাচন করুন
   - "Import" ক্লিক করুন

4. **পরিবেশ ভেরিয়েবল যোগ করুন**
   - "Environment Variables" ট্যাবে যান
   - নাম: `MONGODB_URI`
   - মূল্য: আপনার MongoDB সংযোগ স্ট্রিং
   - Add করুন

5. **স্থাপন করুন**
   - "Deploy" বোতাম ক্লিক করুন
   - অপেক্ষা করুন ৫-১০ মিনিট
   - সাফল্য! 🎉

#### MongoDB Atlas এ ডাটাবেস সেটআপ:

1. [mongodb.com/cloud](https://www.mongodb.com/cloud) এ যান
2. নতুন ক্লাউড প্রোজেক্ট তৈরি করুন
3. ফ্রি ক্লাস্টার তৈরি করুন
4. সংযোগ স্ট্রিং সংগ্রহ করুন:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/magic-tissue?retryWrites=true&w=majority
   ```
5. Vercel এ এই URL যোগ করুন

---

### অপশন 2: Netlify

#### ধাপে ধাপে:

1. [netlify.com](https://www.netlify.com) এ যান
2. GitHub দিয়ে সাইন আপ করুন
3. GitHub রিপোজিটরি সংযুক্ত করুন
4. পরিবেশ ভেরিয়েবল যোগ করুন
5. স্থাপন করুন

**বিল্ড সেটিংস:**
- **Base directory:** `/`
- **Build command:** `npm run build`
- **Publish directory:** `.next`

---

### অপশন 3: Railway

#### ধাপে ধাপে:

1. [railway.app](https://railway.app) এ যান
2. GitHub দিয়ে সাইন আপ করুন
3. নতুন প্রকল্প তৈরি করুন
4. GitHub রিপোজিটরি নির্বাচন করুন
5. পরিবেশ ভেরিয়েবল যোগ করুন
6. স্থাপন করুন

---

### অপশন 4: স্ব-হোস্টেড (VPS)

#### প্রয়োজনীয়তা:
- Ubuntu 20.04+ সার্ভার
- Node.js + npm

#### ইনস্টলেশন:

```bash
# সার্ভার এ যান
ssh user@your_server_ip

# আপডেট করুন
sudo apt update
sudo apt upgrade -y

# Node.js ইনস্টল করুন
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git ইনস্টল করুন
sudo apt install -y git

# প্রকল্প ক্লোন করুন
git clone https://github.com/YOUR_USERNAME/magic-tissue.git
cd magic-tissue

# নির্ভরতা ইনস্টল করুন
npm install

# বিল্ড করুন
npm run build

# পরিবেশ ভেরিয়েবল সেট করুন
nano .env.local
# MONGODB_URI=your_connection_string যোগ করুন

# চালু করুন
npm start
```

#### Nginx দিয়ে রিভার্স প্রক্সি সেট আপ করুন:

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL সার্টিফিকেট (Let's Encrypt):

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your_domain.com
```

#### PM2 দিয়ে প্রক্রিয়া ব্যবস্থাপনা:

```bash
npm install -g pm2
pm2 start npm --name "magic-tissue" -- start
pm2 startup
pm2 save
```

---

## ✅ ডিপ্লয়মেন্ট পরবর্তী পরীক্ষা

### 1. সাইট অ্যাক্সেস করুন
```bash
curl https://your-domain.com
```

### 2. API পরীক্ষা করুন
```bash
curl https://your-domain.com/api/orders
```

### 3. ডাটাবেস সংযোগ পরীক্ষা করুন
- অর্ডার ফর্ম পূরণ করুন এবং জমা দিন
- MongoDB এ অর্ডার চেক করুন

### 4. পারফরম্যান্স চেক করুন
- [PageSpeed Insights](https://pagespeed.web.dev) ব্যবহার করুন
- [GTmetrix](https://gtmetrix.com) ব্যবহার করুন

---

## 🔒 নিরাপত্তা চেকলিস্ট

- [ ] `.env.local` `.gitignore` তে আছে
- [ ] MongoDB ক্রেডেনশিয়াল গোপনীয় রাখা হয়েছে
- [ ] HTTPS সার্টিফিকেট সক্রিয়
- [ ] CORS সঠিকভাবে কনফিগার করা হয়েছে
- [ ] ইনপুট যাচাইকরণ সক্ষম
- [ ] Rate limiting সক্রিয়

---

## 🆘 সাধারণ সমস্যা এবং সমাধান

### সমস্যা: "Cannot find module"
```bash
# সমাধান:
rm -rf node_modules package-lock.json
npm install
npm run build
```

### সমস্যা: MongoDB সংযোগ ব্যর্থ
- MongoDB Atlas ইউআরএল সঠিক কিনা চেক করুন
- আইপি হোয়াইটলিস্ট চেক করুন (MongoDB Atlas)
- নেটওয়ার্ক সংযোগ পরীক্ষা করুন

### সমস্যা: API রেসপন্স হচ্ছে না
- সার্ভার লগ চেক করুন
- `npm run dev` এ স্থানীয়ভাবে পরীক্ষা করুন
- ফায়ারওয়াল নিয়ম চেক করুন

---

## 🔄 CI/CD পাইপলাইন

### GitHub Actions দিয়ে স্বয়ংক্রিয় স্থাপনা

`.github/workflows/deploy.yml` তৈরি করুন:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📈 পারফরম্যান্স অপ্টিমাইজেশন

```javascript
// next.config.mjs এ যোগ করুন:
export default {
  compress: true,
  swcMinify: true,
  images: {
    domains: ['your-domain.com'],
  },
};
```

---

## 📞 সহায়তা

সমস্যা হলে:
1. লগ চেক করুন
2. স্থানীয়ভাবে পরীক্ষা করুন (`npm run dev`)
3. আপনার হোস্টিং প্রদানকারীর সহায়তা যোগাযোগ করুন

---

**স্থাপনা সফল হলে, আপনার ল্যান্ডিং পেজ বিশ্বব্যাপী লাইভ! 🌍🎉**
