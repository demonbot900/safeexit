import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // Die Seite spricht nie direkt mit dem Backend, sondern ueber die eigene Route
  // /api/waitlist. So bleibt die Backend-Adresse serverseitig.
  env: {},
};

export default config;
