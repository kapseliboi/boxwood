'use strict'

const { join } = require('path')
const walk = require('himalaya-walk')
const { parse } = require('./html')
const { isCurlyTag, isImportTag, isPartialTag } = require('./string')
const { parse: cssParse, walk: cssWalk } = require('css-tree')
const { isFileSupported } = require('./files')
const { unwrap } = require('pure-utilities/string')
const { hasExtension } = require('pure-conditions')

function hasShorthandSyntax (node) {
  return !!node.attributes.filter(attribute => attribute.key.includes('{') || attribute.key.includes('}')).length
}

function getAssetPath ({ attributes }, name) {
  const node = attributes.find(({ key }) => key === 'from' || key === 'partial' || key === 'src' || key === 'href')
  if (!node) return null
  const path = node.value
  if (hasExtension(path)) { return path }
  return join(path, `${name}.html`)
}

function getAssetPaths (node, name) {
  if (isStyleWithInlineAttribute(node)) {
    return getAssetPathsFromStyleTag(node)
  } else if (isTemplateTag(node)) {
    const { content } = node.children[0]
    const tree = parse(content)
    let paths = []
    walk(tree, leaf => {
      if (leaf.tagName === 'style') {
        paths = paths.concat(getAssetPathsFromStyleTag(leaf))
      }
    })
    return paths
  }
  return [getAssetPath(node, name)].filter(Boolean)
}

function getAssetPathsFromStyleTag (node) {
  const paths = []
  const { content } = node.children[0]
  const tree = cssParse(content)
  cssWalk(tree, node => {
    if (node.type === 'Url') {
      let { type, value } = node.value
      value = value.replace(/'|"/g, '')
      if ((type === 'Raw' || type === 'String') && isFileSupported(value)) {
        paths.push(value)
      }
    }
  })
  return paths
}

function hasPartialAttribute (node) {
  return !!(node.attributes && node.attributes.find(attribute => attribute.key === 'partial'))
}

function isScriptWithInlineAttribute (node) {
  return node.tagName === 'script' && node.attributes.find(attribute => attribute.key === 'inline') &&
    node.attributes.find(attribute => attribute.key === 'src')
}

function isLinkWithInlineAttribute (node) {
  return node.tagName === 'link' && node.attributes.find(attribute => attribute.key === 'inline')
}

function isStyleWithInlineAttribute (node) {
  return node.tagName === 'style' && node.attributes.find(attribute => attribute.key === 'inline')
}

function isFontWithInlineAttribute (node) {
  return node.tagName === 'font' && node.attributes.find(attribute => attribute.key === 'inline')
}

function isImageTagWithInlineAttribute (node) {
  return node.tagName === 'img' && node.attributes.find(attribute => attribute.key === 'inline')
}

function isImageTagWithAutoWidthAttribute (node) {
  return node.tagName === 'img' && node.attributes.find(attribute => attribute.key === 'width' && attribute.value === 'auto')
}

function isImageTagWithAutoHeightAttribute (node) {
  return node.tagName === 'img' && node.attributes.find(attribute => attribute.key === 'height' && attribute.value === 'auto')
}

function isScriptTagWithI18nAttribute (node) {
  return node.tagName === 'script' && node.attributes.find(attribute => attribute.key === 'i18n') && node.attributes.find(attribute => attribute.key === 'from')
}

function isI18nTag (node) {
  return node.tagName === 'i18n' && node.attributes.find(attribute => attribute.key === 'from')
}

function isTemplateTag (node) {
  return node.tagName === 'template' && node.attributes.length > 0
}

function isImageNode (node, options) {
  return !!(
    isImageTagWithInlineAttribute(node) ||
    isImageTagWithAutoHeightAttribute(node) ||
    isImageTagWithAutoWidthAttribute(node)
  )
}

function getImportNodes (tree, options) {
  const nodes = []
  walk(tree, node => {
    if (isImportTag(node.tagName)) {
      nodes.push({ node, kind: 'IMPORT' })
    } else if (isPartialTag(node.tagName) || hasPartialAttribute(node)) {
      nodes.push({ node, kind: 'PARTIAL' })
    } else if (isScriptWithInlineAttribute(node)) {
      nodes.push({ node, kind: 'SCRIPT' })
    } else if (isLinkWithInlineAttribute(node) || isStyleWithInlineAttribute(node) || isFontWithInlineAttribute(node)) {
      nodes.push({ node, kind: 'STYLESHEET' })
    } else if (isImageNode(node, options)) {
      nodes.push({ node, kind: 'IMAGE' })
    } else if (isScriptTagWithI18nAttribute(node) || isI18nTag(node)) {
      nodes.push({ node, kind: 'TRANSLATION' })
    } else if (isTemplateTag(node)) {
      nodes.push({ node, kind: 'TEMPLATE' })
    }
  })
  return nodes
}

function normalizeAttributes (attributes) {
  return attributes.map(attribute => {
    if (isCurlyTag(attribute.key) && attribute.value === null) {
      attribute.value = attribute.key
      attribute.key = unwrap(attribute.key, '{', '}')
    } else if (attribute.value === null) { attribute.value = '{true}' }
    return attribute
  })
}

module.exports = {
  hasShorthandSyntax,
  getAssetPath,
  getAssetPaths,
  getImportNodes,
  isImageNode,
  normalizeAttributes
}
