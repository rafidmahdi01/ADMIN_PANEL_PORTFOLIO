# 🔧 Troubleshooting Guide

Common issues and how to fix them.

## Setup Issues

### ❌ "npm: command not found"

**Problem:** Node.js/npm not installed

**Solution:**
1. Download Node.js: https://nodejs.org
2. Install LTS version
3. Restart terminal
4. Try again: `npm --version`

---

### ❌ "Cannot find module '@vitejs/plugin-react'"

**Problem:** Dependencies not installed

**Solution:**
```powershell
cd admin-panel
rm -rf node_modules
npm install
```

---

### ❌ "Port 5173 is already in use"

**Problem:** Another app using the port

**Solution:**

**Option 1:** Kill the process
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Option 2:** Use different port
```powershell
# Edit package.json
"scripts": {
  "dev": "vite --port 3000"
}
```

---

## Authentication Issues

### ❌ "Invalid password"

**Problem:** Password mismatch

**Solution:**
1. Open `.env` file
2. Check `VITE_ADMIN_PASSWORD` value
3. Use EXACTLY that password
4. Case-sensitive!

---

### ❌ Login page shows but can't login

**Problem:** Environment variables not loaded

**Solution:**
```powershell
# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

**Note:** Vite loads `.env` on startup only

---

### ❌ Logged in but kicked out immediately

**Problem:** localStorage issue

**Solution:**
```javascript
// Open browser console (F12)
localStorage.clear()
// Refresh page and login again
```

---

## GitHub Integration Issues

### ❌ "Failed to load publications" or "GitHub token not configured"

**Problem:** GitHub token missing or invalid

**Solution:**

**Step 1:** Check `.env` file exists
```powershell
ls .env
# If not found:
copy .env.example .env
```

**Step 2:** Verify token format
```env
# Should look like this:
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
# NOT like this:
VITE_GITHUB_TOKEN="ghp_xxxx"  ❌ (no quotes!)
VITE_GITHUB_TOKEN=ghp_xxxx"   ❌ (no trailing quote)
```

**Step 3:** Test token
```powershell
# In browser console:
console.log(import.meta.env.VITE_GITHUB_TOKEN)
# Should show: ghp_xxxx
# If shows "undefined", restart dev server
```

**Step 4:** Regenerate token if needed
1. Go to: https://github.com/settings/tokens
2. Delete old token
3. Generate new with `repo` permissions
4. Update `.env`
5. Restart server

---

### ❌ "404: Not Found" from GitHub API

**Problem:** Repository name or path incorrect

**Solution:**

Check `.env` values:
```env
VITE_GITHUB_OWNER=YourGitHubUsername   # ← Check this
VITE_GITHUB_REPO=TAYLORS               # ← And this
VITE_GITHUB_BRANCH=main                # ← And this
```

**Verify on GitHub:**
1. Go to: https://github.com/YourUsername/TAYLORS
2. Check file exists: `/data/publications.ts`
3. Check branch name (main or master?)

---

### ❌ "403: Forbidden" from GitHub API

**Problem:** Token doesn't have correct permissions

**Solution:**

**Option 1:** Check token permissions
1. Go to: https://github.com/settings/tokens
2. Click your token
3. Verify `repo` checkbox is selected
4. If not, regenerate token

**Option 2:** Token expired
1. GitHub tokens can expire
2. Generate new token
3. Update `.env`
4. Restart server

---

### ❌ "Failed to save publication"

**Problem:** Missing `sha` or write permissions

**Possible causes:**

**Cause 1:** File was modified elsewhere
```powershell
# Solution: Reload the page
# This fetches latest sha
```

**Cause 2:** Token doesn't have write access
```powershell
# Solution: Regenerate token with correct permissions
# Go to: https://github.com/settings/tokens
# Ensure 'repo' scope is checked
```

---

## Build Issues

### ❌ "error during build: Cannot find module"

**Problem:** Missing TypeScript paths

**Solution:**
```powershell
# Check tsconfig.json has:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# Then:
npm run build
```

---

### ❌ Build succeeds but site is blank

**Problem:** Base URL mismatch

**Solution:**

For Netlify/Vercel:
```typescript
// vite.config.ts
export default defineConfig({
  base: '/',  // ← Should be '/'
  // ...
})
```

For GitHub Pages:
```typescript
export default defineConfig({
  base: '/admin-panel/',  // ← Should match repo path
  // ...
})
```

---

## Runtime Issues

### ❌ Data shows in wrong format

**Problem:** TypeScript parsing issue

**Solution:**

Check your data file format:
```typescript
// data/publications.ts should look like:
export const publications: Publication[] = [
  {
    title: "Example",
    // ...
  }
];

