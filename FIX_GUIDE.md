# Component Compass - Installation & Setup Fix Guide

## Issue: npm ETARGET Error
**Error:** `npm error notarget No matching version found for @radix-ui/react-dropdown-menu@^2.2.15`

### Root Cause
The specified version of `@radix-ui/react-dropdown-menu` (2.2.15) doesn't exist on npm registry. The latest stable version is 2.1.x.

---

## SOLUTION 1: Quick Fix (Recommended)

### Step 1: Delete node_modules and lock files
```powershell
# In PowerShell on Windows
rm -r node_modules -Force
rm package-lock.json
```

### Step 2: Update package.json with compatible versions
Replace line 30 in `package.json`:
```json
"@radix-ui/react-dropdown-menu": "^2.1.2",
```

Other potentially problematic @radix-ui versions to update:
```json
"@radix-ui/react-context-menu": "^2.1.5",  // was 2.2.15
```

### Step 3: Clear npm cache
```powershell
npm cache clean --force
```

### Step 4: Install dependencies
```powershell
npm install
```

---

## SOLUTION 2: Use Compatible Version Ranges (Alternative)

If you want to keep things simple, use this updated `package.json` dependencies section:

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.1.5",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^1.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@tanstack/react-query": "^5.83.0",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "cors": "^2.8.5",
    "date-fns": "^3.6.0",
    "dotenv": "^16.4.5",
    "embla-carousel-react": "^8.6.0",
    "express": "^4.21.0",
    "input-otp": "^1.4.2",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.462.0",
    "mongodb": "^6.11.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "zod": "^3.25.76"
  }
}
```

---

## SOLUTION 3: Downgrade to Stable Versions

If issues persist, use more conservative versions:

```json
"@radix-ui/react-dropdown-menu": "^2.0.6",
"@radix-ui/react-context-menu": "^2.1.5",
```

Then run:
```powershell
npm install --legacy-peer-deps
```

---

## JSX to JS File Conversion (TypeScript Check)

### Check for TypeScript usage:

Your project uses **JSConfig** (not TypeScript), so you're already using `.jsx` files correctly:
- `jsconfig.json` ✓ (JavaScript config)
- Files: `App.jsx`, `main.jsx` ✓

**No conversion needed!** Your project is already set up for JavaScript with JSX syntax.

### If you need to convert JSX files to JS:

1. Rename files:
```powershell
# From PowerShell
Get-ChildItem -Recurse -Filter "*.jsx" | Rename-Item -NewName { $_.Name -replace '\.jsx$', '.js' }
```

2. Update imports in files:
```javascript
// Change: import Component from './Component.jsx'
// To:     import Component from './Component'
```

---

## Terminal/Environment Issues

### 1. Node.js Path Issues
```powershell
# Verify Node.js is installed
node --version
npm --version

# If not found, add to PATH:
$env:Path += ";C:\Program Files\nodejs"
```

### 2. Permission Issues on Windows
```powershell
# Run PowerShell as Administrator
# Right-click PowerShell → Run as Administrator
```

### 3. Clear npm Global Cache
```powershell
npm cache clean --force
npm ci  # Clean install (more reliable than npm install)
```

### 4. Global npm/Node Issues
```powershell
# Reinstall npm
npm install -g npm@latest

# Verify installation
npm list -g
```

---

## Complete Step-by-Step Solution

1. **Open PowerShell as Administrator**
   - Right-click PowerShell → "Run as Administrator"

2. **Navigate to project**
   ```powershell
   cd C:\Users\Dharshansriram\Downloads\component-compass-main\component-compass-main
   ```

3. **Clean previous installations**
   ```powershell
   rm -r node_modules -Force
   rm package-lock.json
   npm cache clean --force
   ```

4. **Edit package.json** - Update these lines:
   - Line 28: `"@radix-ui/react-context-menu": "^2.1.5",`
   - Line 30: `"@radix-ui/react-dropdown-menu": "^2.1.2",`

5. **Install fresh dependencies**
   ```powershell
   npm install
   ```

6. **Verify installation**
   ```powershell
   npm list | head -20
   ```

7. **Start development server**
   ```powershell
   npm run dev
   ```

---

## Troubleshooting Commands

```powershell
# Check npm configuration
npm config list

# Verify package installation
npm list @radix-ui/react-dropdown-menu

# Check for global issues
npm audit

# Force install with legacy support
npm install --legacy-peer-deps --force

# Use specific npm registry
npm install --registry https://registry.npmjs.org/

# Reinstall with clean slate
npm ci --legacy-peer-deps
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `ETARGET` error | Update package versions to available ones |
| Permission denied | Run PowerShell as Administrator |
| Node not found | Reinstall Node.js or add to PATH |
| Module not found | Delete node_modules, run `npm install` again |
| Port already in use | Change port in `vite.config.mjs` |
| React warnings | Update React and dependencies |

---

## Verification Checklist

- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] package.json updated with correct versions
- [ ] node_modules deleted and reinstalled
- [ ] npm install completes without errors
- [ ] `npm run dev` starts successfully
- [ ] Browser shows the app at `http://localhost:5173`

---

## Need More Help?

If you still encounter issues:
1. Check `npm-debug.log` for detailed error messages
2. Run `npm audit` to check for security issues
3. Try `npm install --legacy-peer-deps`
4. Reinstall Node.js fresh
5. Check internet connection and firewall settings
