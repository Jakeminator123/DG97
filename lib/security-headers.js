// Security headers for better protection
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com https://studio.d-id.com https://booking.agendo.io;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://booking.agendo.io;
      img-src 'self' data: https: blob:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' blob: https://maps.googleapis.com https://api.openai.com https://studio.d-id.com https://raw.githack.com https://rawcdn.githack.com https://raw.githubusercontent.com wss://studio.d-id.com https://booking.agendo.io;
      frame-src 'self' https://www.google.com https://maps.google.com https://studio.d-id.com https://booking.agendo.io;
      worker-src 'self' blob:;
      child-src 'self' blob:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
    `
      .replace(/\s{2,}/g, " ")
      .trim(),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(self), geolocation=(self), payment=()",
  },
];

module.exports = { securityHeaders };
