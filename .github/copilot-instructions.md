# Admin Panel - AI Development Guide

## Project Purpose
This is a **standalone admin dashboard** that allows non-technical users to manage a portfolio website's content (publications, awards, presentations, etc.) via GitHub API. It **never modifies the portfolio codebase directly**—only updates TypeScript data files in the `data/` directory of the repository.

## Critical Architecture Patterns

### Two-App Ecosystem
- **Portfolio Site**: Reads from `data/*.ts` files (imports them as modules)
- **Admin Panel**: Writes to `data/*.ts` files via GitHub API (this app)
- Both apps live in the same repo but are completely separate
- Changes trigger Netlify auto-deploy (1-2 min rebuild)

### TypeScript Data File Workflow
Data files follow a specific format: `export const publications: Publication[] = [...]`

**The Challenge**: We must preserve imports, comments, and formatting when updating arrays.

**Implementation** (see [github.ts](src/services/github.ts#L190-L248)):
1. `parseDataFile()`: Strips imports/comments → extracts array → parses as JSON
2. `updateData()`: Finds export statement → replaces only the array → preserves file structure
3. Always pass `originalContent` to maintain file integrity

**Critical**: Asset references like `imageUrl: myImage` are converted to strings during parsing to avoid evaluation errors.

## Development Workflow

### Commands
```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # TypeScript check + Vite build
npm run preview      # Preview production build
npm run lint         # ESLint check
```

### Environment Setup
**Required** `.env` variables (never commit this file):
```env
VITE_GITHUB_TOKEN=ghp_...        # Personal access token with repo scope
VITE_GITHUB_OWNER=username       # GitHub username
VITE_GITHUB_REPO=TAYLORS         # Repository name
VITE_GITHUB_BRANCH=main          # Branch to modify
VITE_ADMIN_PASSWORD=secret       # Login password
```

Access via `import.meta.env.VITE_*` (Vite convention).

## Code Patterns & Conventions

### Editor Page Pattern
All editor pages ([PublicationsEditor.tsx](src/pages/PublicationsEditor.tsx), etc.) follow this structure:

```typescript
// 1. Load data on mount
useEffect(() => { loadPublications(); }, []);

// 2. Fetch from GitHub
const result = await githubService.getData<Publication>('publications');
setPublications(result.data);
setSha(result.sha);                    // Track file version for updates
setOriginalContent(result.originalContent); // Preserve file structure

// 3. Save updates
await githubService.updateData(
  'publications',           // filename (becomes data/publications.ts)
  updatedArray,            // modified data
  'Publication',           // TypeScript type name
  'publications',          // variable name in file
  'Commit message',
  sha,                     // current file version
  originalContent         // original file content to preserve structure
);
```

### State Management
- **No Redux/Zustand**: Simple `useState` for local component state
- **Auth**: `localStorage.getItem('adminAuth')` (boolean stored as string)
- **Routing**: React Router with protected routes (redirect if not authenticated)

### Component Structure
- `EditorLayout`: Shared wrapper with back button, title, logout
- `LoadingSpinner`, `ErrorMessage`, `SuccessMessage`: Reusable feedback components
- Forms use inline state with validation before save

### Styling
- **Tailwind CSS**: Utility-first (e.g., `bg-white shadow-sm rounded-lg p-6`)
- **Icons**: `lucide-react` (e.g., `<Plus />`, `<Edit2 />`)
- **Responsive**: Mobile-first breakpoints (`sm:`, `lg:`)

### TypeScript
- Strict mode enabled ([tsconfig.json](tsconfig.json))
- Types in [src/types/index.ts](src/types/index.ts) match portfolio data structures exactly
- Path alias `@/` maps to `src/` ([vite.config.ts](vite.config.ts#L7-L9))

## GitHub Service API

The [github.ts](src/services/github.ts) service is the only interface to GitHub:

```typescript
// Core methods
await githubService.getFile(path)              // Read raw file
await githubService.updateFile(path, content, message, sha) // Write file
await githubService.uploadImage(path, base64, message) // Upload image

// High-level data operations (preferred)
await githubService.getData<T>(fileName)       // Read + parse TypeScript file
await githubService.updateData(...)            // Update + preserve structure
```

**Octokit**: Uses `@octokit/rest` under the hood. All content is base64 encoded/decoded with UTF-8 handling.

## Extending the System

### Adding a New Editor Section
1. Copy [PublicationsEditor.tsx](src/pages/PublicationsEditor.tsx)
2. Update type references (e.g., `Publication` → `Award`)
3. Adjust form fields to match data structure
4. Update `updateData()` call with correct filename/type
5. Add route in [App.tsx](src/App.tsx)
6. Add card in [Dashboard.tsx](src/pages/Dashboard.tsx)

### Adding New Fields to Existing Types
1. Update type in [types/index.ts](src/types/index.ts)
2. Add form input in editor page
3. Update validation logic
4. **No changes needed** to `githubService`—it's schema-agnostic

## Common Gotchas

1. **Stale SHA errors**: `updateData()` auto-retries once if file was modified by another process
2. **Parsing failures**: `parseDataFile()` logs content preview—check for malformed TypeScript
3. **Asset imports**: Don't try to evaluate imported assets (images/PDFs); they're stringified during parsing
4. **Trailing commas**: Removed during normalization to ensure valid JSON
5. **Authentication**: Password is client-side only (for simplicity); use proper auth for production

## Deployment

- **Platform**: Netlify
- **Build**: `npm run build` → outputs to `dist/`
- **Redirects**: SPA routing handled by [netlify.toml](netlify.toml#L6-L8) (`/*` → `/index.html`)
- **Environment**: Set `VITE_*` variables in Netlify dashboard (not in code)

## Key Files Reference

- [github.ts](src/services/github.ts): GitHub API integration + TS ↔ JSON conversion
- [PublicationsEditor.tsx](src/pages/PublicationsEditor.tsx): Full CRUD example
- [App.tsx](src/App.tsx): Auth guard + routing
- [types/index.ts](src/types/index.ts): Central type definitions
- [ARCHITECTURE.md](ARCHITECTURE.md): Visual diagrams of data flow
