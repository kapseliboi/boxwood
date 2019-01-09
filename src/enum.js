module.exports = {
  TEMPLATE_VARIABLE: '__t',
  OBJECT_VARIABLE: '__o',
  ESCAPE_VARIABLE: '__e',
  GLOBAL_VARIABLES: ['JSON', 'Math', 'Number', 'console', 'Date'],
  BOOLEAN_ATTRIBUTES: [
    'async',
    'autofocus',
    'autoplay',
    'border',
    'challenge',
    'checked',
    'compact',
    'contenteditable',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'frameborder',
    'hidden',
    'indeterminate',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nohref',
    'noresize',
    'noshade',
    'novalidate',
    'nowrap',
    'open',
    'readonly',
    'required',
    'reversed',
    'scoped',
    'scrolling',
    'seamless',
    'selected',
    'sortable',
    'spellcheck',
    'translate'
  ],
  SELF_CLOSING_TAGS: [
    'area', 'base', 'br', 'col', 'command',
    'embed', 'hr', 'img', 'input', 'keygen', 'link',
    'meta', 'param', 'source', 'track', 'wbr', '!doctype'
  ],
  SPECIAL_TAGS: [
    'if',
    'else',
    'elseif',
    'each',
    'for',
    'slot',
    'yield',
    'try',
    'catch',
    'unless',
    'elseunless',
    'switch',
    'case',
    'default',
    'foreach',
    'import',
    'require',
    'partial',
    'render',
    'include',
    'content'
  ],
  UNESCAPED_NAMES: [
    'value',
    'checked',
    'readonly',
    'disabled',
    'autofocus',
    'formnovalidate',
    'multiple',
    'required',
    'html'
  ],
  OPERATORS: [
    'or',
    'and'
  ],
  RESERVED_KEYWORDS: [
    'class',
    'for'
  ],
  VOID_TAGS: [
    'import',
    'require',
    'translate'
  ]
}
