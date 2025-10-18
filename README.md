<div align="center">

# 💊 MediLens

### Smart Prescription & Generic Medicine Navigator

*Making Healthcare Affordable and Accessible*

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Deployment](#-deployment) • [Contributing](#-contributing)

---

</div>

## 🌟 Overview

**MediLens** is an open-source, full-stack healthcare web application designed to help users find affordable medicines and make informed healthcare decisions. Built with modern technologies, MediLens bridges the gap between expensive brand-name medications and their affordable generic alternatives.

> **⚠️ Medical Disclaimer:** This application is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified healthcare provider.

### 🎯 Problem Statement

- **70%** of Indians struggle with medicine affordability
- Generic alternatives can be **40-80% cheaper** than brand names
- Lack of easy-to-use tools for medicine information
- Difficulty in comparing pharmacy prices
- Prescription handwriting often illegible

### 💡 Our Solution

MediLens provides a seamless platform to:
- Extract medicine names from prescription images using OCR
- Find verified generic alternatives instantly
- Compare real-time prices across major Indian pharmacies
- Get evidence-based medical information through an AI chatbot
- Track medication history and adherence

---

## ✨ Features

### Core Functionality

| Feature | Description | Status |
|---------|-------------|--------|
| 📸 **Smart OCR Scanner** | Upload prescription images and extract medicine names using Tesseract OCR | ✅ Live |
| 💊 **Generic Finder** | Discover affordable generic alternatives based on active ingredients | ✅ Live |
| 💰 **Price Comparison** | Compare prices across 8+ Indian pharmacies (1mg, PharmEasy, Netmeds, etc.) | ✅ Live |
| 🤖 **Medical AI Chatbot** | Get evidence-based information using FDA-approved medical data | ✅ Live |
| ⚡ **Quick Reorder** | One-click reorder from your favorites dashboard | ✅ Live |
| 📤 **Share Medicine Details** | Share via WhatsApp, Email, or download as text | ✅ Live |
| 📊 **Analytics Dashboard** | Track search history, favorites, and medication adherence | ✅ Live |
| 🔍 **Advanced Search** | Filter by OTC, pediatric-suitable, and schedule drugs (H, H1, X) | ✅ Live |
| 📱 **Responsive Design** | Fully optimized for mobile, tablet, and desktop | ✅ Live |
| 🌙 **Dark Mode** | Eye-friendly dark theme support | ✅ Live |

### Advanced Features

- ⏰ **Medication Reminders** - Set custom reminders for your prescriptions
- 🎤 **Voice Search** - Search medicines using voice commands
- 📈 **Adherence Tracking** - Monitor medication compliance
- 🔒 **Privacy-First** - All data stored locally (no account required)
- 🌐 **Offline Support** - Service worker for offline functionality
- ♿ **Accessibility** - WCAG 2.1 compliant interface

---

## 🎬 Demo

### 🌐 Live Demo
Coming soon! Check back for the deployed version.

### 📸 Screenshots

<div align="center">

| Home Screen | Search Results | Dashboard |
|------------|---------------|-----------|
| ![Home](https://via.placeholder.com/250x150?text=Upload+Prescription) | ![Results](https://via.placeholder.com/250x150?text=Generic+Alternatives) | ![Dashboard](https://via.placeholder.com/250x150?text=Your+Dashboard) |

</div>

---

## 🏗️ Tech Stack

### Frontend
- **[React 18](https://reactjs.org/)** - Modern UI library with hooks
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animations
- **[Axios](https://axios-http.com/)** - Promise-based HTTP client
- **[React Router](https://reactrouter.com/)** - Declarative routing
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons
- **[React Toastify](https://fkhadra.github.io/react-toastify/)** - Elegant notifications

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web framework
- **[Pytesseract](https://github.com/madmaze/pytesseract)** - OCR engine wrapper
- **[OpenCV](https://opencv.org/)** - Computer vision library
- **[Pandas](https://pandas.pydata.org/)** - Data manipulation & analysis
- **[Uvicorn](https://www.uvicorn.org/)** - Lightning-fast ASGI server
- **[Pydantic](https://pydantic-docs.helpmanual.io/)** - Data validation

### Database
- **CSV Files** - Lightweight file-based storage (1000+ medicines)
- *Upgradable to PostgreSQL/SQLite for production*

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://www.python.org/downloads/))
- **Tesseract OCR** ([Installation Guide](https://github.com/tesseract-ocr/tesseract))
- **Git** ([Download](https://git-scm.com/))

#### Installing Tesseract OCR

**Windows:**
```powershell
# Download installer from:
# https://github.com/UB-Mannheim/tesseract/wiki
# Add to PATH: C:\Program Files\Tesseract-OCR
```

**macOS:**
```bash
brew install tesseract
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
```

---

### 📦 Quick Start

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/medilens.git
cd medilens
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
python main.py
```

**Backend runs at:** `http://localhost:8000`

#### 3️⃣ Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend runs at:** `http://localhost:5173`

#### 4️⃣ Open in Browser

Visit `http://localhost:5173` and start using MediLens! 🎉

---

## 📊 Database

### Medicine Database Structure

The app includes a comprehensive database of **1000+ Indian medicines** in CSV format:

| Field | Description | Example |
|-------|-------------|---------|
| `brand_name` | Brand/trade name | Crocin, Dolo 650 |
| `active_ingredient` | Active pharmaceutical ingredient | Paracetamol |
| `generic_name` | Generic equivalent name | Paracetamol |
| `use_case` | Medical indication | Fever and pain relief |
| `side_effects` | Common adverse effects | Nausea; Skin rash |
| `price` | Price in INR (₹) | 25.50 |
| `manufacturer` | Pharmaceutical company | GSK, Cipla, Sun Pharma |
| `strength` | Dosage strength | 650mg |
| `dosage_form` | Form of medication | Tablet, Syrup, Injection |
| `is_otc` | Over-the-counter availability | true/false |
| `schedule` | Drug schedule category | H, H1, X |

### Categories Included

✅ Pain relievers & Antipyretics  
✅ Antibiotics & Antimicrobials  
✅ Antacids & Digestive health  
✅ Diabetes medications  
✅ Cardiovascular drugs  
✅ Cholesterol management  
✅ Allergy & Antihistamines  
✅ Cold & Flu medications  
✅ Vitamins & Supplements  

---

## 🔌 API Endpoints

### Base URL: `http://localhost:8000`

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/` | GET | Health check & API status | - |
| `/ocr` | POST | Upload prescription & extract text | `file: image` |
| `/drugs` | GET | Get medicine information | `medicine_name: string` |
| `/search` | GET | Search medicines by name/symptom | `query: string` |
| `/info/{medicine}` | GET | Detailed medicine information | `medicine: string` |
| `/price/{medicine}` | GET | Compare pharmacy prices | `medicine: string` |

### Example API Usage

```javascript
// Search for a medicine
const response = await axios.get('http://localhost:8000/search?query=paracetamol');

// Upload prescription
const formData = new FormData();
formData.append('file', prescriptionImage);
const result = await axios.post('http://localhost:8000/ocr', formData);

// Get price comparison
const prices = await axios.get('http://localhost:8000/price/Crocin');
```

---

## 🚀 Deployment

### Deploy to Production in 30 Minutes

Ready to make your app public? Follow our comprehensive deployment guide:

**📘 [Complete Deployment Guide →](./DEPLOYMENT_GUIDE.md)**

#### Quick Deploy Stack (Free Tier)

| Service | Purpose | Cost | Setup Time |
|---------|---------|------|------------|
| [Vercel](https://vercel.com) | Frontend Hosting | Free | 5 min |
| [Render](https://render.com) | Backend Hosting | Free (750h/mo) | 15 min |
| [GitHub](https://github.com) | Code Repository | Free | 5 min |

**What You'll Get:**
- ✅ Public HTTPS URL (`https://your-app.vercel.app`)
- ✅ SSL Certificate (secure)
- ✅ Auto-deployment from GitHub
- ✅ Free tier perfect for MVP/testing
- ✅ No credit card required

---

## 🏗️ Project Structure

```
MediLens/
├── frontend/                  # React + Vite frontend
│   ├── public/
│   │   ├── manifest.json     # PWA manifest
│   │   └── service-worker.js # Offline support
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── AIChatbot.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResultsPanel.jsx
│   │   │   ├── SearchSection.jsx
│   │   │   └── ...
│   │   ├── pages/            # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                   # FastAPI backend
│   ├── main.py               # API routes & logic
│   ├── requirements.txt      # Python dependencies
│   ├── upgrade_dataset.py    # Dataset tools
│   └── validate_drug_data.py # Data validation
│
├── data/                      # Medicine database
│   ├── drugs_master.csv      # Primary database (1000+ medicines)
│   ├── drugs_expanded.csv    # Expanded version
│   └── drugs.csv             # Original dataset
│
├── DEPLOYMENT_GUIDE.md       # Step-by-step deployment
├── DATABASE_SETUP_GUIDE.md   # Database configuration
├── QUICK_DECISIONS.md        # Quick reference
└── README.md                 # This file
```

---

## 🧪 Testing

### Running Tests

```bash
# Frontend tests (coming soon)
cd frontend
npm test

# Backend tests (coming soon)
cd backend
pytest
```

### Manual Testing Checklist

- [ ] Upload a prescription image
- [ ] Verify medicine extraction works
- [ ] Search for a medicine manually
- [ ] Check generic alternatives display
- [ ] Test pharmacy price comparison
- [ ] Try AI chatbot queries
- [ ] Test Quick Reorder from Dashboard
- [ ] Share medicine details (WhatsApp/Email/Download)
- [ ] Set a medication reminder
- [ ] Check mobile responsiveness
- [ ] Test dark mode toggle
- [ ] Verify offline indicator

### Sample Test Prescription

Create a test prescription with:
```
Patient: John Doe
Date: Oct 18, 2025

Rx:
1. Crocin 650mg - 1 tab BD x 3 days
2. Pantoprazole 40mg - 1 tab OD before breakfast
3. Azithromycin 500mg - 1 tab OD x 5 days

Dr. Sarah Johnson
Reg: 12345
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

1. 🐛 **Report Bugs** - Found an issue? [Open an issue](https://github.com/YOUR_USERNAME/medilens/issues)
2. ✨ **Suggest Features** - Have ideas? Share them!
3. 📖 **Improve Documentation** - Help others understand the project
4. 💻 **Submit Pull Requests** - Fix bugs or add features

### Development Workflow

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/medilens.git

# 3. Create a feature branch
git checkout -b feature/amazing-feature

# 4. Make your changes
# ... code code code ...

# 5. Commit your changes
git commit -m "Add amazing feature"

# 6. Push to your fork
git push origin feature/amazing-feature

# 7. Open a Pull Request
```

### Coding Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation if needed
- Test your changes locally

---

## 📝 Roadmap

### Current Version: v1.0 ✅

- [x] Prescription OCR upload
- [x] Generic medicine finder
- [x] Price comparison across pharmacies
- [x] AI medical chatbot
- [x] Quick Reorder feature
- [x] Share functionality
- [x] Dashboard analytics
- [x] Dark mode support

### v1.1 (Coming Soon) 🚧

- [ ] User authentication (optional login)
- [ ] Email medication reminders
- [ ] Prescription history tracking
- [ ] Advanced search filters
- [ ] Pharmacy location finder
- [ ] Medicine interaction checker

### v2.0 (Future) 💭

- [ ] Mobile app (React Native)
- [ ] Integration with real pharmacy APIs
- [ ] Barcode scanning for medicines
- [ ] Multi-language support (Hindi, Tamil, Bengali)
- [ ] Doctor consultation booking
- [ ] Health insurance integration
- [ ] Jan Aushadhi Kendras integration

---

## 📚 Additional Documentation

| Document | Description |
|----------|-------------|
| [📘 Deployment Guide](./DEPLOYMENT_GUIDE.md) | Complete deployment walkthrough (Vercel + Render) |
| [🗄️ Database Setup](./DATABASE_SETUP_GUIDE.md) | Database configuration & upgrade paths |
| [🎯 Quick Decisions](./QUICK_DECISIONS.md) | Quick reference for common decisions |

---

## ❓ FAQ

### General Questions

**Q: Is MediLens free to use?**  
A: Yes! MediLens is completely free and open-source.

**Q: Do I need to create an account?**  
A: No! The app works without any login. All data is stored locally on your device.

**Q: Can I use this on mobile?**  
A: Absolutely! MediLens is fully responsive and works great on all devices.

**Q: Is my data secure?**  
A: Yes! All your data (favorites, search history) is stored locally in your browser. We don't send or store any personal data on servers.

### Medical Questions

**Q: Can I trust the generic alternatives suggested?**  
A: MediLens suggests generics based on matching active ingredients. However, always consult your doctor before switching medications.

**Q: Does the AI chatbot provide medical advice?**  
A: No. The chatbot provides evidence-based information for educational purposes only. It explicitly refuses to give medical advice, diagnoses, or dosage recommendations.

**Q: What if my prescription medicine isn't found?**  
A: Our database contains 1000+ common Indian medicines. If yours isn't listed, you can try searching by the generic name or contact us to add it.

### Technical Questions

**Q: Why does OCR sometimes misread prescriptions?**  
A: OCR accuracy depends on image quality. Use clear, well-lit photos with legible handwriting for best results.

**Q: Can I run this offline?**  
A: Partially. The frontend has a service worker for offline support, but you'll need an internet connection for OCR and search features.

**Q: How often is the medicine database updated?**  
A: We update the database regularly. You can also contribute updates via pull requests!

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Backend Won't Start

**Error:** `Tesseract not found`
```bash
# Solution: Install Tesseract OCR
# Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
# macOS: brew install tesseract
# Linux: sudo apt-get install tesseract-ocr
```

**Error:** `Module not found`
```bash
# Solution: Install dependencies
cd backend
pip install -r requirements.txt
```

#### Frontend Won't Start

**Error:** `npm ERR! code ENOENT`
```bash
# Solution: Install dependencies
cd frontend
npm install
```

**Error:** `Port 5173 already in use`
```bash
# Solution: Kill the process or use different port
npm run dev -- --port 5174
```

#### OCR Not Working

**Problem:** No medicines detected from prescription

**Solutions:**
1. Ensure image is clear and well-lit
2. Verify Tesseract is properly installed
3. Check backend logs for errors
4. Try a different image format (JPEG, PNG)

#### CORS Errors

**Error:** `Access-Control-Allow-Origin`

**Solution:** Verify backend CORS settings in `main.py`:
```python
allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",
]
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What This Means

✅ Commercial use allowed  
✅ Modification allowed  
✅ Distribution allowed  
✅ Private use allowed  
⚠️ Liability and warranty not provided  
📄 License and copyright notice must be preserved  

---

## � Acknowledgments

### Built With Love Using

- **OpenCV & Tesseract** - For powerful OCR capabilities
- **FastAPI** - For the blazing-fast backend
- **React & Vite** - For smooth frontend experience
- **Tailwind CSS** - For beautiful, responsive design
- **Framer Motion** - For delightful animations

### Data Sources

- Medicine information sourced from verified pharmaceutical databases
- Pharmacy data from public sources
- Medical information based on FDA-approved resources

### Special Thanks

- Healthcare workers for their valuable feedback
- Open-source community for amazing tools
- Contributors who help improve MediLens
- Users who trust us with their healthcare needs

---

## 📞 Contact & Support

### Get Help

- 📖 **Documentation:** Check our [guides](./DEPLOYMENT_GUIDE.md)
- 🐛 **Bug Reports:** [Open an issue](https://github.com/YOUR_USERNAME/medilens/issues)
- 💡 **Feature Requests:** [Start a discussion](https://github.com/YOUR_USERNAME/medilens/discussions)
- 📧 **Email:** your-email@example.com

### Stay Connected

- ⭐ **Star this repo** if you find it useful!
- 🔄 **Fork** to create your own version
- 👀 **Watch** for updates
- 📢 **Share** with others who might benefit

---

## � Support the Project

If MediLens has helped you:

- ⭐ **Star the repository** on GitHub
- 🐦 **Share** on social media
- 🐛 **Report bugs** you encounter
- � **Contribute code** or documentation
- ☕ **Buy me a coffee** (coming soon)

Every contribution helps make healthcare more affordable and accessible!

---

<div align="center">

### 🌟 Making Healthcare Affordable, One Search at a Time 🌟

**Built with ❤️ for the community**

[⬆ Back to Top](#-medilens)

---

**© 2025 MediLens | Open Source | MIT Licensed**

</div>
  
**Made with ❤️ for better healthcare access**

⭐ Star this repo if you find it helpful!

</div>
