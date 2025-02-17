const test = require('ava')
const compile = require('../../helpers/compile')
const { escape } = require('../../..')
const path = require('path')

test('operators: addition', async assert => {
  var { template } = await compile('{2 + 2}')
  assert.deepEqual(template({}, escape), '4')

  var { template } = await compile('{foo + 2}')
  assert.deepEqual(template({ foo: 2 }, escape), '4')

  var { template } = await compile('{2 + foo}')
  assert.deepEqual(template({ foo: 2 }, escape), '4')

  var { template } = await compile('{foo + foo}')
  assert.deepEqual(template({ foo: 2 }, escape), '4')

  var { template } = await compile('{foo + bar}')
  assert.deepEqual(template({ foo: 2, bar: 2 }, escape), '4')

  var { template } = await compile('{foo + bar}')
  assert.deepEqual(template({}, escape), 'NaN')
})

test('operators: subtraction', async assert => {
  var { template } = await compile('{2 - 2}')
  assert.deepEqual(template({}, escape), '0')

  var { template } = await compile('{foo - 2}')
  assert.deepEqual(template({ foo: 2 }, escape), '0')

  var { template } = await compile('{2 - foo}')
  assert.deepEqual(template({ foo: 2 }, escape), '0')

  var { template } = await compile('{foo - foo}')
  assert.deepEqual(template({ foo: 2 }, escape), '0')

  var { template } = await compile('{foo - bar}')
  assert.deepEqual(template({ foo: 2, bar: 2 }, escape), '0')

  var { template } = await compile('{foo - bar}')
  assert.deepEqual(template({}, escape), 'NaN')
})

test('operators: multiplication', async assert => {
  var { template } = await compile('{2 * 2}')
  assert.deepEqual(template({}, escape), '4')

  var { template } = await compile('{foo * 2}')
  assert.deepEqual(template({ foo: 2 }, escape), '4')

  var { template } = await compile('{2 * foo}')
  assert.deepEqual(template({ foo: 2 }, escape), '4')

  var { template } = await compile('{foo * foo}')
  assert.deepEqual(template({ foo: 2 }, escape), '4')

  var { template } = await compile('{foo * bar}')
  assert.deepEqual(template({ foo: 2, bar: 2 }, escape), '4')

  var { template } = await compile('{foo * bar}')
  assert.deepEqual(template({}, escape), 'NaN')
})

test('operators: exponentiation', async assert => {
  var { template } = await compile('{2 ** 3}')
  assert.deepEqual(template({}, escape), '8')

  var { template } = await compile('{foo ** 3}')
  assert.deepEqual(template({ foo: 3 }, escape), '27')

  var { template } = await compile('{2 ** foo}')
  assert.deepEqual(template({ foo: 3 }, escape), '8')

  var { template } = await compile('{foo ** foo}')
  assert.deepEqual(template({ foo: 3 }, escape), '27')

  var { template } = await compile('{foo ** bar}')
  assert.deepEqual(template({ foo: 2, bar: 3 }, escape), '8')

  var { template } = await compile('{foo ** bar}')
  assert.deepEqual(template({}, escape), 'NaN')
})

test('operators: logical and', async assert => {
  var { template } = await compile('{foo && bar}')
  assert.deepEqual(template({ foo: true, bar: true }, escape), 'true')

  var { template } = await compile('{foo && bar}')
  assert.deepEqual(template({ foo: true, bar: false }, escape), 'false')

  var { template } = await compile('{foo && bar}')
  assert.deepEqual(template({ foo: false, bar: true }, escape), 'false')

  var { template } = await compile('{foo && bar}')
  assert.deepEqual(template({ foo: false, bar: false }, escape), 'false')
})

test('operators: logical or', async assert => {
  var { template } = await compile('{foo || bar}')
  assert.deepEqual(template({ foo: true, bar: true }, escape), 'true')

  var { template } = await compile('{foo || bar}')
  assert.deepEqual(template({ foo: true, bar: false }, escape), 'true')

  var { template } = await compile('{foo || bar}')
  assert.deepEqual(template({ foo: false, bar: true }, escape), 'true')

  var { template } = await compile('{foo || bar}')
  assert.deepEqual(template({ foo: false, bar: false }, escape), 'false')

  var { template } = await compile('{foo || "bar"}')
  assert.deepEqual(template({ foo: 'foo' }, escape), 'foo')

  var { template } = await compile('{foo || "bar"}')
  assert.deepEqual(template({ foo: '' }, escape), 'bar')
})

test('operators: comparison', async assert => {
  var { template } = await compile('{foo > bar}')
  assert.deepEqual(template({ foo: 1, bar: 0 }, escape), 'true')

  var { template } = await compile('{foo < bar}')
  assert.deepEqual(template({ foo: 1, bar: 0 }, escape), 'false')

  var { template } = await compile('{foo >= bar}')
  assert.deepEqual(template({ foo: 1, bar: 0 }, escape), 'true')

  var { template } = await compile('{foo <= bar}')
  assert.deepEqual(template({ foo: 1, bar: 0 }, escape), 'false')

  var { template } = await compile('{foo.bar > baz.qux}')
  assert.deepEqual(template({ foo: { bar: 1 }, baz: { qux: 0 } }, escape), 'true')

  var { template } = await compile('{foo[bar] > baz[qux]}')
  assert.deepEqual(template({ foo: { bar: 1 }, bar: 'bar', baz: { qux: 0 }, qux: 'qux' }, escape), 'true')

  var { template } = await compile('{foo.length > 0 ? "active" : "inactive"}')
  assert.deepEqual(template({ foo: ['bar'] }, escape), 'active')
  assert.deepEqual(template({ foo: [] }, escape), 'inactive')
})

