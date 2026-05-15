# PLAN-002: React Frontend UI — Step 1: Project Setup & Dependencies

**Status:** 📋 Ready for Review  
**Created:** 2026-05-15  
**Priority:** High (Blocks UI Development)

---

## Objective (Step 1 Only)

Set up a modern React + TypeScript + Vite project with all necessary UI/state management dependencies installed and configured. After this step, we'll have a runnable development environment ready for building components.

---

## What We're Doing

### Current State
- ❌ Frontend folder only has `Dockerfile` and `package.json` (basic React 18)
- ❌ No TypeScript
- ❌ No routing
- ❌ No state management (Redux)
- ❌ No UI library
- ❌ No form handling
- ❌ No API client setup

### After Step 1
- ✅ React 18 + TypeScript + Vite configured
- ✅ Redux Toolkit for state management installed
- ✅ Material-UI (MUI) for professional UI components installed
- ✅ Axios for API calls configured
- ✅ React Router for navigation installed
- ✅ Development environment runs with `npm run dev`
- ✅ Hot reload working during development

---

## Tasks (Step 1)

### Task 1.1: Replace package.json with Production Dependencies
Replace the basic React package.json with our full tech stack.

**File:** `frontend/package.json`

**New Content:**
```json
{
  "name": "resume-analyzer-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "axios": "^1.6.2",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.3",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "react-dropzone": "^14.2.3",
    "react-icons": "^4.12.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.2.0",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

**Why?**
- Switching from Create React App to **Vite** (5-10x faster)
- Adding **Redux** for state management
- Adding **Material-UI** for professional components
- Adding **React Router** for navigation
- Adding **Axios** for API calls
- Adding **React Hook Form** for forms
- Adding **TypeScript** for type safety

---

### Task 1.2: Create TypeScript Configuration
Create `tsconfig.json` for TypeScript compilation settings.

**File:** `frontend/tsconfig.json`

**New Content:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForEnumMembers": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.app.json" }]
}
```

---

### Task 1.3: Create Vite Configuration
Create `vite.config.ts` to configure the build tool with React plugin.

**File:** `frontend/vite.config.ts`

**New Content:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

**Why?**
- Configures Vite to run on port 3000 (default React port)
- Proxies `/api` calls to backend (localhost:8000) — avoids CORS issues in dev
- Loads React plugin for JSX/TSX support

---

### Task 1.4: Create .env.example
Create environment variables template for the frontend.

**File:** `frontend/.env.example`

**New Content:**
```
# Frontend Environment Variables

# Backend API URL (development)
VITE_API_BASE_URL=http://localhost:8000

# App Mode
VITE_APP_ENV=development

# Feature Flags (future)
VITE_ENABLE_HISTORY=false
VITE_ENABLE_AUTH=false
```

**Why?**
- Template for future contributors
- Documents what env vars exist
- `.env` file will be in `.gitignore` (not committed)

---

### Task 1.5: Add Frontend to .gitignore
Update root `.gitignore` to exclude frontend build artifacts.

**File:** `.gitignore` (add to existing)

**Add Lines:**
```
# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env
frontend/.env.local
frontend/.env.*.local
frontend/build/
frontend/coverage/
frontend/.vite/
```

---

## Deliverables (After Step 1)

```
frontend/
├── package.json              # ✅ Updated with all deps
├── package-lock.json         # (Auto-generated on npm install)
├── tsconfig.json             # ✅ New TypeScript config
├── vite.config.ts            # ✅ New Vite config
├── .env.example              # ✅ New env template
├── Dockerfile                # (Keep existing)
└── src/                      # (Existing React files)
```

**Status After Completion:** Ready to install dependencies and start building components 🚀

---

## Execution Plan

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Delete old package-lock.json (if exists) to start fresh
rm package-lock.json

# 3. Install all dependencies
npm install

# 4. Test that dev server starts
npm run dev

# Expected output:
# VITE v5.0.0  ready in 250 ms
# ➜  Local:   http://127.0.0.1:3000/
# ➜  press h to show help
```

---

## Questions for You (Review)

Before I implement, please confirm:

1. ✅ **UI Library Choice**: Should we use **Material-UI (MUI)** or **Tailwind CSS + shadcn/ui**?
   - MUI: Professional, component-heavy, easier setup
   - Tailwind: Lighter, more customizable, popular for fast dev
   
2. ✅ **Accept all dependency versions** as listed above?

3. ✅ **Should I implement Step 1 now** after your approval?

---

## 📊 Effort Estimate

**Time to Complete Step 1:** 15-20 minutes (mostly automated)
- Update files: 5 min
- npm install: 10-15 min (depends on internet)
- Verify setup works: 5 min

---

## ✅ Success Criteria

After Step 1, you should be able to:
- [ ] Run `npm install` without errors
- [ ] Run `npm run dev` and see Vite dev server start
- [ ] Access http://localhost:3000 in browser
- [ ] See a working React app (even if blank)
- [ ] No console errors or warnings

---

## Next Step (Step 2 - Preview)

Once Step 1 is approved and implemented, Step 2 will be:
- Create folder structure (`components/`, `pages/`, `services/`, `store/`, `types/`, `utils/`)
- Build Redux store with `analysisSlice` and `uiSlice`
- Set up Axios API client with interceptors

---

## Notes

- We're using **Vite** instead of Create React App for speed (5-10x faster builds)
- **TypeScript strict mode** enabled for type safety
- All dependencies are pinned to specific versions (reproducible installs)
- Proxy config ensures `/api` calls hit backend without CORS issues in development

