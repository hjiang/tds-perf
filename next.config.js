const LC = require('leanengine');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = (phase) => {
  if (phase.endsWith('server')) {
    console.log('Initializing LeanCloud in phase: ' + phase);
    LC.init({
      appId: process.env.LEANCLOUD_APP_ID,
      appKey: process.env.LEANCLOUD_APP_KEY,
      masterKey: process.env.LEANCLOUD_APP_MASTER_KEY,
    });
  }
  return nextConfig;
};
