'use strict'

const test = require('ava')
const { extract, dasherize, hyphenate, getExtension, hash } = require('./string')

test('extract: extracts from tokens filters and values', assert => {
  assert.deepEqual(extract('foo'), [{ type: 'text', value: 'foo' }])
  assert.deepEqual(extract('bar'), [{ type: 'text', value: 'bar' }])
  assert.deepEqual(extract('{foo}'), [{ type: 'expression', value: '{foo}' }])
  assert.deepEqual(extract('{bar}'), [{ type: 'expression', value: '{bar}' }])
  assert.deepEqual(extract('foo bar'), [{ type: 'text', value: 'foo bar' }])
  assert.deepEqual(extract('foo {bar}'), [{ type: 'text', value: 'foo ' }, { type: 'expression', value: '{bar}' }])
  assert.deepEqual(extract('{foo} bar'), [{ type: 'expression', value: '{foo}' }, { type: 'text', value: ' bar' }])
  assert.deepEqual(extract('{foo} {bar}'), [{ type: 'expression', value: '{foo}' }, { type: 'text', value: ' ' }, { type: 'expression', value: '{bar}' }])
  assert.deepEqual(extract('foo bar {baz}'), [{ type: 'text', value: 'foo bar ' }, { type: 'expression', value: '{baz}' }])
  assert.deepEqual(extract('foo {bar} baz'), [{ type: 'text', value: 'foo ' }, { type: 'expression', value: '{bar}' }, { type: 'text', value: ' baz' }])
  assert.deepEqual(extract('foo     bar'), [{ type: 'text', value: 'foo     bar' }])
  assert.deepEqual(extract('   foo     bar    '), [{ type: 'text', value: '   foo     bar    ' }])
  assert.deepEqual(extract('foo-{bar}'), [{ type: 'text', value: 'foo-' }, { type: 'expression', value: '{bar}' }])
  assert.deepEqual(extract('{foo}-{bar}'), [{ type: 'expression', value: '{foo}' }, { type: 'text', value: '-' }, { type: 'expression', value: '{bar}' }])
  assert.deepEqual(extract('{foo | uppercase}'), [{ type: 'expression', value: '{foo}', original: '{foo | uppercase}', filters: ['uppercase'] }])
  assert.deepEqual(extract('{foo | uppercase | lowercase}'), [{ type: 'expression', value: '{foo}', original: '{foo | uppercase | lowercase}', filters: ['uppercase', 'lowercase'] }])
  assert.deepEqual(extract('{foo | uppercase | lowercase | truncate(25)}'), [{ type: 'expression', value: '{foo}', original: '{foo | uppercase | lowercase | truncate(25)}', filters: ['uppercase', 'lowercase', 'truncate(25)'] }])
  assert.deepEqual(extract('{1}'), [{ type: 'expression', value: '{1}' }])
  assert.deepEqual(extract('{"foo"}'), [{ type: 'expression', value: '{"foo"}' }])
  assert.deepEqual(extract('{foo | monetize({ currency: "$", ending: false, space: false })}'), [{ type: 'expression', value: '{foo}', original: '{foo | monetize({ currency: "$", ending: false, space: false })}', filters: ['monetize({ currency: "$", ending: false, space: false })'] }])
  assert.deepEqual(extract('{foo | bar({baz: 25}) | monetize({ currency: "$", ending: false, space: false })}'), [{ type: 'expression', value: '{foo}', original: '{foo | bar({baz: 25}) | monetize({ currency: "$", ending: false, space: false })}', filters: ['bar({baz: 25})', 'monetize({ currency: "$", ending: false, space: false })'] }])
  assert.deepEqual(extract('/foo/{bar | first}'), [{ type: 'text', value: '/foo/' }, { type: 'expression', value: '{bar}', original: '{bar | first}', filters: ['first'] }])
  assert.deepEqual(extract('{foo || bar}'), [{ type: 'expression', value: '{foo || bar}' }])
})

test('dasherize: replaces dots with dashes', assert => {
  assert.deepEqual(dasherize('foo.bar'), 'foo-bar')
})

test('hyphenate: converts characters to lowercase and prepends a dash', assert => {
  assert.deepEqual(hyphenate('fooBar'), 'foo-bar')
})

test('getExtension: returns the extension of the file', assert => {
  assert.deepEqual(getExtension('index'), '')
  assert.deepEqual(getExtension('index.html'), 'html')
})

test('hash: returns a hash', assert => {
  assert.deepEqual(hash(''), '')
  assert.deepEqual(hash(undefined), '')
  assert.deepEqual(hash(null), '')
  assert.deepEqual(hash('foo'), 'sb875c63')
})
