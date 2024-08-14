/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/python',
        destination:
          process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/python' : '/api',
      },
      {
        source: '/test',
        destination:
          process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/:path*' : '/',
      },
    ];
  },
};

module.exports = nextConfig;
