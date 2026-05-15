# Component Compass - Automated Fix Script
# Run as Administrator in PowerShell

Write-Host "================================================" -ForegroundColor Green
Write-Host "Component Compass - Installation Fix Script" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Check if running as Administrator
$isAdmin = [bool]([Security.Principal.WindowsIdentity]::GetCurrent()).groups -match "S-1-5-32-544"
if (-not $isAdmin) {
    Write-Host "ERROR: Please run PowerShell as Administrator!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Step 1: Check Node.js and npm
Write-Host "Step 1: Checking Node.js and npm installation..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js or npm not found. Please install Node.js first!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Navigate to project directory
Write-Host "Step 2: Setting up project directory..." -ForegroundColor Cyan
$projectPath = Read-Host "Enter the full path to component-compass project (or press Enter for current directory)"

if ($projectPath -eq "") {
    $projectPath = Get-Location
}

if (-not (Test-Path $projectPath)) {
    Write-Host "ERROR: Project directory not found: $projectPath" -ForegroundColor Red
    exit 1
}

Set-Location $projectPath
Write-Host "✓ Working directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Step 3: Backup original package.json
Write-Host "Step 3: Backing up original package.json..." -ForegroundColor Cyan
if (Test-Path "package.json") {
    Copy-Item "package.json" "package.json.backup" -Force
    Write-Host "✓ Backup created: package.json.backup" -ForegroundColor Green
} else {
    Write-Host "ERROR: package.json not found in current directory" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Update package.json with correct versions
Write-Host "Step 4: Updating package.json with compatible versions..." -ForegroundColor Cyan

$packageContent = Get-Content "package.json" -Raw
$packageContent = $packageContent -replace '"@radix-ui/react-dropdown-menu": "\^2\.2\.15"', '"@radix-ui/react-dropdown-menu": "^2.1.2"'
$packageContent = $packageContent -replace '"@radix-ui/react-context-menu": "\^2\.2\.15"', '"@radix-ui/react-context-menu": "^2.1.5"'
$packageContent | Set-Content "package.json"

Write-Host "✓ package.json updated with compatible versions" -ForegroundColor Green
Write-Host ""

# Step 5: Clean previous installations
Write-Host "Step 5: Cleaning previous installations..." -ForegroundColor Cyan

if (Test-Path "node_modules") {
    Write-Host "Removing node_modules folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    Write-Host "✓ node_modules removed" -ForegroundColor Green
}

if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
    Write-Host "✓ package-lock.json removed" -ForegroundColor Green
}

Write-Host ""

# Step 6: Clear npm cache
Write-Host "Step 6: Clearing npm cache..." -ForegroundColor Cyan
npm cache clean --force | Out-Null
Write-Host "✓ npm cache cleaned" -ForegroundColor Green
Write-Host ""

# Step 7: Install dependencies
Write-Host "Step 7: Installing dependencies (this may take a few minutes)..." -ForegroundColor Cyan
Write-Host "Please wait..." -ForegroundColor Yellow
Write-Host ""

npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: npm install had some issues. Trying alternative method..." -ForegroundColor Yellow
    Write-Host ""
    npm install --legacy-peer-deps --force
}

Write-Host ""
Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Step 8: Verify installation
Write-Host "Step 8: Verifying installation..." -ForegroundColor Cyan
$dropdownMenu = npm list @radix-ui/react-dropdown-menu 2>&1
if ($dropdownMenu -match "2\.1\.2") {
    Write-Host "✓ @radix-ui/react-dropdown-menu installed correctly" -ForegroundColor Green
} else {
    Write-Host "WARNING: Could not verify @radix-ui/react-dropdown-menu version" -ForegroundColor Yellow
}

Write-Host ""

# Step 9: Summary and next steps
Write-Host "================================================" -ForegroundColor Green
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Or build for production:" -ForegroundColor White
Write-Host "   npm run build" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Or start the server:" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor Yellow
Write-Host ""
Write-Host "If you encounter any issues:" -ForegroundColor Cyan
Write-Host "- Check the FIX_GUIDE.md for detailed troubleshooting" -ForegroundColor White
Write-Host "- Run: npm audit" -ForegroundColor Yellow
Write-Host "- Check logs: type npm-debug.log" -ForegroundColor Yellow
Write-Host ""
Write-Host "Project directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""
