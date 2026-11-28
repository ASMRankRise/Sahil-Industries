import type { NextConfig } from 'next';

// Keep all browser-facing security policy in one place. The inline allowances
// are currently required by the legacy runtime and React's inline styles; the
// external origins are limited to services used by the site (Maps, Turnstile,
// Google Fonts, and the legacy scrollbar dependency).
const isDevelopment = process.env.NODE_ENV === 'development';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''} https://cdnjs.cloudflare.com https://challenges.cloudflare.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://picsum.photos https://*.googleusercontent.com https://maps.gstatic.com",
      "connect-src 'self' https://challenges.cloudflare.com https://api.cloudflare.com",
      "frame-src https://www.google.com https://maps.google.com https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com",
      "media-src 'self' blob:",
      'upgrade-insecure-requests',
    ].join('; '),
  },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
];

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    localPatterns: [
      { pathname: '/media/**' },
      { pathname: '/sahilcrane/**' },
      { pathname: '/assets/**' },
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
