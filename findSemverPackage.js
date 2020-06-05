const { _exec } = require("./util");

// Finds the newest version of a package published to NPM that matches the desired semver range
module.exports = function findSemverPackage(packageName, semver) {
  const stdout = _exec(`npm info ${packageName}@${semver} version`).stdout;
  const lines = stdout.split(/\n/).filter(x => x.length);
  if (lines.length === 0) {
    throw new Error(`No published package matched ${packageName}@${semver}`)
  } else if (lines.length === 1) {
    return lines[ 0 ];
  } else {
    const line = stdout.trim().split(/\n/).pop().trim();
    const [, version] = /.* '(.*)'$/.exec(line) || [];
    if (!version) {
      console.log({ stdout, line });
      throw new Error(`Couldn't find version matching ${packageName}@${semver} in npm registry`)
    }
    return version;
  }
}
