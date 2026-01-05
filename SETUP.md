# 🚀 Quick Setup Guide

## Step-by-Step Setup (5 minutes)

### 1. Get GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `Portfolio Admin Panel`
4. Select scopes:
   - ✅ `repo` (all repo permissions)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

### 2. Configure Environment Variables

```powershell
# Navigate to admin panel folder
cd admin-panel

# Copy example environment file
copy .env.example .env

# Open .env in notepad
notepad .env
```

**Replace these values:**
```env
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx   # Your token from step 1
VITE_GITHUB_OWNER=your-github-username       # Your GitHub username
VITE_GITHUB_REPO=TAYLORS                     # Keep as is
VITE_GITHUB_BRANCH=main                      # Keep as is
VITE_ADMIN_PASSWORD=ChooseAStrongPassword    # Pick a password
```

Save and close.

### 3. Install and Run

```powershell
# Install dependencies
npm install

# Start development server
npm run dev
```

The admin panel will open at: http://localhost:5173

### 4. Login and Test

1. Open http://localhost:5173
2. Enter the password you set in `.env`
3. Click "Publications"
4. Try adding a test publication
5. Check your GitHub repo - you should see a new commit!

## ✅ You're Done!

Your teacher can now:
- Login to the admin panel
- Add/edit publications, awards, etc.
- Changes automatically update the website

## 📱 For Your Teacher

Share this info with your teacher:

**Admin Panel URL:** `http://localhost:5173` (or your deployed URL)
**Password:** [The password you set]

**How to use:**
1. Open the URL in any browser
2. Login with password
3. Click any section (Publications, Awards, etc.)
4. Click "+ Add New" to add content
5. Fill the form and click "Save"
6. Wait 1-2 minutes for website to update

That's it! No technical knowledge needed.

## 🌐 Deploy to Production (Optional)

To deploy the admin panel online:

### Option 1: Netlify (Recommended)

1. Create new site on Netlify
2. Connect to GitHub (admin-panel folder)
3. Add environment variables in Netlify dashboard
4. Deploy!

### Option 2: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables
4. Done!

Then share the deployed URL with your teacher instead of localhost.

## ⚠️ Important Security Notes

- **Never commit `.env` file** - It's in `.gitignore` for safety
- **Keep GitHub token secret** - Don't share in emails or Slack
- **Use strong password** - For admin panel login
- **HTTPS only in production** - Use Netlify/Vercel for secure deployment

## 🆘 Quick Troubleshooting

**Problem:** Can't login
- **Solution:** Check password in `.env` file

**Problem:** "Failed to load publications"
- **Solution:** Verify GitHub token has correct permissions

**Problem:** Changes not appearing
- **Solution:** Wait 2 minutes for Netlify rebuild

**Problem:** Port 5173 already in use
- **Solution:** Close other apps or change port in `vite.config.ts`

---

Need help? Check the full README.md for detailed documentation.
