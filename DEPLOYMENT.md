# 🌐 Deployment Guide

## Option 1: Netlify (Recommended) ⭐

### Step 1: Prepare for Deployment

```powershell
cd admin-panel
npm run build
```

This creates a `dist/` folder with production-ready files.

### Step 2: Deploy to Netlify

#### Method A: Netlify CLI (Fast)

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod

# Follow prompts:
# - Choose "Create & configure a new site"
# - Pick a site name (e.g., dr-noor-admin)
# - Publish directory: dist
```

#### Method B: Netlify Dashboard (Easier)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `dist/` folder
4. Done!

### Step 3: Add Environment Variables

1. Go to your site in Netlify dashboard
2. Click "Site settings" → "Environment variables"
3. Add these variables:
   ```
   VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxx
   VITE_GITHUB_OWNER=your-username
   VITE_GITHUB_REPO=TAYLORS
   VITE_GITHUB_BRANCH=main
   VITE_ADMIN_PASSWORD=your-password
   ```
4. Click "Save"
5. Redeploy the site

### Step 4: Redeploy

```powershell
netlify deploy --prod
```

Your admin panel is now live at: `https://your-site-name.netlify.app`

---

## Option 2: Vercel 🚀

### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

### Step 2: Deploy

```powershell
cd admin-panel
vercel
```

Follow the prompts:
- Setup and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- What's your project name? **dr-noor-admin**
- In which directory is your code? **.**
- Override settings? **N**

### Step 3: Add Environment Variables

```powershell
vercel env add VITE_GITHUB_TOKEN
# Paste your token when prompted

vercel env add VITE_GITHUB_OWNER
# Enter your GitHub username

vercel env add VITE_GITHUB_REPO
# Enter: TAYLORS

vercel env add VITE_GITHUB_BRANCH
# Enter: main

vercel env add VITE_ADMIN_PASSWORD
# Enter your password
```

### Step 4: Production Deploy

```powershell
vercel --prod
```

Your admin panel is now live at: `https://your-project.vercel.app`

---

## Option 3: GitHub Pages (Free)

### Step 1: Configure for GitHub Pages

Update `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/admin-panel/', // Add this line
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Step 2: Build and Deploy

```powershell
npm run build

# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

npm run deploy
```

### Step 3: Enable GitHub Pages

1. Go to repository settings
2. Pages → Source → Select `gh-pages` branch
3. Save

Your site will be at: `https://username.github.io/admin-panel/`

**⚠️ Security Warning:** GitHub Pages is public. Don't use for production with sensitive tokens!

---

## Option 4: Run Locally (Simplest)

If you don't want to deploy online:

```powershell
# Run on your computer
npm run dev

# Share with teacher:
# 1. Keep this terminal open
# 2. Teacher accesses: http://localhost:5173
```

**Pros:** No deployment needed, fully secure
**Cons:** Must keep computer running, teacher needs network access

---

## 🔒 Security Best Practices

### For Production Deployment:

1. **Use Environment Variables**
   - Never hardcode GitHub token
   - Store in Netlify/Vercel settings
   - Don't commit `.env` file

2. **Add Authentication**
   - Current password is basic
   - Consider GitHub OAuth
   - Add rate limiting

3. **HTTPS Only**
   - Netlify/Vercel provide free SSL
   - Never use HTTP in production

4. **Restrict Access**
   - Share URL only with trusted users
   - Use strong passwords
   - Consider IP whitelisting

### Advanced: GitHub OAuth (Optional)

For better security, replace password auth with GitHub OAuth:

```typescript
// Add to your deployment
VITE_GITHUB_OAUTH_CLIENT_ID=your_client_id
VITE_GITHUB_OAUTH_CLIENT_SECRET=your_client_secret

// Then only authorized GitHub users can access
```

---

## 📱 Sharing with Your Teacher

Once deployed, share:

### Information Package:

```
Admin Panel URL: https://your-site.netlify.app
Password: [the password you set]

Instructions:
1. Open the URL in any browser
2. Enter the password
3. Click on any section to edit
4. Fill the form and click Save
5. Wait 2 minutes for website to update

Support: [your contact]
```

### Quick Demo Video (Optional)

Record a 2-minute video showing:
1. How to login
2. How to add a publication
3. How to edit existing content
4. Where to see changes

---

## 🔄 Updating the Admin Panel

When you make changes:

```powershell
# Pull latest changes
git pull

# Install any new dependencies
npm install

# Build
npm run build

# Redeploy
netlify deploy --prod
# or
vercel --prod
```

---

## 📊 Monitoring

### Netlify:
- View deploy logs in dashboard
- Set up email notifications
- Monitor bandwidth usage

### Vercel:
- Check deployments in dashboard
- View function logs
- Monitor performance

---

## 💰 Cost

### Free Tier Limits:

**Netlify:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
✅ **More than enough for admin panel**

**Vercel:**
- 100 GB bandwidth/month
- Unlimited deployments
- Commercial use allowed
✅ **Perfect for this use case**

**GitHub Pages:**
- 1 GB storage
- 100 GB bandwidth/month
- Public repositories only
⚠️ **Not recommended for admin panel**

---

## 🆘 Troubleshooting

### Build Fails
```powershell
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working
- Check variable names match exactly
- Include `VITE_` prefix
- Redeploy after adding variables
- Restart dev server locally

### 404 on Deployment
- Check `base` in vite.config.ts
- Verify build output in `dist/`
- Check deployment logs

---

## ✅ Recommended Setup

For Dr. Noor Zaman's portfolio:

1. ✅ **Deploy to Netlify** (easiest + reliable)
2. ✅ **Add environment variables** in Netlify dashboard
3. ✅ **Enable password protection** (already implemented)
4. ✅ **Share URL + password** with teacher
5. ✅ **Keep local backup** for development

**Estimated setup time:** 10 minutes
**Cost:** $0/month
**Maintenance:** None (auto-updates via GitHub)

---

**Ready to deploy? Start with Netlify - it's the easiest!** 🚀
