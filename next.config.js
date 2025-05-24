const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // إعدادات أخرى لو فيه
};

module.exports = withNextIntl(nextConfig);
