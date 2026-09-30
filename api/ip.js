const { isIP } = require('node:net');

module.exports = function handler(request, response) {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    return response.status(405).end();
  }

  // Vercel replaces this header with the connecting client's public IP.
  const ip = request.headers['x-forwarded-for']?.split(',')[0].trim();
  if (!ip || !isIP(ip)) {
    return response.status(503).end();
  }

  return response.status(200).end(request.method === 'HEAD' ? undefined : ip);
};
