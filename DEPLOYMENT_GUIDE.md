# 🚀 MediLens Deployment Guide

Complete step-by-step guide to deploy MediLens to production.

---

## 📋 What You'll Need

### Accounts (All Free Tier Available):
1. ✅ **GitHub** - For code hosting (free)
2. ✅ **Vercel** or **Netlify** - Frontend hosting (free)
3. ✅ **Render** or **Railway** - Backend hosting (free tier)
4. ✅ **Domain** (optional) - ₹800-1500/year from Namecheap/GoDaddy

---

## 🎯 Deployment Options

### Option 1: Quick Deploy (30 minutes) ⭐ RECOMMENDED
- Frontend: **Vercel** (free, unlimited bandwidth)
- Backend: **Render** (free tier, 750 hours/month)
- Database: **CSV files** (included with backend)

### Option 2: Full Control (1 hour)
- Frontend: **Netlify** 
- Backend: **Railway** (free $5 credit monthly)
- Database: CSV or upgrade to PostgreSQL

### Option 3: Professional (2 hours + costs)
- Frontend: **Vercel Pro** ($20/month)
- Backend: **AWS EC2** or **DigitalOcean** ($5-10/month)
- Database: **PostgreSQL** on Supabase/AWS RDS

---

## 🚀 STEP-BY-STEP: Quick Deploy (Option 1)

---

## PART 1: Prepare Your Code (10 minutes)

### Step 1.1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `medilens`
3. Description: `Smart Prescription & Generic Medicine Navigator`
4. Visibility: **Public** (for free deployments)
5. Click **Create repository**

### Step 1.2: Push Code to GitHub

Open PowerShell in your project folder:

```powershell
# Navigate to project root
cd "c:\Users\soumo\OneDrive\Desktop\Experimentss\MediLens"

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - MediLens v1.0"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/medilens.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**✅ Your code is now on GitHub!**

---

### Step 1.3: Prepare Backend for Deployment

Create a `Procfile` in the backend folder:

```powershell
cd backend
echo "web: uvicorn main:app --host 0.0.0.0 --port $PORT" > Procfile
```

Update `requirements.txt` to ensure all dependencies:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pytesseract==0.3.10
opencv-python-headless==4.8.1.78
Pillow==10.4.0
pandas>=2.0.0
numpy>=1.24.0
aiohttp==3.9.1
python-dotenv==1.0.0
```

**Note:** Changed `opencv-python` to `opencv-python-headless` (required for servers without GUI)

---

### Step 1.4: Configure Environment Variables

Create `.env` file in backend folder:

```env
# Environment
ENVIRONMENT=production

# CORS Origins (update after deployment)
FRONTEND_URL=https://your-app.vercel.app

# Optional: API Keys
# OPENAI_API_KEY=your_key_here
```

Add `.env` to `.gitignore`:

```powershell
# In backend folder
echo ".env" >> .gitignore
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
```

---

## PART 2: Deploy Backend to Render (15 minutes)

### Step 2.1: Sign Up for Render

1. Go to https://render.com
2. Click **Sign Up**
3. Choose **Sign up with GitHub**
4. Authorize Render to access your GitHub

### Step 2.2: Create Web Service

1. Click **New +** → **Web Service**
2. Connect your `medilens` repository
3. Configure service:

```yaml
Name: medilens-backend
Environment: Python 3
Region: Singapore (closest to India)
Branch: main
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Instance Type: Free
```

### Step 2.3: Add Environment Variables

In Render dashboard → Environment → Add:

```
Key: ENVIRONMENT
Value: production

Key: PYTHON_VERSION
Value: 3.11.0
```

### Step 2.4: Install Tesseract on Render

Add a `render.yaml` file in project root:

```yaml
services:
  - type: web
    name: medilens-backend
    env: python
    region: singapore
    plan: free
    buildCommand: |
      apt-get update
      apt-get install -y tesseract-ocr
      pip install -r backend/requirements.txt
    startCommand: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### Step 2.5: Deploy!

1. Click **Create Web Service**
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://medilens-backend.onrender.com`

