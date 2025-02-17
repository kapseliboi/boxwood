'use strict'

const test = require('ava')
const { lint } = require('.')

test('lint: bracket verification', async assert => {
  let source = '<div></div>'
  assert.deepEqual(await lint(source), [])

  source = 'div></div>'
  assert.deepEqual(await lint(source), [{ type: 'OPENING_ANGLE_BRACKET_MISSING', message: 'opening angle bracket is missing' }])

  source = '<div</div>'
  assert.deepEqual(await lint(source), [{ type: 'CLOSING_ANGLE_BRACKET_MISSING', message: 'closing angle bracket is missing' }])
})

test('lint: bracket verification should ignore content of script and style tags', async assert => {
  let source = '<script>if (foo > 42 || bar < 42) {}</script>'
  assert.deepEqual(await lint(source), [])

  source = '<style>.foo { content: "<>"; }</style>'
  assert.deepEqual(await lint(source), [])
})

test('lint: bracket verification ignores comments', async assert => {
  let source = '<!-- <p>foo</p> -->'
  assert.deepEqual(await lint(source), [])
})

test('lint: unused components', async assert => {
  let source = '<div></div>'
  assert.deepEqual(await lint(source), [])

  source = '<import button from="./foo.html">'
  assert.deepEqual(await lint(source), [{ type: 'UNUSED_COMPONENT', message: 'button component is unused' }])

  source = '<import button from="./foo.html"><import input from="./input.html"><button></button>'
  assert.deepEqual(await lint(source), [{ type: 'UNUSED_COMPONENT', message: 'input component is unused' }])

  source = '<import button from="./foo.html"><import input from="./input.html">'
  assert.deepEqual(
    await lint(source),
    [
      { type: 'UNUSED_COMPONENT', message: 'button component is unused' },
      { type: 'UNUSED_COMPONENT', message: 'input component is unused' }
    ]
  )

  source = '<import { button } from="./foo.html">'
  assert.deepEqual(await lint(source), [{ type: 'UNUSED_COMPONENT', message: 'button component is unused' }])

  source = '<import {button} from="./foo.html">'
  assert.deepEqual(await lint(source), [{ type: 'UNUSED_COMPONENT', message: 'button component is unused' }])

  source = '<import { button } from="./foo.html"><button></button>'
  assert.deepEqual(await lint(source), [])

  source = '<import { button, input } from="./components.html">'
  assert.deepEqual(
    await lint(source),
    [
      { type: 'UNUSED_COMPONENT', message: 'button component is unused' },
      { type: 'UNUSED_COMPONENT', message: 'input component is unused' }
    ]
  )

  source = '<import { button, input } from="./components.html"><input/>'
  assert.deepEqual(await lint(source), [{ type: 'UNUSED_COMPONENT', message: 'button component is unused' }])

  source = '<import { button, input } from="./components.html"><input/><button></button>'
  assert.deepEqual(await lint(source), [])

  source = '<import button, input from="./components.html"><input/>'
  assert.deepEqual(await lint(source), [{ type: 'UNUSED_COMPONENT', message: 'button component is unused' }])

  source = '<import button , input from="./components.html"><input/><button></button>'
  assert.deepEqual(await lint(source), [])

  source = '<require button from="./foo.html">'
  assert.deepEqual(await lint(source), [{ type: 'UNUSED_COMPONENT', message: 'button component is unused' }])

  source = '<require button from="./foo.html"><require input from="./input.html"><button></button>'
  assert.deepEqual(await lint(source), [{ type: 'UNUSED_COMPONENT', message: 'input component is unused' }])

  source = '<require button from="./foo.html"><require input from="./input.html">'
  assert.deepEqual(
    await lint(source),
    [
      { type: 'UNUSED_COMPONENT', message: 'button component is unused' },
      { type: 'UNUSED_COMPONENT', message: 'input component is unused' }
    ]
  )

  source = '<require { button } from="./foo.html">'
  assert.deepEqual(await lint(source), [{ type: 'UNUSED_COMPONENT', message: 'button component is unused' }])

  source = '<require {button} from="./foo.html">'
  assert.deepEqual(await lint(source), [{ type: 'UNUSED_COMPONENT', message: 'button component is unused' }])

  source = '<require { button } from="./foo.html"><button></button>'
  assert.deepEqual(await lint(source), [])

  source = '<require { button, input } from="./components.html">'
  assert.deepEqual(
    await lint(source),
    [
      { type: 'UNUSED_COMPONENT', message: 'button component is unused' },
      { type: 'UNUSED_COMPONENT', message: 'input component is unused' }
    ]
  )

  source = '<require { button, input } from="./components.html"><input/>'
  assert.deepEqual(await lint(source), [{ type: 'UNUSED_COMPONENT', message: 'button component is unused' }])

  source = '<require { button, input } from="./components.html"><input/><button></button>'
  assert.deepEqual(await lint(source), [])
})

test('lint: unclosed tags', async assert => {
  let source = '<div></div>'
  assert.deepEqual(await lint(source), [])

  source = '<h1>foobar<br></h1>'
  assert.deepEqual(await lint(source), [])

  source = '<import button from="./button.html"><button></button>'
  assert.deepEqual(await lint(source), [])
})

test('lint: duplicate components', async assert => {
  const source = `
    <link rel="stylesheet" type="text/css" href="/foo.css" inline>
    <link rel="stylesheet" type="text/css" href="/bar.css" inline>
  `
  assert.deepEqual(await lint(source, [
    { tagName: 'link', attributes: [{ key: 'href', value: './foo.css' }] },
    { tagName: 'link', attributes: [{ key: 'href', value: './bar.css' }] }
  ]), [])

  assert.deepEqual(await lint(source, [
    { tagName: 'link', attributes: [{ key: 'href', value: './foo.css' }] },
    { tagName: 'link', attributes: [{ key: 'href', value: './foo.css' }] }
  ]), [{ message: 'Component path duplicate: ./foo.css', type: 'COMPONENT_PATH_DUPLICATE' }])
})

test('lint: returns a warning if rel attribute is not present for an external link', async assert => {
  const source = `<a href="https://foo.bar">bar</a>`
  assert.deepEqual(await lint(source, []), [
    { message: 'a tag with external href should have a rel attribute (e.g. rel="noopener")', type: 'REL_ATTRIBUTE_MISSING' }
  ])
})

test('lint: does not return a warning for a component that uses the a tag name', async assert => {
  const source = `
    <import a from="components/a.html"/>
    <a href="https://foo.bar">bar</a>
  `
  assert.deepEqual(await lint(source, []), [])
})

test('lint: returns a warning if alt attribute is not present for an image', async assert => {
  const source = `<img src="https://foo.bar/baz.png"/>`
  assert.deepEqual(await lint(source, []), [
    { message: 'img tag should have an alt attribute', type: 'ALT_ATTRIBUTE_MISSING' }
  ])
})

test('lint: does not return a warning if alt attribute is using a translate modifier', async assert => {
  const source = `<img alt|translate="foo" src="https://foo.bar/baz.png"/>`
  assert.deepEqual(await lint(source, []), [])
})
