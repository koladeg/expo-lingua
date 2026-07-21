// app.config.js — dynamic Expo config to expose PostHog keys via expo-constants
const appJson = require('./app.json');

module.exports = {
  ...appJson.expo,
  extra: {
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
    eas: {
      projectId: 'f1c44ba6-2f87-44c2-aea1-c6e1f97e5fdb',
    },
  },
};
