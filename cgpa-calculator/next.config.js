/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  poweredByHeader: false,
  serverMinification: false
}

module.exports = nextConfig
