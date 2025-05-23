import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./app/i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    serverActions: true,
  },
};

export default withNextIntl(nextConfig);
