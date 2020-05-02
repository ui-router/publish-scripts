#!/usr/bin/env node
const fs = require("fs");
const childProcess = require("child_process");
const lockfile = require("@yarnpkg/lockfile");

// dependencies or devDependencies
const depType = process.env.INPUT_DEPTYPE || "dependencies";
const exclude = (process.env.INPUT_EXCLUDE || "").split("s*,s*").filter(x=>x);
const latest = process.env.INPUT_LATEST === 'true' ? " --latest" : "";
console.log({ depType, exclude, latest });

function getDeclaredDeps() {
  const pkg = JSON.parse(fs.readFileSync("package.json").toString());
  return (depObject = pkg[depType] || {});
}

function getResolvedDeps() {
  const file = fs.readFileSync("yarn.lock", "utf8");
  const lockJson = lockfile.parse(file);
  return lockJson.object;
}

console.log({ declared: getDeclaredDeps() });
const packages = Object.keys(getDeclaredDeps()).filter(
  (pkg) => !exclude.includes(pkg)
);

function getResolvedSemverMapping() {
  const declaredDeps = getDeclaredDeps();
  const resolvedDeps = getResolvedDeps();
  return packages.reduce((acc, pkg) => {
    const declared = declaredDeps[pkg];
    const semver = `${pkg}@${declaredDeps[pkg]}`;
    const resolved = resolvedDeps[semver].version;
    acc[pkg] = { declared, resolved };
    return acc;
  }, {});
}

const before = getResolvedSemverMapping();

const cmd = `yarn upgrade ${packages.join(" ")} ${latest}`;
console.log(cmd);
childProcess.execSync(`${cmd}`, { stdio: "inherit" });

const after = getResolvedSemverMapping();

const changed = packages.filter(
  (pkg) => before[pkg].resolved !== after[pkg].resolved
);

const upgrades = changed
  .map((pkg) => `${pkg}@${after[pkg].resolved}`)
  .join(" ");

childProcess.execSync(`git status`, { stdio: "inherit" });
console.log(`::set-output name=upgrades::${upgrades}`);
console.log(`::set-output name=upgrade-count::${changed.length}`);
console.log(`::set-output name=upgrade-strategy::${process.env.INPUT_LATEST === 'true' ? 'matching semver range' : 'latest'}`);

