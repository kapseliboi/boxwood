'use strict'

const { isPlainObject } = require('pure-conditions')
const { CompilerError } = require('./errors')
const { TEMPLATE_VARIABLE, OBJECT_VARIABLE, ESCAPE_VARIABLE } = require('./enum')

module.exports = {
  getOptions: (options) => {
    const newOptions = Object.assign({
      compilers: {},
      paths: [],
      path: '.',
      languages: [],
      cache: false,
      compact: false,
      variables: {
        template: TEMPLATE_VARIABLE,
        object: OBJECT_VARIABLE,
        escape: ESCAPE_VARIABLE
      },
      aliases: [],
      styles: {},
      script: {
        paths: []
      },
      compiler: null
    }, options)
    newOptions.hooks = Object.assign({
      onBeforeFile () {},
      onAfterFile () {}
    }, options.hooks)
    return newOptions
  },
  validateOptions: ({ inline, compilers, paths, languages, cache, aliases, styles }) => {
    return [
      arePathsValid(paths),
      areCompilersValid(compilers),
      areLanguagesValid(languages),
      isCacheValid(cache),
      areAliasesValid(aliases),
      areStylesValid(styles)
    ].filter(Boolean)
  }
}

function arePathsValid (paths) {
  if (!Array.isArray(paths)) return new CompilerError('paths', 'must be an array')
  if (paths.some(path => typeof path !== 'string')) {
    return new CompilerError('paths', 'must contain only strings')
  }
  if (paths.some(path => path === '')) {
    return new CompilerError('paths', 'cannot contain empty strings')
  }
}

function areCompilersValid (compilers) {
  if (!isPlainObject(compilers)) return new CompilerError('compilers', 'must be an object')
  for (const key in compilers) {
    const compiler = compilers[key]
    if (typeof compiler !== 'function') {
      return new CompilerError('compilers', 'must contain only functions')
    }
  }
}

function areLanguagesValid (languages) {
  if (!Array.isArray(languages)) return new CompilerError('languages', 'must be an array')
  if (languages.some(language => typeof language !== 'string')) {
    return new CompilerError('languages.language', 'must be a string')
  }
  if (languages.some(language => language === '')) {
    return new CompilerError('languages.language', 'cannot contain empty strings')
  }
}

function isCacheValid (cache) {
  if (typeof cache !== 'boolean') return new CompilerError('cache', 'must be an boolean')
}

function areAliasesValid (aliases) {
  if (!Array.isArray(aliases)) return new CompilerError('aliases', 'must be an array')
  if (aliases.some(alias => !isPlainObject(alias))) {
    return new CompilerError('aliases.alias', 'must be an object')
  }
  if (aliases.some(alias => !Object.keys(alias).length)) {
    return new CompilerError('aliases.alias', 'cannot be an empty object')
  }
  for (const alias of aliases) {
    if (!('from' in alias) || !('to' in alias)) return new CompilerError('aliases.alias', 'must have "from" and "to" property')
    if (!(alias.from instanceof RegExp)) return new CompilerError('aliases.alias.from', 'must be a regexp')
    if (typeof alias.to !== 'string') return new CompilerError('aliases.alias.to', 'must be a string')
  }
}

function areStylesValid (styles) {
  const { colors } = styles
  if (!isPlainObject(styles)) return new CompilerError('styles', 'must be an object')
  if (colors && !isPlainObject(colors)) return new CompilerError('styles.colors', 'must be an object')
}
