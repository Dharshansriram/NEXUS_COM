# 🚀 Quick Installation Guide

## Step-by-Step Setup

### 1️⃣ Install Dependencies
```bash
npm install
```

If you get any errors, try:
```bash
npm install --legacy-peer-deps
```

### 2️⃣ Set Up Environment
```bash
# Create .env file
cp env.example .env

# Edit .env and add your MongoDB URI
# Example: MONGODB_URI=mongodb://localhost:27017/component-compass
```

### 3️⃣ Start Development
```bash
npm run dev
```

This starts:
- ✅ Frontend: http://localhost:8080
- ✅ Backend API: http://localhost:3001

### 4️⃣ (Optional) Seed Database
```bash
npm run seed
```

---

## ✅ Verification Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] MongoDB running (local or Atlas)
- [ ] `npm install` completed without errors
- [ ] `.env` file exists with `MONGODB_URI`
- [ ] `npm run dev` starts both servers
- [ ] Browser opens to http://localhost:8080
- [ ] No console errors in terminal or browser

---

## 🔥 Common Issues & Fixes

### Issue: "npm ETARGET" or version errors
**Solution:** ✅ **Already fixed** in this version!

### Issue: Port 8080 or 3001 already in use
**Solution:** 
- Kill existing processes, or
- Edit ports in `vite.config.mjs` and `server/index.js`

### Issue: MongoDB connection error
**Solution:**
- Start MongoDB: `mongod` or use MongoDB Compass
- Check `.env` has correct `MONGODB_URI`
- Example local: `mongodb://localhost:27017/component-compass`
- Example Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### Issue: "Unexpected token '<'" error
**Solution:** ✅ **Already fixed** - `vite.config.mjs` now processes `.js` files as JSX

---

## 📊 What Changed (Summary)

1. **All `.jsx` files → `.js` files** (67 files renamed)
2. **Vite config updated** to process `.js` files as JSX
3. **Package versions fixed** (no more nonexistent versions)
4. **All configs updated** (jsconfig, vitest, eslint)
5. **Pure JavaScript** - no TypeScript, just JS + JSX syntax

---

## 🎯 You're Ready!

The project is now:
- ✅ Pure JavaScript (no TypeScript)
- ✅ JSX syntax in `.js` files
- ✅ All dependencies installable
- ✅ All configs properly set up
- ✅ Ready to run

Run `npm run dev` and start coding! 🚀
