#!/usr/bin/env bash
# Install Tesseract OCR and required dependencies for Render deployment

echo "📦 Installing Tesseract OCR..."
apt-get update
apt-get install -y tesseract-ocr tesseract-ocr-eng libtesseract-dev libleptonica-dev

echo "✅ Tesseract OCR installed successfully!"
tesseract --version
