# ✅ Setup Checklist

Use this checklist to get your admin panel up and running!

## 🎯 Phase 1: Initial Setup (5 minutes)

- [ ] **Get GitHub Personal Access Token**
  - Go to: https://github.com/settings/tokens
  - Create token with `repo` scope
  - Copy token (save it somewhere safe!)

- [ ] **Configure Environment**
  ```powershell
  cd admin-panel
  copy .env.example .env
  notepad .env
  ```
  - [ ] Add GitHub token
  - [ ] Add GitHub username
  - [ ] Add repository name (TAYLORS)
  - [ ] Add branch name (main)
  - [ ] Set admin password

- [ ] **Install Dependencies**
  ```powershell
  npm install
  ```

- [ ] **Start Development Server**
  ```powershell
  npm run dev
  ```

- [ ] **Test Login**
  - Open http://localhost:5173
  - Enter your password
  - Should see dashboard

## 🧪 Phase 2: Testing (10 minutes)

- [ ] **Test Publications Editor**
  - [ ] Click "Publications"
  - [ ] Click "Add New Publication"
  - [ ] Fill form with test data
  - [ ] Click "Save"
  - [ ] Check GitHub repo for new commit
  - [ ] Edit the test publication
  - [ ] Delete the test publication

- [ ] **Verify GitHub Integration**
  - [ ] Go to your GitHub repository
  - [ ] Check commits show admin panel changes
  - [ ] Verify data/publications.ts was updated
  - [ ] Check if Netlify deployed automatically

- [ ] **Test Other Sections**
  - [ ] Click through all dashboard sections
  - [ ] Verify they load (even if placeholder)

## 📝 Phase 3: Expand Editors (Optional)

Choose which sections your teacher needs most:

- [ ] **Awards Editor**
  - [ ] Copy PublicationsEditor.tsx
  - [ ] Rename to AwardsEditor.tsx
  - [ ] Update form fields for awards
  - [ ] Test add/edit/delete

- [ ] **Presentations Editor**
  - [ ] Copy PublicationsEditor.tsx
  - [ ] Update for presentations data
  - [ ] Test functionality

- [ ] **Research Projects Editor**
  - [ ] Implement similar to above

- [ ] **Supervision Editor**
  - [ ] Implement similar to above

- [ ] **Evaluation Editor**
  - [ ] Implement similar to above

## 🚀 Phase 4: Deployment (10 minutes)

### Option A: Netlify (Recommended)

- [ ] **Build Project**
  ```powershell
  npm run build
  ```

- [ ] **Deploy to Netlify**
  - [ ] Install Netlify CLI: `npm install -g netlify-cli`
  - [ ] Login: `netlify login`
  - [ ] Deploy: `netlify deploy --prod`
  - [ ] Choose publish directory: `dist`

- [ ] **Add Environment Variables**
  - [ ] Go to Netlify dashboard
  - [ ] Site Settings → Environment variables
  - [ ] Add all VITE_ variables
  - [ ] Redeploy

- [ ] **Test Production Site**
  - [ ] Open deployed URL
  - [ ] Test login
  - [ ] Test adding/editing data
  - [ ] Verify GitHub updates work

### Option B: Local Only

- [ ] Keep `npm run dev` running
- [ ] Share http://localhost:5173 with teacher
- [ ] Ensure computer stays on when teacher uses it

## 👨‍🏫 Phase 5: Teacher Onboarding

- [ ] **Create User Guide**
  - [ ] Write simple instructions
  - [ ] Take screenshots
  - [ ] Record demo video (optional)

- [ ] **Share Access**
  - [ ] Send URL: `https://your-site.netlify.app`
  - [ ] Send password (securely!)
  - [ ] Send instructions

- [ ] **First Training Session**
  - [ ] Show how to login
  - [ ] Demo adding publication
  - [ ] Demo editing content
  - [ ] Demo deleting content
  - [ ] Show how to check live website
  - [ ] Answer questions

- [ ] **Practice Session**
  - [ ] Teacher adds real publication
  - [ ] Teacher edits existing content
  - [ ] Verify changes appear on website
  - [ ] Teacher comfortable with process

## 🔒 Phase 6: Security Review

- [ ] **Check Security**
  - [ ] `.env` file not committed to Git
  - [ ] GitHub token not exposed anywhere
  - [ ] Strong password set
  - [ ] Only necessary people have access

- [ ] **Backup Plan**
  - [ ] Keep `.env` backup somewhere safe
  - [ ] Document GitHub token location
  - [ ] Have rollback plan if needed

## 📚 Phase 7: Documentation

- [ ] **Keep These Files Updated**
  - [ ] README.md - Full documentation
  - [ ] SETUP.md - Quick setup guide
  - [ ] DEPLOYMENT.md - Deployment instructions
  - [ ] This checklist

- [ ] **Document Customizations**
  - [ ] Any changes you made
  - [ ] Special configurations
  - [ ] Known issues and workarounds

## 🎉 Phase 8: You're Done!

- [ ] **Verify Everything Works**
  - [ ] Teacher can login
  - [ ] Teacher can add content
  - [ ] Changes appear on website
  - [ ] No errors in console

- [ ] **Celebrate!**
  - [ ] You've built a user-friendly CMS
  - [ ] No coding needed for updates anymore
  - [ ] Portfolio is easy to maintain

## 📞 Support Checklist

When teacher has issues, check:

- [ ] Password correct?
- [ ] Website deployed and accessible?
- [ ] GitHub token still valid?
- [ ] Environment variables set?
- [ ] Netlify deployment successful?
- [ ] Check browser console for errors

## 🔄 Maintenance Schedule

### Weekly:
- [ ] Check if teacher had any issues
- [ ] Verify website deployments working

### Monthly:
- [ ] Review GitHub API usage
- [ ] Check Netlify bandwidth
- [ ] Update dependencies if needed

### When Issues Occur:
- [ ] Check deployment logs
- [ ] Verify environment variables
- [ ] Test locally first
- [ ] Check GitHub token permissions

---

## 📊 Progress Tracker

**Overall Status:**
- [ ] Phase 1: Initial Setup ⏳
- [ ] Phase 2: Testing ⏳
- [ ] Phase 3: Expand Editors ⏳
- [ ] Phase 4: Deployment ⏳
- [ ] Phase 5: Teacher Onboarding ⏳
- [ ] Phase 6: Security Review ⏳
- [ ] Phase 7: Documentation ⏳
- [ ] Phase 8: Complete! 🎉

---

**Start Date:** _______________
**Completion Date:** _______________
**Deployed URL:** _______________
**Teacher Trained:** _______________

---

**Questions? Check:**
1. README.md for detailed info
2. SETUP.md for quick setup
3. DEPLOYMENT.md for deployment help
4. IMPLEMENTATION.md for technical details
