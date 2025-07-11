import tailwindBaseConfig from '@hosspie/ui-config/tailwind';

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...tailwindBaseConfig,
  content: [
    'app/**/*.{tsx,jsx,ts,js}',
    'components/**/*.{tsx,jsx,ts,js}',
    '../packages/ui/**/*.{tsx,jsx,ts,js}',
    `!../packages/ui/node_modules`,
  ],
};
