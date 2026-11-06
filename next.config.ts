import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// Expose local Cloudflare bindings, including D1, during `next dev`.
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

export default nextConfig;
