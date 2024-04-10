/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontetnt.com",
      },
    ],
  },
};

export default nextConfig;
