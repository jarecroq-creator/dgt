// Adds the optional sub-path (BASE_PATH, e.g. "/dgt" on GitHub Pages) to the static web export.
const app = require('./app.json');

module.exports = () => ({
  ...app.expo,
  experiments: { ...app.expo.experiments, ...(process.env.BASE_PATH ? { baseUrl: process.env.BASE_PATH } : {}) },
});
