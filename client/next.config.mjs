/** @type {import('next').NextConfig} */
const nextConfig = {
     async rewrites() {
    return [
      {
        source: "/auth/:path*",        // when frontend calls /api/*
        destination: "http://host.docker.internal:3001/:path*", // redirect to backend server
      },
    ];
  },
};

export default nextConfig;
