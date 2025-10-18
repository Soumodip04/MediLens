"""
Test script to diagnose MediLens backend issues
Run this to check if everything is working properly
"""

import os
import sys
from pathlib import Path

def test_data_files():
    """Check if data files exist and are readable"""
    print("\n" + "="*50)
    print("🔍 Testing Data Files")
    print("="*50)
    
    data_dir = Path(__file__).parent / "data"
    required_files = ["drugs.csv", "drugs_expanded.csv", "drugs_master.csv"]
    
    print(f"📁 Data directory: {data_dir}")
    print(f"   Exists: {data_dir.exists()}\n")
    
    all_good = True
    for file in required_files:
        file_path = data_dir / file
        exists = file_path.exists()
        size = file_path.stat().st_size if exists else 0
        print(f"   {'✅' if exists else '❌'} {file:<20} ({size:,} bytes)")
        if not exists:
            all_good = False
    
    return all_good

def test_dependencies():
    """Check if all required packages are installed"""
    print("\n" + "="*50)
    print("📦 Testing Dependencies")
    print("="*50)
    
    required_packages = [
        "fastapi",
        "uvicorn",
        "opencv-python",
        "pytesseract",
        "numpy",
        "pandas",
        "PIL",
        "aiohttp"
    ]
    
    all_good = True
    for package in required_packages:
        try:
            if package == "opencv-python":
                import cv2
                print(f"   ✅ {package:<20} (version: {cv2.__version__})")
            elif package == "PIL":
                from PIL import Image
                print(f"   ✅ {package:<20} (Pillow)")
            else:
                module = __import__(package)
                version = getattr(module, '__version__', 'unknown')
                print(f"   ✅ {package:<20} (version: {version})")
        except ImportError as e:
            print(f"   ❌ {package:<20} NOT INSTALLED")
            all_good = False
    
    return all_good

def test_tesseract():
    """Check if Tesseract OCR is installed"""
    print("\n" + "="*50)
    print("🔎 Testing Tesseract OCR")
    print("="*50)
    
    try:
        import pytesseract
        version = pytesseract.get_tesseract_version()
        print(f"   ✅ Tesseract version: {version}")
        
        # Try to get tesseract path
        if os.name == 'nt':  # Windows
            possible_paths = [
                r"C:\Program Files\Tesseract-OCR\tesseract.exe",
                r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            ]
            for path in possible_paths:
                if os.path.exists(path):
                    print(f"   📍 Found at: {path}")
                    break
        
        return True
    except Exception as e:
        print(f"   ❌ Tesseract NOT found: {e}")
        print(f"   📥 Install from: https://github.com/UB-Mannheim/tesseract/wiki")
        return False

def test_database_loading():
    """Test if database can be loaded"""
    print("\n" + "="*50)
    print("💾 Testing Database Loading")
    print("="*50)
    
    try:
        import pandas as pd
        data_dir = Path(__file__).parent / "data"
        
        # Try master first
        master_path = data_dir / "drugs_master.csv"
        if master_path.exists():
            df = pd.read_csv(master_path)
            print(f"   ✅ Loaded {len(df)} drugs from drugs_master.csv")
            print(f"   📊 Columns: {', '.join(df.columns.tolist())}")
            print(f"   📝 Sample drug: {df.iloc[0]['Medicine Name'] if 'Medicine Name' in df.columns else df.iloc[0][0]}")
            return True
        else:
            print(f"   ❌ drugs_master.csv not found")
            return False
    except Exception as e:
        print(f"   ❌ Error loading database: {e}")
        return False

def test_api_endpoints():
    """Test if API can be imported"""
    print("\n" + "="*50)
    print("🌐 Testing API Setup")
    print("="*50)
    
    try:
        sys.path.insert(0, str(Path(__file__).parent))
        from main import app, drugs_df
        
        print(f"   ✅ FastAPI app imported successfully")
        print(f"   ✅ Database loaded: {drugs_df is not None and not drugs_df.empty}")
        if drugs_df is not None:
            print(f"   📊 Total medicines in memory: {len(drugs_df)}")
        
        return True
    except Exception as e:
        print(f"   ❌ Error importing API: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("\n")
    print("🏥 MediLens Backend Diagnostic Test")
    print("="*50)
    
    results = {
        "Data Files": test_data_files(),
        "Dependencies": test_dependencies(),
        "Tesseract OCR": test_tesseract(),
        "Database Loading": test_database_loading(),
        "API Setup": test_api_endpoints()
    }
    
    print("\n" + "="*50)
    print("📋 Summary")
    print("="*50)
    
    for test, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"   {status} - {test}")
    
    all_passed = all(results.values())
    
    print("\n" + "="*50)
    if all_passed:
        print("✅ All tests passed! Backend should work properly.")
        print("🚀 Start backend with: python backend/main.py")
    else:
        print("❌ Some tests failed. Please fix the issues above.")
    print("="*50 + "\n")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
