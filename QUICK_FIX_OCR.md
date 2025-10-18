# 🚨 QUICK FIX: Enable OCR/Prescription Upload

## ⚡ The Problem
- ✅ Search works
- ✅ Generic alternatives work  
- ✅ Drug interactions work
- ❌ **Prescription upload FAILS** ← You are here

## 🎯 The Solution (5 minutes)

### Step 1: Open Render Dashboard
Go to: **https://dashboard.render.com**

### Step 2: Select Your Service
Click on: **`medilens-backend`**

### Step 3: Go to Settings
Click the **"Settings"** tab

### Step 4: Update Build Command

**Find the "Build Command" field**

**Current command:**
```bash
pip install -r requirements.txt
```

**Replace with this (copy-paste):**
```bash
apt-get update && apt-get install -y tesseract-ocr tesseract-ocr-eng && pip install -r requirements.txt
```

### Step 5: Save Changes
Click **"Save Changes"** button

### Step 6: Redeploy
1. Scroll to top of page
2. Click **"Manual Deploy"** button
3. Click **"Deploy latest commit"**

### Step 7: Wait
⏱️ **Wait 8-10 minutes** (Tesseract installation takes time)

### Step 8: Verify Success

**Check the deployment logs. You should see:**

✅ **BEFORE (what you had):**
```
⚠️ Tesseract OCR not found
📥 Please install Tesseract OCR
```

✅ **AFTER (what you'll get):**
```
Setting up tesseract-ocr...
Setting up tesseract-ocr-eng...
✅ Tesseract OCR is installed and accessible
🚀 MediLens Backend Started
```

---

## 🎉 That's It!

After redeployment:
1. **Upload a prescription image**
2. **OCR will extract medicine names**
3. **Get detailed drug information**

---

## 📝 Why This Works

- `Aptfile` (already created) tells Render which system packages to install
- Updated build command manually installs Tesseract during deployment
- First deployment with Tesseract takes longer (~10 min)
- Subsequent deployments are faster (~3-5 min)

---

## ⚠️ Troubleshooting

### If build fails with "apt-get: command not found"
Render's free tier should support apt-get. If not:
1. Check if you're using Docker runtime
2. Or contact me for Docker-based deployment

### If Tesseract still not found after deployment
1. Check deployment logs carefully
2. Look for any error messages during apt-get install
3. Make sure deployment succeeded (green checkmark)
4. Try redeploying again

---

## ✅ Current Status

- ✅ Backend: Deployed
- ✅ Frontend: Working (search, generics, interactions)
- ✅ Config files: Created (Aptfile, render-build.sh)
- ⏳ Tesseract: Needs Render build command update (YOU DO THIS)
- ⏳ OCR: Will work after redeployment

---

**Go do it now! Takes 5 minutes!** 🚀