**✅ Test:** Visit `https://your-backend-url.onrender.com`
You should see: `{"app":"MediLens API","status":"running"}`

---

## PART 3: Deploy Frontend to Vercel (5 minutes)

### Step 3.1: Update Backend URL in Frontend

Edit `frontend/src` files to use production backend URL:

Create `frontend/.env.production`:

```env
VITE_API_URL=https://medilens-backend.onrender.com
```

Update API calls to use environment variable:

```javascript
// Example: Update in components that call API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Use API_URL instead of hardcoded localhost
const response = await axios.get(`${API_URL}/search?query=${query}`);
```

### Step 3.2: Sign Up for Vercel

1. Go to https://vercel.com
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel

### Step 3.3: Deploy Frontend

1. Click **New Project**
2. Import your `medilens` repository
3. Configure:

```yaml
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

4. **Environment Variables** → Add:

```
Name: VITE_API_URL
Value: https://medilens-backend.onrender.com
```

5. Click **Deploy**

Wait 2-3 minutes. You'll get a URL like: `https://medilens.vercel.app`

**✅ Your app is LIVE!**

---

## PART 4: Update CORS Settings (5 minutes)

### Step 4.1: Update Backend CORS

Edit `backend/main.py`:

```python
# Update CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://medilens.vercel.app",  # Your Vercel URL
        "http://localhost:5173",  # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 4.2: Push Changes

```powershell
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the changes!

---

## PART 5: Custom Domain (Optional - 30 minutes)

### Step 5.1: Buy Domain

