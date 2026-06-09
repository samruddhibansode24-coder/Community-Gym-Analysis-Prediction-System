# 🚀 GitHub Pages Deployment Guide

## ⚠️ Current Issues

Your gym-website is a **full-stack application** with:
- Node.js/Express backend
- MySQL database  
- Flask ML service

**GitHub Pages only serves static files** (HTML, CSS, JS), so the backend won't work there.

---

## ✅ Solution: Deploy Frontend Only (Static Site)

### Step 1: Push the Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/Community-Gym-Analysis-Prediction-System.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your GitHub repository → **Settings**
2. Navigate to **Pages** (in left sidebar)
3. Under "Build and deployment":
   - Select **Deploy from a branch**
   - Branch: `gh-pages` | Folder: `/ (root)`
4. Click **Save**

> ✨ The `.github/workflows/deploy.yml` file will automatically create the `gh-pages` branch when you push to main

### Step 3: Wait for Deployment

- GitHub Actions will automatically build and deploy your frontend
- Check the **Actions** tab in your repository to see deployment status
- Your site will be live at: `https://YOUR_USERNAME.github.io/Community-Gym-Analysis-Prediction-System/`

---

## ⚡ Next Steps: Full Stack Deployment

For the **complete application** (with backend), use one of these:

### Option A: Backend Deployment + GitHub Pages Frontend
- Deploy backend separately on **Heroku**, **Railway**, **Render**, or **AWS**
- Update `API_BASE` in `frontend/js/api.js` to your backend URL
- Deploy frontend to GitHub Pages

**Example:**
```javascript
// frontend/js/api.js
const API_BASE = 'https://your-backend-url.com/api';
```

### Option B: Single Deployment (Recommended)
Deploy the entire app (frontend + backend) to a platform like:
- **Vercel** (supports Node.js)
- **Netlify** (with serverless functions)
- **Railway**
- **Render**

---

## 🔧 Current Limitations on GitHub Pages

❌ **Won't work on GitHub Pages alone:**
- User authentication
- Enquiry submissions
- Image uploads  
- Database operations
- ML service API calls

✅ **Will work on GitHub Pages:**
- Static content (gallery images embedded in HTML)
- Gym timings (hardcoded)
- Reviews (hardcoded)
- Contact form UI (can't submit without backend)

---

## 📝 To-Do

- [ ] Push code to GitHub
- [ ] Enable GitHub Pages in repository settings
- [ ] Verify site is live
- [ ] (Optional) Deploy backend separately
- [ ] (Optional) Update API endpoints to point to live backend

