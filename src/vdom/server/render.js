'use strict'

const css = require('../utilities/css')
const escape = require('../utilities/escape')
const { SELF_CLOSING_TAGS } = require('../../utilities/enum')

function render (node) {
  if (Array.isArray(node)) {
    const children = node.map(tag => {
      return render(tag)
    })
    return children.join('')
  }
  if (typeof node === 'string') {
    return escape(node)
  }
  if (typeof node === 'number') {
    return node
  }
  return renderElement(node)
}

function renderValue (key, value) {
  if (key === 'style') {
    return css(value)
  }
  return value
}

function isEventHandler (key) {
  return ['onclick', 'onblur', 'onfocus'].includes(key)
}

function renderElement (node) {
  if (!node) { return }
  const { name, attributes, children } = node
  const element = { attributes: [], children: '' }

  for (const key in attributes) {
    const value = attributes[key]
    if (typeof value === 'boolean') {
      if (value) {
        element.attributes.push(key)
      } else {
        continue
      }
    } else if (isEventHandler(key)) {
      continue
    } else {
      element.attributes.push(`${key}="${renderValue(key, value)}"`)
    }
  }

  for (let i = 0, ilen = children.length; i < ilen; i++) {
    const child = children[i]
    element.children += render(child)
  }

  const attrs = element.attributes.length > 0 ? ` ${element.attributes.join(' ')}` : ''
  if (SELF_CLOSING_TAGS.includes(name.toLowerCase())) {
    return `<${name}${attrs}>`
  }
  return `<${name}${attrs}>${element.children}</${name}>`
}

module.exports = render