// NOT like:
export default publications  ❌
const publications = [...]   ❌
```

---

### ❌ "Cannot read property 'map' of undefined"

**Problem:** Data not loaded yet

**Solution:**

Add loading check:
```typescript
{loading ? (
  <LoadingSpinner />
) : publications.length === 0 ? (
  <p>No publications</p>
) : (
  publications.map(...)
)}
```

Already implemented in PublicationsEditor!

---

### ❌ Form doesn't validate

**Problem:** Required fields missing

**Solution:**

Check form validation:
```typescript
if (!editForm.title || !editForm.authors) {
  setError('Please fill in all required fields');
  return;
}
```

---

### ❌ Image upload fails

**Problem:** File size or format

**Solution:**

Check file:
- Max size: 50MB (GitHub limit)
- Formats: jpg, png, gif, webp
- Optimize before upload

Use utility:
```typescript
import { optimizeImage } from '@/lib/utils';
const optimized = await optimizeImage(file);
```

---

## Deployment Issues (Netlify)

### ❌ Build fails on Netlify

**Problem:** Environment variables missing

**Solution:**

1. Go to Netlify dashboard
2. Site settings → Environment variables
3. Add ALL variables from `.env`:
   ```
   VITE_GITHUB_TOKEN
   VITE_GITHUB_OWNER
   VITE_GITHUB_REPO
   VITE_GITHUB_BRANCH
   VITE_ADMIN_PASSWORD
   ```
4. Trigger redeploy

---

### ❌ Site deployed but shows errors

**Problem:** Wrong build settings

**Solution:**

Netlify settings should be:
```
Build command: npm run build
Publish directory: dist
Node version: 18
```

Update in `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

---

### ❌ Environment variables don't work on Netlify

**Problem:** Variables not prefixed correctly

**Solution:**

ALL environment variables for Vite MUST start with `VITE_`:
```env
✅ VITE_GITHUB_TOKEN=xxx
❌ GITHUB_TOKEN=xxx
```

---

## Deployment Issues (Vercel)

### ❌ Build succeeds but functions fail

**Problem:** API routes not configured

**Solution:**

Admin panel doesn't use API routes. If you added them:
```javascript
// Delete vercel.json or configure properly
```

---

## Data Issues

### ❌ Changes don't appear on website

**Problem:** Website not rebuilt

**Possible causes:**

**Cause 1:** Netlify webhook not configured
```
Solution: Check Netlify is connected to your GitHub repo
```

**Cause 2:** Commit not pushed
```powershell
# Check GitHub commits
# Go to: https://github.com/YourUsername/TAYLORS/commits
# Latest commit should be from admin panel
```

**Cause 3:** Build failed
```
Solution: Check Netlify deploy logs
Go to: Netlify Dashboard → Deploys
```

**Cause 4:** Cache issue
```
Solution: Hard refresh browser (Ctrl+Shift+R)
```

---

### ❌ Data corrupted after edit

**Problem:** JSON/TypeScript conversion error

**Solution:**

**Option 1:** Revert via GitHub
1. Go to GitHub repository
2. Navigate to file
3. Click "History"
4. Find last good version
5. Click "..." → Revert this commit

**Option 2:** Fix manually
1. Go to GitHub
2. Edit file directly
3. Fix syntax
4. Commit

**Prevention:** Always test with non-critical data first!

---

## Browser Issues

### ❌ Admin panel looks broken (no styles)

**Problem:** CSS not loading

