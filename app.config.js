// app.config.js — dynamic Expo config to expose PostHog keys via expo-constants
const appJson = require('./app.json');

module.exports = {
  ...appJson.expo,
  extra: {
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
  },
};
