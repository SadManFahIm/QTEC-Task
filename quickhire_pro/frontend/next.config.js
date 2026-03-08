/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow <Image> components to load from these external domains.
  // We're using CSS avatars instead of images currently, but this
  // future-proofs the config if company logos are added later.
  images: {
    domains: ['logo.clearbit.com', 'ui-avatars.com'],
  },
};

module.exports = nextConfig;
