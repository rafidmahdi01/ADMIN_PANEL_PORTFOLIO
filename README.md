# Dr. Noor Zaman - Admin Panel

Admin dashboard for managing Dr. Noor Zaman's portfolio website content via GitHub API.

🔗 **Live Site**: https://adminpanelnoor.netlify.app

## 🎯 Features

- ✅ **No changes to portfolio code** - Completely separate application
- ✅ **Direct GitHub integration** - Updates files in your repository
- ✅ **User-friendly forms** - Easy data entry for non-technical users
- ✅ **Automatic deployment** - Changes trigger Netlify rebuild
- ✅ **Secure authentication** - Password-protected access
- ✅ **Type-safe** - TypeScript throughout

## 📋 Prerequisites

1. **GitHub Personal Access Token** with repo permissions
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Create token with `repo` scope
   
2. **Repository details**
   - Your GitHub username
   - Repository name
   - Branch name (usually `main`)

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```powershell
cd admin-panel
npm install
```

### Step 2: Configure Environment

1. Copy the example environment file:
```powershell
cp .env.example .env
```

2. Edit `.env` and fill in your details:
```env
VITE_GITHUB_TOKEN=ghp_your_github_token_here
VITE_GITHUB_OWNER=your-github-username
VITE_GITHUB_REPO=TAYLORS
VITE_GITHUB_BRANCH=main
VITE_ADMIN_PASSWORD=your_secure_password
```

⚠️ **Security Note**: Never commit `.env` file to Git. It contains sensitive tokens!

### Step 3: Run Development Server

```powershell
npm run dev
```

The admin panel will open at `http://localhost:5173`

### Step 4: Login

Use the password you set in `VITE_ADMIN_PASSWORD` to login.

## 📖 How to Use

### For Your Teacher:

1. **Login** - Open the admin panel URL and enter password
2. **Select Section** - Click on Publications, Awards, etc.
3. **Add/Edit/Delete** - Use the forms to manage content
4. **Automatic Save** - Changes go directly to GitHub
5. **Wait for Deploy** - Website rebuilds automatically (1-2 minutes)

### Managing Publications

1. Click "Publications" on dashboard
2. Click "+ Add New Publication"
3. Fill in the form:
   - Title (required)
   - Authors (required)
   - Journal/Conference (required)
   - Year (required)
   - Type (journal/conference/book-chapter)
   - DOI (optional)
4. Click "Save"
5. Done! The website will update automatically

## 🏗️ Project Structure

```
admin-panel/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Main pages (Dashboard, Editors)
│   ├── services/        # GitHub API integration
│   └── types/           # TypeScript type definitions
├── .env                 # Environment variables (DO NOT COMMIT)
├── package.json
└── vite.config.ts
```

## 🔧 Customization

### Adding More Editor Pages

To add editors for other sections (Awards, Presentations, etc.):

1. Copy `PublicationsEditor.tsx` as a template
2. Update the type definitions in `types/index.ts`
3. Modify the form fields to match your data structure
4. Update the GitHub service call to use correct file name

### Changing Authentication

The current setup uses simple password authentication. For production, consider:
- GitHub OAuth integration
- JWT tokens
- Multi-user support with roles

## 🚀 Deployment

### Deploy to Netlify

1. Push admin-panel to GitHub (separate branch or repo)
2. Connect to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy!

### Important Security Notes

- Never expose your GitHub token in client code (production)
- Use environment variables
- Consider adding rate limiting
- Use proper authentication for production

## 📝 How It Works

```
Teacher → Admin Panel → GitHub API → Portfolio Repo → Netlify → Live Website
   |                        |                |
   └─ Fill Forms           └─ Update Files  └─ Auto Deploy
```

1. Teacher fills form in admin panel
2. Admin panel converts form data to TypeScript format
3. GitHub API updates the file in repository
4. GitHub webhook triggers Netlify rebuild
5. Website goes live with new content (1-2 minutes)

## 🐛 Troubleshooting

### "Failed to load publications"
- Check GitHub token permissions
- Verify repository name and owner
- Ensure files exist in `data/` folder

### "Failed to save"
- Check GitHub token has write permissions
- Verify branch name is correct
- Check console for detailed errors

### Changes not appearing
- Wait 1-2 minutes for Netlify rebuild
- Check Netlify deploy logs
- Verify commit was made to correct branch

## 📚 Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Octokit** - GitHub API client
- **React Router** - Navigation

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review GitHub API logs in browser console
3. Verify all environment variables are set correctly

---

**Made with ❤️ for Dr. Noor Zaman**
