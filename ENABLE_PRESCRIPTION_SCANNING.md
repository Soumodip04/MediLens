# 🔧 Enable Prescription Scanning (Tesseract OCR)

## 📋 Quick Summary

Your backend is working, but prescription scanning is disabled because Tesseract OCR is not installed on Render. Follow these steps to enable it.

---

## ✅ Step 1: Update Render Build Command

### **Go to Render Dashboard**
1. Open: **https://dashboard.render.com**
2. Click on your **`medilens-backend`** service
3. Click **"Settings"** tab
4. Scroll down to **"Build Command"**

### **Update Build Command**

**Current Build Command:**
```bash
pip install -r backend/requirements.txt
```

**New Build Command (copy and paste this):**
```bash
apt-get update && apt-get install -y tesseract-ocr tesseract-ocr-eng libtesseract-dev && pip install -r backend/requirements.txt
```

### **Save and Deploy**
1. Click **"Save Changes"**
2. Scroll to top and click **"Manual Deploy"**
3. Click **"Deploy latest commit"**
4. Wait **5-10 minutes** for deployment

---

## 🔍 How to Verify It Works

### **Check Deployment Logs**

After deployment, check the logs. You should see:

✅ **Success:**
```
Setting up tesseract-ocr...
Setting up tesseract-ocr-eng...
✅ Tesseract OCR is installed and accessible
🚀 MediLens Backend Started
```

❌ **Before (what you had):**
```
⚠️ Tesseract OCR not found
📥 Please install Tesseract OCR
```

---

## 🧪 Testing Prescription Upload

Once deployed:

1. **Open your frontend** (Vercel URL)
2. **Upload a prescription image** with medicine names
3. **Check results:**
   - ✅ Should detect medicine names from the image
   - ✅ Should show detailed drug information

---

## ⚠️ Important Notes

### **Build Time**
- First build with Tesseract: **~8-12 minutes** (installing system packages)
- Subsequent builds: **~3-5 minutes** (packages cached)

### **Free Tier Limits**
Render Free tier includes:
- ✅ 750 hours/month (enough for 24/7 operation)
- ✅ System package installation (apt-get)
- ⚠️ Spins down after 15 min of inactivity
- ⚠️ Cold start: 30-60 seconds

### **Alternative: Docker Deployment**
If apt-get doesn't work, we can use Docker instead:
- Create a `Dockerfile` with Tesseract pre-installed
- Tell Render to use Docker deployment
- More reliable but slightly more complex

---

## 🆘 Troubleshooting

### **Issue: "apt-get: command not found"**

**Solution:** Render might not support apt-get in your plan. Try this alternative:

1. In Render Settings, change **Build Command** to:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. We'll use Docker instead (I can help set this up)

### **Issue: "Still showing OCR warning after deployment"**

**Solution:** 
1. Check deployment logs carefully
2. Look for "tesseract-ocr" installation messages
3. Make sure deployment succeeded (green checkmark)
4. Try triggering a fresh deployment

### **Issue: "Build takes too long"**

**Solution:**
- First build with system packages is slow (10+ min)
- Subsequent builds should be faster
- This is normal for adding system dependencies

---

## 📊 What Files Were Created

I created these files to support Tesseract:

1. **`backend/Aptfile`**
   - Lists system packages to install
   - Used by Render's buildpack

2. **`backend/render-build.sh`**
   - Custom build script
   - Installs Tesseract during build

3. **`render.yaml`**
   - Complete Render configuration
   - Can be used for "Infrastructure as Code" deployment

All files are already pushed to GitHub! ✅

---

## 🎯 Summary Checklist

- [ ] Go to Render Dashboard
- [ ] Open medilens-backend service
- [ ] Update Build Command (copy from above)
- [ ] Save Changes
- [ ] Deploy latest commit
- [ ] Wait 5-10 minutes
- [ ] Check logs for "✅ Tesseract OCR is installed"
- [ ] Test prescription upload on frontend

---

## 💡 After This Works

Once prescription scanning works, your app will have:
- ✅ Search by medicine name
- ✅ **Prescription image scanning** (NEW!)
- ✅ Generic alternatives
- ✅ Price comparison
- ✅ Drug interaction checker
- ✅ AI chatbot
- ✅ Adherence tracker
- ✅ Quick reorder from history

**Your app will be 100% feature-complete!** 🎉

---

## Need Help?

If you encounter any issues:
1. **Check deployment logs** in Render
2. **Look for error messages** about apt-get or tesseract
3. **Share the error** and I'll help troubleshoot

Let me know once you've updated the build command! 🚀