test('operators: ternary', async assert => {
  var { template } = await compile('{foo ? "bar" : "baz"}')
  assert.deepEqual(template({ foo: true }, escape), 'bar')

  var { template } = await compile('{foo ? "bar" : "baz"}')
  assert.deepEqual(template({ foo: false }, escape), 'baz')

  var { template } = await compile('{foo ? bar : baz}')
  assert.deepEqual(template({ foo: true, bar: 'bar', baz: 'baz' }, escape), 'bar')

  var { template } = await compile('{foo ? bar : baz}')
  assert.deepEqual(template({ foo: false, bar: 'bar', baz: 'baz' }, escape), 'baz')

  var { template } = await compile('{foo.bar ? bar : baz}')
  assert.deepEqual(template({ foo: { bar: true }, bar: 'bar', baz: 'baz' }, escape), 'bar')

  var { template } = await compile('{foo.bar ? bar : baz}')
  assert.deepEqual(template({ foo: { bar: false }, bar: 'bar', baz: 'baz' }, escape), 'baz')

  var { template } = await compile('{foo.bar ? bar.baz : baz.qux}')
  assert.deepEqual(template({ foo: { bar: true }, bar: { baz: 'bar' }, baz: { qux: 'baz' } }, escape), 'bar')

  var { template } = await compile('{foo.bar ? bar.baz : baz.qux}')
  assert.deepEqual(template({ foo: { bar: false }, bar: { baz: 'bar' }, baz: { qux: 'baz' } }, escape), 'baz')

  var { template } = await compile('{ foo ? foo + "bar" : "" }')
  assert.deepEqual(template({ foo: 'foo' }, escape), 'foobar')

  var { template } = await compile('{ foo ? foo + "bar" : "" }')
  assert.deepEqual(template({ foo: '' }, escape), '')

  var { template } = await compile('{ foo ? foo + "bar" : "" }')
  assert.deepEqual(template({ foo: undefined }, escape), '')
})

test('operators: ternary operator works with computed object property access', async assert => {
  var { template } = await compile('{ foo[bar] ? "foo" : "bar" }')
  assert.deepEqual(template({ foo: { bar: true }, bar: 'bar' }, escape), 'foo')

  var { template } = await compile('{ foo[bar] ? "foo" : "bar" }')
  assert.deepEqual(template({ foo: { bar: false }, bar: 'bar' }, escape), 'bar')
})

test('operators: ternary operator works inside loops', async assert => {
  const { template } = await compile(`<for car in cars>{car === 'x' ? 'X' : car}</for>`)
  assert.deepEqual(template({ cars: ['a', 'x']}, escape), 'aX')
})

test('operators: filters boolean attributes', async assert => {
  var { template } = await compile(`<option value="baz" selected="{ foo == 'bar' }"></option>`)
  assert.deepEqual(template({ foo: 'bar' }, escape), '<option value="baz" selected></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo == 'bar' }"></option>`)
  assert.deepEqual(template({ foo: 'ban' }, escape), '<option value="baz"></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo === 'bar' }"></option>`)
  assert.deepEqual(template({ foo: 'bar' }, escape), '<option value="baz" selected></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo === 'bar' }"></option>`)
  assert.deepEqual(template({ foo: 'ban' }, escape), '<option value="baz"></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo > 5 }"></option>`)
  assert.deepEqual(template({ foo: 10 }, escape), '<option value="baz" selected></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo > 5 }"></option>`)
  assert.deepEqual(template({ foo: 5 }, escape), '<option value="baz"></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo >= 5 }"></option>`)
  assert.deepEqual(template({ foo: 10 }, escape), '<option value="baz" selected></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo >= 5 }"></option>`)
  assert.deepEqual(template({ foo: 4 }, escape), '<option value="baz"></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo >= 5 }"></option>`)
  assert.deepEqual(template({ foo: 5 }, escape), '<option value="baz" selected></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo >= 5 }"></option>`)
  assert.deepEqual(template({ foo: 4 }, escape), '<option value="baz"></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo < 5 }"></option>`)
  assert.deepEqual(template({ foo: 10 }, escape), '<option value="baz"></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo < 5 }"></option>`)
  assert.deepEqual(template({ foo: 5 }, escape), '<option value="baz"></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo < 5 }"></option>`)
  assert.deepEqual(template({ foo: 4 }, escape), '<option value="baz" selected></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo <= 5 }"></option>`)
  assert.deepEqual(template({ foo: 10 }, escape), '<option value="baz"></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo <= 5 }"></option>`)
  assert.deepEqual(template({ foo: 5 }, escape), '<option value="baz" selected></option>')

  var { template } = await compile(`<option value="baz" selected="{ foo <= 5 }"></option>`)
  assert.deepEqual(template({ foo: 4 }, escape), '<option value="baz" selected></option>')

  // TODO: Includes all comparison operators
})

test('operators: works for multiple variables', async assert => {
  var { template } = await compile('{foo > bar && baz > qux}')
  assert.deepEqual(template({ foo: 1, bar: 0, baz: 1, qux: 0 }, escape), 'true')
})