**Solution:**

Check import in `main.tsx`:
```typescript
import './index.css'  // ← Should be here
```

Then:
```powershell
npm run dev
```

---

### ❌ "CORS error" in console

**Problem:** GitHub API blocking request

**Solution:**

This shouldn't happen with Octokit. If it does:
1. Check token is valid
2. Verify you're using HTTPS (in production)
3. Check browser isn't blocking third-party requests

---

### ❌ Login works locally but not on deployed site

**Problem:** Environment variables

**Solution:**

For Netlify/Vercel:
1. Add environment variables in dashboard
2. Redeploy
3. Clear browser cache
4. Try again

---

## Performance Issues

### ❌ Admin panel is slow

**Possible causes:**

**Cause 1:** Large data files
```
Solution: Consider pagination if >100 items
```

**Cause 2:** GitHub API rate limit
```
Solution: Wait an hour (60 requests/hour for auth'd users)
Or use GitHub OAuth (5000 requests/hour)
```

**Cause 3:** Large images
```
Solution: Optimize images before upload
Use: optimizeImage() utility
```

---

## Network Issues

### ❌ "Network error" or "Failed to fetch"

**Problem:** Internet connection or GitHub down

**Solution:**

**Step 1:** Check internet
```powershell
ping github.com
```

**Step 2:** Check GitHub status
- Visit: https://www.githubstatus.com

**Step 3:** Check firewall
- Ensure GitHub API isn't blocked
- Try on different network

---

## TypeScript Issues

### ❌ Type errors in editor

**Problem:** Types don't match

**Solution:**

**Option 1:** Update types
```typescript
// src/types/index.ts
export interface Publication {
  // Add missing fields here
}
```

**Option 2:** Skip type checking (temporary)
```typescript
// @ts-ignore
const data = ...
```

**Option 3:** Use 'any' (not recommended)
```typescript
const data: any = ...
```

---

## Getting Help

### Diagnostic Checklist

Before asking for help, check:

- [ ] `.env` file exists and is configured
- [ ] GitHub token is valid and has `repo` permission
- [ ] Repository name and branch are correct
- [ ] Node.js version 16+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] No errors in browser console (F12)
- [ ] No errors in terminal
- [ ] Tried restarting dev server
- [ ] Tried clearing browser cache

### Collect Debug Info

```powershell
# In browser console (F12):
console.log('Environment:', {
  token: import.meta.env.VITE_GITHUB_TOKEN?.slice(0,10) + '...',
  owner: import.meta.env.VITE_GITHUB_OWNER,
  repo: import.meta.env.VITE_GITHUB_REPO,
  branch: import.meta.env.VITE_GITHUB_BRANCH
})

# Check versions:
node --version
npm --version
```

Share this info when asking for help!

---

## Quick Fixes

### "Try these first" checklist:

- [ ] Restart dev server (Ctrl+C, then `npm run dev`)
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Check `.env` file for typos
- [ ] Reinstall dependencies (`rm -rf node_modules && npm install`)
- [ ] Check GitHub token hasn't expired
- [ ] Verify repository name is correct
- [ ] Check internet connection
- [ ] Try in incognito/private window
- [ ] Check browser console for errors (F12)

---

## Still Stuck?

1. **Check Documentation:**
   - README.md - Complete guide
   - SETUP.md - Setup instructions
   - ARCHITECTURE.md - How it works

2. **Check Console:**
   - Browser console (F12)
   - Terminal output
   - Netlify deploy logs

3. **Verify Configuration:**
   - `.env` file correct
   - GitHub token valid
   - Repository accessible

4. **Test Manually:**
   - Can you access your GitHub repo?
   - Can you see data files?
   - Can you make commits?

---

## Emergency Recovery

### If everything is broken:

```powershell
# Nuclear option - start fresh
cd ..
rm -rf admin-panel
# Re-clone or re-download
# Start from SETUP.md step 1
```

Your portfolio is safe - it's completely separate! ✅

---

**Remember:** The admin panel is separate from your portfolio. If worst comes to worst, you can delete it and your portfolio continues working fine!
