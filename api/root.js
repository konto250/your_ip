const endpoint = 'https://yourip-delta.vercel.app/api/ip';

const plainText = `Your IP API

アクセス元の公開IPアドレスを取得します。
GET /api/ip はIPアドレスと行末の改行を返します。

curl ${endpoint}
`;

const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your IP API</title>
  <style>
    :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f3f6fa; color: #17243a; }
    main { box-sizing: border-box; width: min(100% - 2rem, 42rem); padding: clamp(1.5rem, 5vw, 3rem); background: #fff; border: 1px solid #dbe3ed; border-radius: 1rem; box-shadow: 0 12px 36px #17243a12; }
    h1 { margin: 0 0 1rem; font-size: clamp(1.6rem, 4vw, 2.2rem); }
    p { line-height: 1.7; }
    code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
    pre { overflow-x: auto; padding: 1rem; border-radius: .5rem; background: #edf2f8; }
    a { color: #1459ad; overflow-wrap: anywhere; }
    @media (prefers-color-scheme: dark) {
      body { background: #101722; color: #edf3fa; }
      main { background: #1c2838; border-color: #34465d; box-shadow: none; }
      pre { background: #111b29; }
      a { color: #9ac9ff; }
    }
  </style>
</head>
<body>
  <main>
    <h1>Your IP API</h1>
    <p>アクセス元の公開IPアドレスを取得できます。</p>
    <p><a href="/api/ip"><code>GET /api/ip</code></a> はIPアドレスだけをプレーンテキストで返し、行末に改行を付けます。</p>
    <pre><code>curl ${endpoint}</code></pre>
  </main>
</body>
</html>`;

module.exports = function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Vary', 'Accept');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    return response.status(405).end();
  }

  const wantsHtml = request.headers.accept?.includes('text/html');
  response.setHeader('Content-Type', wantsHtml ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8');
  return response.status(200).end(request.method === 'HEAD' ? undefined : wantsHtml ? html : plainText);
};
