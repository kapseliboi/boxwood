# boxwood

[![npm](https://img.shields.io/npm/v/boxwood.svg)](https://www.npmjs.com/package/boxwood)
[![build](https://github.com/buxlabs/boxwood/workflows/build/badge.svg)](https://github.com/buxlabs/boxwood/actions)

> Server side templating engine written in JavaScript

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [REPL](https://buxlabs.pl/en/tools/js/boxwood)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

The library is a compiler designed to generate an optimal rendering function. The function should get cached and reused to provide a much better performance than other templating languages.

It can also be used in variety of contexts, for rendering html pages, email templates, pdf templates. It's capable of importing components and partials, inlining images and styles, which can be useful in those scenarios. The syntax should be easy to read and write.

Not everything is ready yet, but long-term, the library should be able to generate a template that includes minified html with critical css/js that's required to run the page. Scoped css/js should let you build big, dynamic apps.

Server-side rendering works out of the box, and some day we'd like to include an optional runtime with a minimal footprint, which allows you to seamlessly switch to a single-page-app mode, without page reloads.

Even further in the future, the compiler is going to be split into a front-end compiler and a back-end compiler, that will use an intermediate representation to represent the app. This way it'll allow the app to be written in a different way, while preserving the performance, which will get better over time, as the compiler matures.

If this sounds great, jump on board and try it out. Every little bit helps.

### Status

Beta / Used in production / Needs security assessment

### Syntax

#### Curly Tags

`{name}` is a curly tag

Curly tags can contain expressions, e.g. `{1 + 2}` is a valid tag.
They can also contain additional filters like `{name | capitalize}`.

```html
<div>{name}</div>
```

#### Square Tags

`[color]` is a square tag

Square tags are array expressions and can be used as values of html attributes.

```html
<button class="[color, size, shape]"><slot/></button>
```

#### HTML Tags

`<if>` is an html tag

HTML tags can contain additional attributes, e.g. `<if limit is a number>` is a valid tag. The attribute syntax follows the natural language principles.

```html
<if name is present>
  Hello, {name}!
<else>
  Welcome!
<end>
```

## Install

`npm install boxwood`

## Usage

### compile

```js
const { compile, escape } = require('boxwood')

async function example () {
  const { template } = await compile('<div>{foo}</div>', { cache: false })
  console.log(template({ foo: 'bar' }, escape))
}

example()

```

### createRender

```js
const { createRender } = require('boxwood')

const render = createRender({
  cacheEnabled: process.env.NODE_ENV === 'production',
  compilerOptions: {
    paths: [
      path.join(__dirname, 'views'),
      path.join(__dirname, 'public')
    ]
  },
  globals (path, options) {
    return { domain: 'https://foo.bar' }
  }
})

// ... await render(path, options, callback?)
```

#### cacheEnabled = true

It lets you disable cache in certain conditions. You probably don't want to cache files during development.

#### compilerOptions = {}

These options are passed down to [boxwood](https://github.com/buxlabs/boxwood).

#### globals = {}

Often you have some data that can be reused in many pages. The option can be either a function that returns an object, or an object.

#### log = false

Option for displaying warnings and errors in console. By default logging is off.

## API

### Tags

#### import/require

You can import components and use them.

```html
<import layout from="./layouts/default.html">
<import { form, input, button } from="./components">

<layout>
  <h1>Hello, world!</h1>
  <form>
    <input name="foo" />
    <button>Submit</button>
  </form>
</layout>
```

It's possible to import multiple components from a given directory. Curly brackets within the import tag are optional.

You can use the special `<slot/>` tag if you want to render child nodes.

#### render/partial/include

You can also render html partials inline. It can be useful for fragments or pages like header, footer etc.

```html
<partial from="./foo.html" />
<include partial="./foo.html" />
<render partial="./foo.html" />
```

#### if/else/elseif/unless/elseunless

There are two syntaxes you can use - short and long. The short one allows you to specify the starting tags only, for example:

```html
<if foo>bar<end>
```

```html
<if foo>
  bar
<elseif baz>
  qux
<else>
  quux
<end>
```

```html
<unless foo>bar<end>
```

The long syntax requires to specify closing tags explicitly.

```html
<if foo>
  bar
</if>
<else>
  baz
</else>
```

#### for/each/foreach

The only difference between those methods is what is being used under the hood, `<for>` uses a standard for tag, `<each>` and `<foreach>` call `.each(` and `.forEach(` method of given object.

```html
<for car of cars>
  {car.brand}
</for>

<for car and index of cars>
  #{index + 1} {car.brand}
</for>

<for key and value in object>
  {key}: {value}
</for>
```

#### data

```html
<data yaml>
title: Hello, world!
subtitle: Hey!
</data>
<layout {title}>
  {subtitle}
</layout>
```

### Filters

There are many filters available out of the box.

```html
{title | capitalize}
{title | uppercase}
```

Filters can be chained too.

```html
{title | trim | classify}
```

Params can be passed as well.

```html
{title | slugify('_')}
```

Full list of filters is available [here](https://buxlabs.pl/en/tools/js/pure-utilities/repl).

### Attributes

#### element[padding|margin|border]

Custom spacing is often a problem, so you can add paddings, margins and borders using a shorter syntax.

```html
<div padding-bottom="1rem"></div>
```

#### element[css|style]

You can define styles as objects too.

```html
<div css="{{ padding: { bottom: '1rem', top: '2rem' } }}"></div>
```

#### element[partial]

Partial attribute will load the html file and include as the children of given node. The tag will be preserved.

```html
<head partial="./head.html"></head>
```

#### img[inline]

It's possible to inline images as base64 strings.

```html
<img src="images/foo.png" inline>
```

### Styles

#### scoped

Scoped styles are adding special `scope-${number}` classes to both html and css to ensure they're unique.

```html
<div class="foo">bar</div>
<style scoped>
.foo {
  color: red;
}
</style>
```

### Scripts

#### compiler

You can hook up any compiler, which will transform and inline the source code.

```html
<div id="app"></div>
<script compiler="preact">
import { render } from "preact"
const Foo = ({ bar }) => {
  return (<span>{bar}</span>)
}
render(
  <Foo bar="baz" />,
  document.getElementById("app")
)
</script>
```

### Variables

#### globals

You can reference the parameters that were passed to the template via the `globals` object too. It might be useful is some scenarios but sending params explicitly is usually better.

```html
<!-- layouts/partials/head.html - layouts/default.html - pages/about/index.html  -->
<!-- you could send stylesheets explicitly, but it could -->
<!-- get annoying if the layout is used in many places -->

<head>
  <for stylesheet in globals.stylesheets>
    <link rel="stylesheet" type="text/css" href="{stylesheet}">
  </for>
</head>
```

### Internationalization

#### translate tag

You can keep translations in every file. They're scoped so you can use same names in multiple files. Translations can be kept in `data` tags.

```html
<h1><translate hello/></h1>
<data yaml>
i18n:
  hello:
    pl: Hej
    en: Hello
</data>
```

You also need to pass `languages` to the compiler. The template needs to get the `language` to know which text to render.

```js
// ...
const { template } = await compile(source, { languages: ['pl', 'en'] })
const html = template({ language: 'en' }, escape)
// ...
```

#### translation tag

For more complicated texts, you can also use inline translations.

```html
<translation pl>
  <p>Hej! Lorem ipsum dolor <span>sit amet</span>.</p>
</translation>
<translation en>
  <p>Hello! Lorem ipsum dolor <span>sit amet</span>.</p>
</translation>
```

## Maintainers

[@emilos](https://github.com/emilos)

## Contributing

All contributions are highly appreciated. Please feel free to open new issues and send PRs.

## License

MIT
