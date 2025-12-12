import tailwindBaseConfig from '@hosspie/ui-config/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindBaseConfig,
  content: [
    '../../packages/design-system/**/*.{tsx,jsx,ts,js}',
    `!../packages/design-system/node_modules`,
  ],
};
