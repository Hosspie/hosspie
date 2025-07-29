import tailwindBaseConfig from '@hosspie/ui-config/tailwind';

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...tailwindBaseConfig,
  content: ['../../packages/ui/**/*.{tsx,jsx,ts,js}', `!../packages/ui/node_modules`],
};
