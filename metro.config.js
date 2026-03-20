const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase v10+ uses package exports in package.json which causes Metro to pick
// up ESM files that Hermes can't run -- disabling forces Metro to use the CJS main field
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
