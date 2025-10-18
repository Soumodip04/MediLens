# 🚀 MediLens - Quick Deployment Steps

**Follow these steps to deploy your app to the internet!**

---

## ✅ Pre-Deployment Checklist

Before starting, ensure:
- [ ] Backend runs successfully (`python main.py`)
- [ ] Frontend runs successfully (`npm run dev`)
- [ ] All features work locally
- [ ] You have a GitHub account
- [ ] You have an email account for signups

---

## STEP 1: Prepare GitHub Repository (5 minutes)

### 1.1 Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `medilens`
   - **Description:** `Smart Prescription & Generic Medicine Navigator - Making Healthcare Affordable`
   - **Visibility:** Public (required for free deployments)
   - **Initialize:** ❌ DON'T check any boxes
3. Click **"Create repository"**

### 1.2 Push Your Code

Open PowerShell in your project folder and run these commands:

```powershell
# Navigate to your project
cd "c:\Users\soumo\OneDrive\Desktop\Experimentss\MediLens"

# Initialize git (if not already done)
git init

# Configure git (replace with your info)
git config user.name "Your Name"
git config user.email "your-email@example.com"

# Add all files
git add .

# Commit
git commit -m "Initial commit - MediLens v1.0 🚀"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/medilens.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**✅ Done! Your code is now on GitHub.**

---

## STEP 2: Deploy Backend to Render (15 minutes)

### 2.1 Sign Up for Render

1. Go to https://render.com
2. Click **"Get Started"**
3. Choose **"Sign up with GitHub"**
4. Authorize Render to access your GitHub

### 2.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect" next to your `medilens` repository**
3. Configure the service:

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

4. Click **"Create Web Service"**

### 2.3 Wait for Deployment

- This will take 5-10 minutes
- Watch the logs scroll
- Wait for "Your service is live 🎉"

### 2.4 Copy Your Backend URL

You'll get a URL like:
```
https://medilens-backend-xxxx.onrender.com
```

**📋 COPY THIS URL - You'll need it next!**

### 2.5 Test Your Backend

Visit: `https://your-backend-url.onrender.com`

You should see:
```json
{
  "app": "MediLens API",
  "status": "running",
  "version": "1.0.0"
}
```

**✅ Backend is LIVE!**

---

## STEP 3: Deploy Frontend to Vercel (10 minutes)

### 3.1 Sign Up for Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### 3.2 Create New Project

1. Click **"Add New..."** → **"Project"**
2. Click **"Import" next to your `medilens` repository**
3. Configure the project:

```yaml
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.3 Add Environment Variable

**IMPORTANT:** Click **"Environment Variables"**

Add:
```
Name: VITE_API_URL
Value: https://your-backend-url.onrender.com
```

(Use the URL you copied from Step 2.4)

### 3.4 Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll see "Congratulations! 🎉"

### 3.5 Get Your App URL

You'll get a URL like:
```
https://medilens-xxxx.vercel.app
```

**🎉 YOUR APP IS LIVE!**

---

## STEP 4: Update CORS Settings (5 minutes)

### 4.1 Copy Your Vercel URL

From Step 3.5, copy your complete Vercel URL.

### 4.2 Update Backend CORS

1. Open `backend/main.py` in VS Code
2. Find the CORS middleware section (around line 106)
3. Update `allow_origins` to include your Vercel URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://medilens-xxxx.vercel.app",  # Your Vercel URL
        "http://localhost:5173",  # Keep for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4.3 Push the Update

```powershell
# In your project folder
git add .
git commit -m "Update CORS for production"
git push
```

**Render will automatically redeploy in 2-3 minutes!**

---

## STEP 5: Test Your Live App (5 minutes)

### 5.1 Open Your App

Visit your Vercel URL: `https://medilens-xxxx.vercel.app`

### 5.2 Test Features

- [ ] Homepage loads correctly
- [ ] Try searching for "paracetamol"
- [ ] Check if results appear
- [ ] Try uploading a prescription (if you have one)
- [ ] Test AI chatbot
- [ ] Test on mobile (open on your phone)

### 5.3 Fix Common Issues

**Problem:** "Network Error" or "CORS Error"

**Solution:**
1. Wait 2-3 minutes for Render to redeploy
2. Check your backend URL is correct in Vercel environment variables
3. Verify CORS settings in `main.py`

**Problem:** "Service Unavailable"

**Solution:**
- Render free tier sleeps after 15 min of inactivity
- First request takes 30-60 seconds to wake up
- Refresh the page and wait

---

## 🎉 SUCCESS! Your App is Live!

Share your app with the world:

### Your Live URLs:
- **Frontend (Public):** `https://medilens-xxxx.vercel.app`
- **Backend (API):** `https://medilens-backend-xxxx.onrender.com`

### Share It:
- Send to friends on WhatsApp
- Post on LinkedIn
- Share on Twitter
- Add to your portfolio

---

## 📊 Monitoring Your App

### View Logs

**Backend Logs (Render):**
1. Go to https://dashboard.render.com
2. Click your service
3. Click "Logs" tab

**Frontend Logs (Vercel):**
1. Go to https://vercel.com/dashboard
2. Click your project
3. Click "Deployments" → Latest → "View Function Logs"

### Check Uptime

Add free monitoring:
- https://uptimerobot.com (Free for 50 monitors)
- Add your Vercel URL
- Get email alerts if site goes down

---

## 🔄 Updating Your App

Whenever you make changes:

```powershell
# Make your code changes
# Then:

git add .
git commit -m "Description of your changes"
git push

# Both Vercel and Render will auto-deploy!
```

---

## 💰 Cost Breakdown

**Current Setup (Free):**
- Frontend (Vercel): ✅ Free Forever
- Backend (Render): ✅ Free (750 hours/month)
- Database (CSV): ✅ Free
- SSL Certificate: ✅ Free
- **Total: ₹0/month** 🎉

---

## 🆘 Need Help?

### Common Issues:

**1. Git push rejected**
```powershell
# Solution:
git pull origin main --rebase
git push
```

**2. Backend won't start on Render**
- Check logs in Render dashboard
- Verify requirements.txt is correct
- Ensure Tesseract commands are commented out for now

**3. Frontend shows blank page**
- Check browser console for errors
- Verify VITE_API_URL in Vercel environment variables
- Check backend is running

**4. CORS errors persist**
- Verify your Vercel URL is in CORS origins
- Make sure you pushed the updated main.py
- Wait 2-3 min for Render to redeploy

---

## 📞 Support

- **Documentation:** Read DEPLOYMENT_GUIDE.md for more details
- **GitHub Issues:** Create an issue if something's wrong
- **Email:** Ask your friends/community for help

---

## 🎓 Next Steps After Deployment

1. **Test Everything:** Use the app for a week
2. **Get Feedback:** Share with 10 people
3. **Add Analytics:** Set up Google Analytics (optional)
4. **Custom Domain:** Buy `medilens.in` if serious (₹800/year)
5. **Upgrade:** When you have 100+ users, upgrade to paid plans

---

## 🌟 Congratulations!

You've successfully deployed a full-stack healthcare application! 

**Share your achievement:**
- ✅ Update your LinkedIn
- ✅ Add to your portfolio
- ✅ Tell your friends
- ✅ Star the repo on GitHub

**You're officially a full-stack developer! 🚀**

---

**Need help? Just ask! I'm here to support you. Good luck! 💪**
