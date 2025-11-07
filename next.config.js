/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /@supabase\/realtime-js/ },
    ];
    return config;
  },
};

module.exports = nextConfig;
