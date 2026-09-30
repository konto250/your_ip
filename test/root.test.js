const assert = require('node:assert/strict');
const test = require('node:test');
const vm = require('node:vm');
const handler = require('../api/root');

function request(method, accept) {
  const result = { headers: {}, statusCode: 200, body: undefined };
  const response = {
    setHeader(name, value) { result.headers[name] = value; },
    status(code) { result.statusCode = code; return this; },
    end(body) { result.body = body; return this; },
  };
  handler({ method, headers: { accept } }, response);
  return result;
}

test('browser gets styled HTML instructions', () => {
  const result = request('GET', 'text/html,application/xhtml+xml');
  assert.equal(result.statusCode, 200);
  assert.equal(result.headers['Content-Type'], 'text/html; charset=utf-8');
  assert.match(result.body, /<style>/);
  assert.match(result.body, /href="\/api\/ip"/);
  assert.match(result.body, /aria-label="コマンドをコピー"/);
  assert.equal(result.headers.Vary, 'Accept');
});

test('copy icon copies the displayed command in one click', async () => {
  const html = request('GET', 'text/html').body;
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);

  let onClick;
  let copied;
  const status = { textContent: '' };
  const elements = {
    'copy-command': { addEventListener(event, callback) { assert.equal(event, 'click'); onClick = callback; } },
    'copy-status': status,
    command: { textContent: 'curl https://yourip-delta.vercel.app/api/ip' },
  };
  vm.runInNewContext(script, {
    document: { getElementById(id) { return elements[id]; } },
    navigator: { clipboard: { async writeText(text) { copied = text; } } },
  });
  await onClick();
  assert.equal(copied, elements.command.textContent);
  assert.equal(status.textContent, 'コピーしました');
});

test('curl gets concise text instructions', () => {
  const result = request('GET', '*/*');
  assert.equal(result.headers['Content-Type'], 'text/plain; charset=utf-8');
  assert.match(result.body, /curl https:\/\/yourip-delta\.vercel\.app\/api\/ip/);
  assert.doesNotMatch(result.body, /<html/);
});

test('HEAD and unsupported methods have no body', () => {
  assert.equal(request('HEAD', 'text/html').body, undefined);
  const result = request('POST', 'text/html');
  assert.equal(result.statusCode, 405);
  assert.equal(result.body, undefined);
});
