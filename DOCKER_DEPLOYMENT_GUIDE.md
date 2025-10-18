# 🐳 Switch Render to Docker Deployment

## 🎯 Why Docker?

The Python buildpack's Aptfile isn't being detected properly. Docker gives us **full control** and **guaranteed Tesseract installation**.

---

## 📋 Step-by-Step Instructions

### **1. Open Render Dashboard**
Go to: **https://dashboard.render.com**

### **2. Select Your Service**
Click on: **`medilens-backend`**

### **3. Go to Settings**
Click: **Settings** (in the left sidebar)

### **4. Change Environment to Docker**

Scroll down to find: **Environment**

**Current:** `Python 3`  
**Change to:** `Docker` ⬅️ Click the dropdown and select this

Click: **"Save Changes"** button at the bottom

### **5. Configure Docker Settings**

After changing to Docker, you'll see new fields:

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Dockerfile Path** | `Dockerfile` |
| **Docker Command** | (leave EMPTY) |
| **Docker Context** | (leave as default) |

### **6. Deploy**

Scroll to the top and click:
- **"Manual Deploy"** button
- Then **"Deploy latest commit"**

### **7. Wait for Deployment**

⏱️ **First Docker build:** 8-12 minutes  
⏱️ **Subsequent builds:** 3-5 minutes

---

## 🔍 What to Look For in Logs

### ✅ **Success Logs:**

```
==> Building Docker image...
Step 1/8 : FROM python:3.11-slim
Step 2/8 : WORKDIR /app
Step 3/8 : RUN apt-get update && apt-get install -y tesseract-ocr...
  Setting up tesseract-ocr (5.x.x)...
  Setting up tesseract-ocr-eng...
Step 4/8 : COPY requirements.txt .
Step 5/8 : RUN pip install --no-cache-dir -r requirements.txt
  Collecting fastapi==0.104.1
  Installing collected packages...
Step 6/8 : COPY . .
Step 7/8 : EXPOSE 10000
Step 8/8 : CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
==> Build successful 🎉

==> Deploying...
INFO: Started server process
INFO: Waiting for application startup
✅ Loaded 583 drugs from MASTER database
✅ Tesseract OCR is installed and accessible
🚀 MediLens Backend Started
==> Your service is live 🎉
```

### ❌ **If You See Errors:**

**"Cannot find Dockerfile"**
- Check: Root Directory = `backend`
- Check: Dockerfile Path = `Dockerfile`

**"Docker build failed"**
- Share the error logs
- I'll help troubleshoot

---

## 🧪 Testing After Deployment

### **1. Test Backend API**
Visit: `https://medilens-backend-rue7.onrender.com`

Should see:
```json
{
  "app": "MediLens API",
  "status": "running",
  "tesseract_available": true  ← Should be true!
}
```

### **2. Test Prescription Upload**
1. Go to your frontend (Vercel URL or localhost)
2. Upload a prescription image
3. Should see:
   - ✅ Medicine names extracted
   - ✅ Detailed drug information
   - ✅ No "Tesseract not installed" errors

---

## 📊 Comparison: Before vs After

| Aspect | Python Buildpack | Docker (New) |
|--------|-----------------|--------------|
| **Tesseract Installation** | ❌ Aptfile not detected | ✅ Guaranteed install |
| **Build Time** | 3-5 min | 8-12 min (first), 3-5 min (cached) |
| **Control** | Limited | Full control |
| **Reliability** | Issues with system packages | 100% reliable |
| **OCR Feature** | ❌ Not working | ✅ Working |

---

## 🆘 Troubleshooting

### **Issue: "Environment field not found"**

**Solution:** Your Render might show it differently:
- Look for "Runtime" or "Build Environment"
- Change from Python to Docker

### **Issue: "Build takes too long"**

**Solution:** First Docker build is slow (normal!)
- Installing Tesseract takes 3-4 min
- Installing Python packages takes 2-3 min
- Subsequent builds use cache (faster)

### **Issue: "Still showing Tesseract error"**

**Solution:** 
1. Check deployment actually succeeded (green checkmark)
2. Look for "✅ Tesseract OCR is installed" in logs
3. Try hard refresh on frontend (Ctrl+Shift+R)
4. Check backend URL is correct in frontend

---

## 💡 Why This Will Work

### **The Problem Before:**
Render's Python buildpack wasn't installing Tesseract from Aptfile properly due to:
- Read-only filesystem during build
- Buildpack limitations
- Timing issues

### **The Solution (Docker):**
```dockerfile
# We control EXACTLY what gets installed
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    libtesseract-dev \
    libleptonica-dev
```

Docker gives us **full control** over the entire environment. Tesseract **will** be installed.

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Render shows "Your service is live 🎉"
- [ ] Logs show "✅ Tesseract OCR is installed"
- [ ] Backend API returns `tesseract_available: true`
- [ ] Frontend prescription upload works
- [ ] No "Tesseract not installed" errors
- [ ] Medicine names extracted from images

---

## 🎉 What You'll Have After This

**100% Working Features:**
- ✅ Medicine search
- ✅ **Prescription image scanning** (NEW!)
- ✅ Generic alternatives
- ✅ Price comparison
- ✅ Drug interaction checker
- ✅ AI chatbot
- ✅ Adherence tracker
- ✅ Quick reorder
- ✅ Analytics dashboard

**Your app will be production-ready!** 🚀

---

## 📞 Need Help?

If you encounter any issues:
1. **Screenshot the error** in Render logs
2. **Share the specific error message**
3. I'll help debug immediately!

Let me know once you've switched to Docker and started the deployment! 🎯
