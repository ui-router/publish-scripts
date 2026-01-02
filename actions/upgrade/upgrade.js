#!/usr/bin/env node
const fs = require("fs");
const childProcess = require("child_process");
const path = require("path");

// dependencies or devDependencies
const depType = process.env.INPUT_DEPTYPE || "dependencies";
const excludes = (process.env.INPUT_EXCLUDES || "").split("s*,s*").filter(x=>x);
const latest = process.env.INPUT_LATEST === 'true';
console.log({ depType, excludes, latest });

/**
 * Detects the package manager based on the presence of lockfiles.
 * @returns {'yarn'|'npm'|'pnpm'}
 */
function detectPackageManager() {
  if (fs.existsSync('yarn.lock')) {
    return 'yarn';
  }
  if (fs.existsSync('pnpm-lock.yaml')) {
    return 'pnpm';
  }
  if (fs.existsSync('package-lock.json')) {
    return 'npm';
  }
  // Default to npm if no lockfile is present
  return 'npm';
}

const packageManager = detectPackageManager();
console.log({ packageManager });

function getDeclaredDeps() {
  const pkg = JSON.parse(fs.readFileSync("package.json").toString());
  return (depObject = pkg[depType] || {});
}

/**
 * Parse yarn.lock and return resolved dependencies
 */
function getYarnResolvedDeps() {
  const lockfile = require("@yarnpkg/lockfile");
  const file = fs.readFileSync("yarn.lock", "utf8");
  const lockJson = lockfile.parse(file);
  return lockJson.object;
}

/**
 * Parse package-lock.json and return resolved dependencies
 */
function getNpmResolvedDeps() {
  const lockJson = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
  // npm lockfile v2/v3 uses "packages" with "" as root
  if (lockJson.packages) {
    const deps = {};
    for (const [key, value] of Object.entries(lockJson.packages)) {
      if (key.startsWith('node_modules/')) {
        const pkgName = key.replace('node_modules/', '');
        deps[pkgName] = value;
      }
    }
    return deps;
  }
  // npm lockfile v1 uses "dependencies"
  return lockJson.dependencies || {};
}

/**
 * Parse pnpm-lock.yaml and return resolved dependencies
 */
function getPnpmResolvedDeps() {
  // Simple YAML parser for pnpm-lock.yaml
  // pnpm-lock.yaml structure varies by version, but we need the packages section
  const yaml = fs.readFileSync("pnpm-lock.yaml", "utf8");
  const deps = {};
  
  // Look for packages section - this is a simplified parser
  // For production use, consider using a proper YAML parser
  const lines = yaml.split('\n');
  let inPackages = false;
  let currentPkg = null;
  
  for (const line of lines) {
    if (line.startsWith('packages:')) {
      inPackages = true;
      continue;
    }
    
    if (inPackages) {
      // New top-level key means end of packages section
      if (!line.startsWith(' ') && !line.startsWith('\t') && line.trim() && !line.startsWith('#')) {
        break;
      }
      
      // Match package entries like "  /@scope/pkg@version:" or "  /pkg@version:"
      const pkgMatch = line.match(/^\s{2}['"]?\/?(@?[^@]+)@([^:'"]+)['"]?:/);
      if (pkgMatch) {
        const name = pkgMatch[1];
        const version = pkgMatch[2];
        deps[name] = { version };
      }
    }
  }
  
  return deps;
}

function getResolvedDeps() {
  switch (packageManager) {
    case 'yarn':
      return getYarnResolvedDeps();
    case 'npm':
      return getNpmResolvedDeps();
    case 'pnpm':
      return getPnpmResolvedDeps();
    default:
      throw new Error(`Unknown package manager: ${packageManager}`);
  }
}

console.log({ declared: getDeclaredDeps() });
const packages = Object.keys(getDeclaredDeps()).filter(
  (pkg) => !excludes.includes(pkg)
);

function getResolvedSemverMapping() {
  const declaredDeps = getDeclaredDeps();
  const resolvedDeps = getResolvedDeps();
  
  return packages.reduce((acc, pkg) => {
    const declared = declaredDeps[pkg];
    let resolved;
    
    if (packageManager === 'yarn') {
      const semver = `${pkg}@${declared}`;
      resolved = resolvedDeps[semver]?.version || 'unknown';
    } else if (packageManager === 'npm') {
      resolved = resolvedDeps[pkg]?.version || 'unknown';
    } else if (packageManager === 'pnpm') {
      resolved = resolvedDeps[pkg]?.version || 'unknown';
    }
    
    acc[pkg] = { declared, resolved };
    return acc;
  }, {});
}

const before = getResolvedSemverMapping();

// Build the upgrade command based on package manager
let cmd;
switch (packageManager) {
  case 'yarn':
    cmd = `yarn upgrade ${packages.join(" ")}${latest ? " --latest" : ""}`;
    break;
  case 'npm':
    // npm update doesn't have --latest, use npm-check-updates or install with @latest
    if (latest) {
      cmd = `npm install ${packages.map(p => `${p}@latest`).join(" ")}`;
    } else {
      cmd = `npm update ${packages.join(" ")}`;
    }
    break;
  case 'pnpm':
    cmd = `pnpm update ${packages.join(" ")}${latest ? " --latest" : ""}`;
    break;
}

console.log(cmd);
childProcess.execSync(`${cmd}`, { stdio: "inherit" });

const after = getResolvedSemverMapping();

const changed = packages.filter(
  (pkg) => before[pkg].resolved !== after[pkg].resolved
);

const upgrades = changed
  .map((pkg) => `${pkg}@${before[pkg].declared}: ${before[pkg].resolved} -> ${after[pkg].resolved}`)
  .join("%0A");

childProcess.execSync(`git status`, { stdio: "inherit" });
console.log(`::set-output name=upgrades::${upgrades}`);
console.log(`::set-output name=upgradecount::${changed.length}`);
console.log(`::set-output name=upgradestrategy::${latest ? 'latest' : 'matching semver range'}`);
