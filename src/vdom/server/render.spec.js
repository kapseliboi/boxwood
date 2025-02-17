'use strict'

const test = require('ava')
const render = require('./render')
const tag = require('../tag')
const { doctype, html, head, body, header, main, footer } = require('../nodes')

test('#render: creates a dom node from a vdom node', assert => {
  const result = render(tag('div', { class: 'foo', id: 'bar' }))
  assert.deepEqual(result, '<div class="foo" id="bar"></div>')
})

test('#render: renders text nodes', assert => {
  const result = render('foo')
  assert.deepEqual(result, 'foo')
})

test('#render: escapes text nodes', assert => {
  const result = render('<div>foo</div>')
  assert.deepEqual(result, '&lt;div&gt;foo&lt;/div&gt;')
})

test('#render: creates children nodes (text)', assert => {
  const result = render(tag('div', { class: 'foo' }, 'bar'))
  assert.deepEqual(result, '<div class="foo">bar</div>')
})

test('#render: renders css', assert => {
  const result = render(tag('div', { style: { color: 'red' } }, 'bar'))
  assert.deepEqual(result, '<div style="color: red">bar</div>')
})

test('#render: creates children nodes (tag)', assert => {
  const result = render(tag('div', { class: 'foo' }, tag('p', 'bar')))
  assert.deepEqual(result, '<div class="foo"><p>bar</p></div>')
})

test('#render: self closing tags', assert => {
  const result = render(tag('br'))
  assert.deepEqual(result, '<br>')
})

test('#render: self closing tags with attributes', assert => {
  const result = render(tag('hr', { class: 'primary' }))
  assert.deepEqual(result, '<hr class="primary">')
})

test('#render: selected option', assert => {
  const result = render(tag('option', { value: 'foo', selected: true }))
  assert.deepEqual(result, '<option value="foo" selected></option>')
})

test('#render: deselected option', assert => {
  const result = render(tag('option', { value: 'foo', selected: false }))
  assert.deepEqual(result, '<option value="foo"></option>')
})

test('#render: doctype', assert => {
  const result = render(doctype())
  assert.deepEqual(result, '<!DOCTYPE html>')
})

test('#render: html page', assert => {
  const result = render([
    doctype(),
    html([
      head(),
      body([
        header('foo'),
        main('bar'),
        footer('baz')
      ])
    ])
  ])
  assert.deepEqual(result, '<!DOCTYPE html><html><head></head><body><header>foo</header><main>bar</main><footer>baz</footer></body></html>')
})

test('#render: number', assert => {
  const result = render(tag('div', 1234))
  assert.deepEqual(result, '<div>1234</div>')
})
