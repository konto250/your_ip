const assert = require('node:assert/strict');
const test = require('node:test');
const handler = require('../api/ip');

function request(method, headers = {}) {
  const result = { headers: {}, statusCode: 200, body: undefined };
  const response = {
    setHeader(name, value) { result.headers[name] = value; },
    status(code) { result.statusCode = code; return this; },
    end(body) { result.body = body; return this; },
  };
  handler({ method, headers }, response);
  return result;
}

test('GET returns only the IPv4 or IPv6 address and disables caching', () => {
  for (const ip of ['203.0.113.10', '2001:db8::10']) {
    const result = request('GET', { 'x-forwarded-for': ip });
    assert.equal(result.statusCode, 200);
    assert.equal(result.body, ip);
    assert.equal(result.headers['Content-Type'], 'text/plain; charset=utf-8');
    assert.equal(result.headers['Cache-Control'], 'no-store');
  }
});

test('HEAD and unsupported methods have no body', () => {
  const headers = { 'x-forwarded-for': '203.0.113.10' };
  assert.equal(request('HEAD', headers).body, undefined);
  const result = request('POST', headers);
  assert.equal(result.statusCode, 405);
  assert.equal(result.body, undefined);
});

test('missing or malformed IP fails without returning request data', () => {
  for (const headers of [{}, { 'x-forwarded-for': 'bad-ip' }]) {
    const result = request('GET', headers);
    assert.equal(result.statusCode, 503);
    assert.equal(result.body, undefined);
  }
});
