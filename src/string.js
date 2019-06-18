const { ltrim } = require('pure-utilities/string')
const lexer = require('./lexer')

function curlyTag (string) {
  return `{${string}}`
}

function isTag (value, startTag, endTag) {
  return value && value.startsWith(startTag) && value.endsWith(endTag)
}

function containsTag (value, startTag, endTag) {
  return value && value.includes(startTag) && value.includes(endTag)
}

function isCurlyTag (value) {
  return isTag(value, '{', '}')
}

function isSquareTag (value) {
  return isTag(value, '[', ']')
}

function containsCurlyTag (value) {
  return containsTag(value, '{', '}')
}

function getTagValue (value) {
  return value.substring(1, value.length - 1)
}

function extract (value) {
  const tokens = lexer(value.trim().replace(/\n/g, ''))
  const objects = tokens.map((token, index) => {
    if (token.type === 'expression') {
      // TODO
      // what about {(foo || bar) | capitalize} ?
      if (token.value.includes('|') && !token.value.includes('||')) {
        let parts = token.value.split('|').map(string => string.trim())
        token.value = `{${parts[0]}}`
        token.filters = parts.slice(1)
      } else {
        token.value = `{${token.value}}`
      }
    } else if (token.type === 'text') {
      const previous = tokens[index - 1]
      if (!previous || previous.type !== 'expression') {
        token.value = ltrim(token.value)
      }
    }
    return token
  })
  return objects.filter(object => !!object.value)
}

function extractValues (attribute) {
  return extract(attribute.value)
    .reduce((values, { value }) => {
      if (isCurlyTag(value)) {
        values.push(value.trim())
      } else {
        const parts = value.split(/\s+/g)
        parts.forEach(part => values.push(part))
      }
      return values
    }, [])
}

function getName (name) {
  if (name.endsWith('|bind')) {
    return name.substring(0, name.length - 5)
  }
  return name
}

function isImportTag (name) {
  return name === 'import' || name === 'require'
}

module.exports = {extract, extractValues, getName, isCurlyTag, isSquareTag, containsCurlyTag, getTagValue, curlyTag, isImportTag}
