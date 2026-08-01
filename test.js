const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const context = vm.createContext({ Date });
vm.runInContext(fs.readFileSync('function.js', 'utf8'), context);

function invoke({ uri = '/', accept } = {}) {
  const headers = {};
  if (accept !== undefined) headers.accept = { value: accept };

  return context.handler({
    request: { uri, headers },
    response: {
      statusCode: '200',
      headers: { 'content-type': { value: 'text/html' } },
      body: { encoding: 'text', data: 'origin body' },
    },
  });
}

function assertTimestamp(value) {
  assert.match(value, /^\d{8}T\d{6}Z$/);
  const parsed = new Date(value.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/, '$1-$2-$3T$4:$5:$6Z'));
  assert.ok(Math.abs(Date.now() - parsed.getTime()) < 2_000);
}

test('a request without Accept receives one plain timestamp string', () => {
  const response = invoke();
  assert.equal(response.headers['content-type'].value, 'text/plain; charset=utf-8');
  assertTimestamp(response.body.data);
  assert.equal(response.body.data, response.headers['x-amz-date'].value);
});

test('only an explicit HTML request receives the rich-link page', () => {
  const response = invoke({ accept: 'text/html,application/xhtml+xml;q=0.9' });
  assert.equal(response.headers['content-type'].value, 'text/html; charset=utf-8');
  assert.match(response.body.data, /^<!DOCTYPE html>/);
  assert.match(response.body.data, /rel="apple-touch-icon"/);
  assert.doesNotMatch(response.body.data, /property="og:image"/);
  assert.match(response.body.data, new RegExp(response.headers['x-amz-date'].value));
});

test('wildcard and disabled HTML accept types receive plain text', () => {
  assert.equal(invoke({ accept: '*/*' }).headers['content-type'].value, 'text/plain; charset=utf-8');
  assert.equal(invoke({ accept: 'text/html;q=0, */*' }).headers['content-type'].value, 'text/plain; charset=utf-8');
});

test('image and favicon responses pass through unchanged', () => {
  for (const uri of ['/apple-touch-icon.png', '/favicon.ico']) {
    const response = invoke({ uri, accept: 'image/*' });
    assert.equal(response.body.data, 'origin body');
    assert.equal(response.headers['content-type'].value, 'text/html');
    assert.equal(response.headers['x-amz-date'], undefined);
  }
});
