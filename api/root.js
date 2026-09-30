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
    .command { display: flex; align-items: center; gap: .5rem; border-radius: .5rem; background: #edf2f8; }
    pre { flex: 1; min-width: 0; overflow-x: auto; margin: 0; padding: 1rem; }
    button { display: grid; place-items: center; flex: none; width: 2.75rem; height: 2.75rem; margin-right: .5rem; border: 1px solid #b8c9dd; border-radius: .5rem; background: #fff; color: inherit; cursor: pointer; }
    button:hover { background: #e0ebf8; }
    button:focus-visible { outline: 2px solid #1459ad; outline-offset: 2px; }
    button svg { width: 1.2rem; height: 1.2rem; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; }
    #copy-status { display: block; min-height: 1.5em; margin-top: .5rem; font-size: .9rem; }
    a { color: #1459ad; overflow-wrap: anywhere; }
    @media (prefers-color-scheme: dark) {
      body { background: #101722; color: #edf3fa; }
      main { background: #1c2838; border-color: #34465d; box-shadow: none; }
      .command { background: #111b29; }
      button { background: #1c2838; border-color: #516986; }
      button:hover { background: #34465d; }
      a { color: #9ac9ff; }
    }
  </style>
</head>
<body>
  <main>
    <h1>Your IP API</h1>
    <p>アクセス元の公開IPアドレスを取得できます。</p>
    <p><a href="/api/ip"><code>GET /api/ip</code></a> はIPアドレスだけをプレーンテキストで返し、行末に改行を付けます。</p>
    <div class="command">
      <pre><code id="command">curl ${endpoint}</code></pre>
      <button type="button" id="copy-command" aria-label="コマンドをコピー" title="コマンドをコピー">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h11v14H8z"/><path d="M5 7H4v13h11v-1"/></svg>
      </button>
    </div>
    <span id="copy-status" role="status" aria-live="polite"></span>
  </main>
  <script>
    document.getElementById('copy-command').addEventListener('click', async () => {
      const status = document.getElementById('copy-status');
      try {
        await navigator.clipboard.writeText(document.getElementById('command').textContent);
        status.textContent = 'コピーしました';
      } catch {
        status.textContent = 'コピーできませんでした';
      }
    });
  </script>
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