**Recommended Registrars:**
- [Namecheap](https://www.namecheap.com) - ₹800/year
- [GoDaddy](https://www.godaddy.com) - ₹999/year
- [Hostinger](https://www.hostinger.in) - ₹699/year

Buy a domain like: `medilens.in` or `medilens.com`

### Step 5.2: Configure Domain in Vercel

1. Go to Vercel project → Settings → Domains
2. Add your domain: `medilens.in`
3. Follow DNS instructions
4. Add CNAME record in your registrar:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

5. Wait 5-60 minutes for DNS propagation

### Step 5.3: Configure Backend Subdomain

1. Go to Render dashboard → Custom Domains
2. Add: `api.medilens.in`
3. Add CNAME in your registrar:

```
Type: CNAME
Name: api
Value: your-render-url.onrender.com
```

### Step 5.4: Update URLs

Update `frontend/.env.production`:
```env
VITE_API_URL=https://api.medilens.in
```

Update backend CORS:
```python
allow_origins=[
    "https://medilens.in",
    "https://www.medilens.in",
]
```

---

## 🔒 IMPORTANT: Production Checklist

Before going live, ensure:

### Security
- [ ] CORS configured correctly (only your domain)
- [ ] Environment variables set (not hardcoded)
- [ ] `.env` in `.gitignore`
- [ ] No sensitive data in code
- [ ] HTTPS enabled (automatic with Vercel/Render)

### Performance
- [ ] Frontend built with production mode
- [ ] Backend uses production settings
- [ ] Images optimized
- [ ] CSV data file included

### Testing
- [ ] Test all features on production URL
- [ ] Test on mobile devices
- [ ] Test prescription upload
- [ ] Test medicine search
- [ ] Test AI chatbot
- [ ] Test pharmacy links
- [ ] Test share functionality

### Legal
- [ ] Privacy Policy page (if collecting user data)
- [ ] Terms of Service
- [ ] Medical disclaimer visible
- [ ] Contact information

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem:** Page shows blank
```bash
# Check browser console for errors
# Usually: Wrong API URL or CORS issue
```

**Solution:** 
1. Verify `VITE_API_URL` is correct
2. Check backend is running
3. Check browser Network tab

**Problem:** API calls fail
```bash
# CORS or backend not responding
```

**Solution:**
1. Check backend logs in Render
2. Verify CORS origins include your Vercel URL
3. Test backend URL directly

### Backend Issues

**Problem:** Tesseract OCR not working
```bash
# Tesseract not installed on server
```

**Solution:**
1. Use `render.yaml` with apt-get install
2. Or use `opencv-python-headless`

**Problem:** Import errors
```bash
# Missing dependencies
```

**Solution:**
```powershell
# Update requirements.txt with all dependencies
pip freeze > requirements.txt
```

**Problem:** 500 Server Error
```bash
# Check Render logs
```

**Solution:**
1. Go to Render → Logs
2. Find error message
3. Fix in code and push

### Database Issues

**Problem:** Medicines not loading
```bash
# CSV file not found
```

**Solution:**
1. Ensure `data/` folder in repository
2. Check file path in `main.py`
3. Verify CSV file is committed to git

---

## 📊 Monitoring & Analytics

### Add Google Analytics (Optional)

1. Create GA4 property at https://analytics.google.com
2. Get Measurement ID: `G-XXXXXXXXXX`
3. Add to `frontend/index.html`:

```html
<head>
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
</head>
```

### Monitor Uptime

Free tools:
- [UptimeRobot](https://uptimerobot.com) - Free for 50 monitors
- [Better Uptime](https://betteruptime.com) - Free tier available

---

## 💰 Cost Breakdown

### Free Tier (Good for MVP - 1000 users)
- Frontend (Vercel): **Free** ✅
- Backend (Render): **Free** (750 hours/month) ✅
- Database (CSV): **Free** ✅
- SSL Certificate: **Free** ✅
- **Total: ₹0/month**

### With Custom Domain
- Domain: **₹800/year**
- Hosting: **Free**
- **Total: ₹67/month**

### Scaling (10,000+ users)
- Frontend (Vercel Pro): $20/month (₹1,600)
- Backend (Render Starter): $7/month (₹600)
- Database (Supabase Pro): $25/month (₹2,000)
- Domain: ₹800/year (₹67/month)
- **Total: ₹4,267/month**

---

## 🎓 Post-Deployment

### Share Your App
- Share URL on WhatsApp
- Post on LinkedIn
- Share in health forums
- Get feedback from 10-20 users

### Monitor Performance
- Check Render logs daily
- Monitor error rates
- Track user feedback
- Fix bugs quickly

### Iterate
- Add requested features
- Improve UX based on feedback
- Optimize performance
- Upgrade infrastructure when needed

---

## 🆘 Quick Commands Reference

### Update Production

```powershell
# Make changes to code
# Then push to GitHub

git add .
git commit -m "Your update message"
git push

# Vercel and Render auto-deploy!
```

### View Logs

**Backend (Render):**
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab

**Frontend (Vercel):**
1. Go to Vercel dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment → "View Function Logs"

### Rollback

**In Vercel:**
1. Go to Deployments
2. Click older working deployment
3. Click "Promote to Production"

**In Render:**
1. Go to your service
2. Click "Rollback" to previous deploy

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Frontend loads at your Vercel URL
- [ ] Backend API responds at `/` endpoint
- [ ] Medicine search works
- [ ] Prescription upload works
- [ ] AI chatbot responds
- [ ] Pharmacy links work
- [ ] Share functionality works
- [ ] Dashboard shows data
- [ ] Mobile responsive
- [ ] No console errors

---

## 🎉 Congratulations!

Your app is now LIVE on the internet! 🚀

**Share your app:**
- Send link to friends: `https://your-app.vercel.app`
- Post on social media
- Get feedback
- Iterate and improve!

---

## 📞 Next Steps

1. **Share** with 10 users this week
2. **Collect** feedback
3. **Fix** any bugs
4. **Add** requested features
5. **Scale** when needed

You've built something amazing! Now get it in front of users! 💪

---

## 🆘 Need Help?

Common deployment platforms:
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- Railway: https://docs.railway.app

Or ask me for help with specific errors! 🚀
