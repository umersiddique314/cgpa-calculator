/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Required for production deployment on Azure
    outputFileTracingRoot: undefined
  }
}

module.exports = nextConfig
