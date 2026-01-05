# 🚀 Getting Started - Super Simple Guide

**Time needed:** 5 minutes  
**Difficulty:** Easy

## What You're Building

A website where your teacher can click buttons and fill forms to update the portfolio - no coding needed!

---

## Step 1: Get GitHub Token (2 minutes)

1. Open: https://github.com/settings/tokens
2. Click: **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `Portfolio Admin`
4. Check the box: ☑️ **repo** (all repo permissions)
5. Scroll down, click: **"Generate token"**
6. **COPY THE TOKEN** (looks like: `ghp_abc123...`)
7. Save it somewhere (you'll need it in Step 3)

---

## Step 2: Open Terminal & Navigate

```powershell
# Open PowerShell (Windows Key + X → PowerShell)

# Go to admin-panel folder
cd d:\TAYLORS\admin-panel
```

---

## Step 3: Configure Settings (1 minute)

```powershell
# Copy example file
copy .env.example .env

# Open it in Notepad
notepad .env
```

**Replace these values:**

```env
VITE_GITHUB_TOKEN=PASTE_YOUR_TOKEN_HERE
VITE_GITHUB_OWNER=YourGitHubUsername
VITE_GITHUB_REPO=TAYLORS
VITE_GITHUB_BRANCH=main
VITE_ADMIN_PASSWORD=ChooseAPassword
```

**Example:**
```env
VITE_GITHUB_TOKEN=ghp_abc123xyz789...
VITE_GITHUB_OWNER=johndoe
VITE_GITHUB_REPO=TAYLORS
VITE_GITHUB_BRANCH=main
VITE_ADMIN_PASSWORD=MySecurePassword123
```

**Save and close Notepad**

---

## Step 4: Install & Run (2 minutes)

```powershell
# Install (first time only)
npm install

# This takes 1-2 minutes...
# You'll see lots of text - that's normal!

# Once done, start the server:
npm run dev
```

**You'll see:**
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
```

---

## Step 5: Open & Test

1. **Open browser:** http://localhost:5173
2. **Login** with the password you set in Step 3
3. **Click "Publications"**
4. **Click "+ Add New Publication"**
5. **Fill the form:**
   - Title: Test Publication
   - Authors: Your Name
   - Journal: Test Journal
   - Year: 2024
   - Type: Journal
6. **Click "Save"**

**Success!** Check your GitHub repository - you should see a new commit!

---

## ✅ That's It!

Your admin panel is running!

**To use it later:**
```powershell
cd d:\TAYLORS\admin-panel
npm run dev
# Open: http://localhost:5173
```

**To stop the server:**
Press `Ctrl + C` in terminal

---

## 📱 Share with Your Teacher

**Send them:**
- URL: `http://localhost:5173` (if local)
- Password: [the one you set in .env]

**Or deploy it online** (see DEPLOYMENT.md for 10-minute setup)

---

## 🆘 Something Wrong?

### Can't login?
→ Check password in `.env` file

### "Failed to load publications"?
→ Check GitHub token in `.env`

### Port 5173 in use?
→ Close other apps or restart computer

### Still stuck?
→ Check TROUBLESHOOTING.md

---

## Next Steps

### Now (Optional):
- ✅ Deploy to Netlify (see DEPLOYMENT.md)
- ✅ Complete other editors (copy Publications pattern)

### Later (Optional):
- ✅ Train your teacher
- ✅ Add image upload UI
- ✅ Customize forms

---

## Quick Reference

**Start server:**
```powershell
cd d:\TAYLORS\admin-panel
npm run dev
```

**Stop server:**
Press `Ctrl + C`

**Check if working:**
- Open: http://localhost:5173
- Should see login page

**Make changes:**
- Edit files in `src/`
- Save
- Browser auto-refreshes

---

## Files You'll Use Most

```
admin-panel/
├── .env                    ← Your secrets (EDIT THIS)
├── src/
│   ├── pages/
│   │   └── *Editor.tsx    ← Edit forms here
│   ├── services/
│   │   └── github.ts      ← GitHub integration
│   └── types/
│       └── index.ts       ← Data types
└── [Documentation files]  ← Read these for help
```

---

## Commands Cheat Sheet

```powershell
# First time setup
cd admin-panel
npm install
copy .env.example .env
notepad .env

# Every time you want to use it
npm run dev

# When you're done
Ctrl + C

# If something breaks
rm -rf node_modules
npm install
npm run dev

# Build for production
npm run build

# Deploy to Netlify
netlify deploy --prod
```

---

## Tips

1. **Keep terminal open** while using admin panel
2. **Don't close browser tab** with http://localhost:5173
3. **Save .env file** somewhere safe (has your token!)
4. **Test with fake data first** before real data
5. **Check GitHub commits** after each save

---

## Success Checklist

After Step 5, you should have:

- ✅ Admin panel running at http://localhost:5173
- ✅ Can login with password
- ✅ Can see Publications page
- ✅ Can add a test publication
- ✅ New commit appears in GitHub
- ✅ Portfolio website still works fine

---

## What Your Teacher Will See

```
1. Open URL
2. See login page
3. Enter password
4. See nice dashboard with buttons
5. Click "Publications"
6. Click "+ Add New"
7. Fill simple form (like Google Forms)
8. Click "Save"
9. Done! Website updates in 2 minutes
```

**No code. No terminal. Just forms and buttons!**

---

## 🎉 You're Ready!

You now have a working admin panel that:
- ✅ Doesn't touch portfolio code
- ✅ Updates files via GitHub
- ✅ Triggers automatic deployments
- ✅ Is easy for non-technical users
- ✅ Costs $0 to run

**Congratulations!** 🎊

---

## Need Help?

**Read these files:**
- `SETUP.md` - More detailed setup
- `TROUBLESHOOTING.md` - Fix problems
- `README.md` - Complete documentation
- `DEPLOYMENT.md` - Put it online

**Or check:**
- Browser console (F12 → Console tab)
- Terminal output (where you ran `npm run dev`)

---

**Questions? Start here:** TROUBLESHOOTING.md  
**Want to deploy?** DEPLOYMENT.md  
**Want to understand it?** ARCHITECTURE.md

**You've got this!** 💪
