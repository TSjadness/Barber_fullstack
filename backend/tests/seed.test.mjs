import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const db = JSON.parse(await readFile(new URL('../../frontend/src/mock/db.json', import.meta.url), 'utf8'));
test('mock seed retains original app state fields', () => {
  assert.equal(typeof db.shop.name, 'string');
  for (const name of ['services', 'staff', 'bookings', 'notices', 'payments']) assert.ok(Array.isArray(db[name]), name);
  assert.equal(db.bookings.length, 0);
});
