const test = require('ava')
const { join } = require('path')
const compile = require('../../helpers/deprecated-compile')
const { escape } = require('../../..')


test('for', async assert => {
  var { template } = await compile('<ul><for todo in todos><li>{todo.description}</li></for></ul>')
  assert.deepEqual(template({
    todos: [
      { description: 'foo' },
      { description: 'bar' },
      { description: 'baz' },
      { description: 'qux' }
    ]
  }, escape), '<ul><li>foo</li><li>bar</li><li>baz</li><li>qux</li></ul>')

  var { template } = await compile('<ul><for foo in bar><li>{foo.baz}</li></for></ul>')
  assert.deepEqual(template({
    bar: [
      { baz: 'foo' },
      { baz: 'bar' },
      { baz: 'baz' },
      { baz: 'qux' }
    ]
  }, escape), '<ul><li>foo</li><li>bar</li><li>baz</li><li>qux</li></ul>')

  var { template } = await compile('<ul><for foo in bar><for baz in foo><li>{baz.qux}</li></for></for></ul>')
  assert.deepEqual(template({
    bar: [
      [ { qux: 1 }, { qux: 2 } ],
      [ { qux: 3 }, { qux: 4 } ],
      [ { qux: 5 }, { qux: 6 } ]
    ]
  }, escape), '<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li></ul>')

  var { template } = await compile('<ul><for foo in bar><for baz in foo.qux><li>{baz}</li></for></for></ul>')
  assert.deepEqual(template({
    bar: [
      { qux: [1, 2] },
      { qux: [3, 4] },
      { qux: [5, 6] }
    ]
  }, escape), '<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li></ul>')

  var { template } = await compile('<ul><for todo in todos><li>{todo.text}</li></for></ul>')
  assert.deepEqual(template({
    todos: [
      { text: 'foo' },
      { text: 'bar' },
      { text: 'baz' }
    ]
  }, escape), '<ul><li>foo</li><li>bar</li><li>baz</li></ul>')

  var { template } = await compile('<ul><for a in b><li>{a.b}</li></for></ul>')
  assert.deepEqual(template({
    b: [
      { b: 'foo' },
      { b: 'bar' }
    ]
  }, escape), '<ul><li>foo</li><li>bar</li></ul>')

  var { template } = await compile('<ul><for t in b><li>{t.b}</li></for></ul>')
  assert.deepEqual(template({
    b: [
      { b: 'foo' },
      { b: 'bar' }
    ]
  }, escape), '<ul><li>foo</li><li>bar</li></ul>')

  var { template } = await compile('<ul><for o in b><li>{o.b}</li></for></ul>')
  assert.deepEqual(template({
    b: [
      { b: 'foo' },
      { b: 'bar' }
    ]
  }, escape), '<ul><li>foo</li><li>bar</li></ul>')

  var { template } = await compile('<ul><for e in b><li>{e.b}</li></for></ul>')
  assert.deepEqual(template({
    b: [
      { b: 'foo' },
      { b: 'bar' }
    ]
  }, escape), '<ul><li>foo</li><li>bar</li></ul>')

  var { template } = await compile('<for foo in foos><img src="{foo.src}"></for>')
  assert.deepEqual(template({
    foos: [
      { title: 'foo', src: 'foo.jpg' },
      { title: 'bar', src: 'bar.jpg' }
    ]
  }, escape), '<img src="foo.jpg"><img src="bar.jpg">')

  var { template } = await compile('<for foo in foos><if foo.src><img src="{foo.src}"></if></for>')
  assert.deepEqual(template({
    foos: [
      { title: 'foo', src: 'foo.jpg' },
      { title: 'bar', src: null }
    ]
  }, escape), '<img src="foo.jpg">')

  var { template } = await compile('<for foo in foos><if foo.src><img src="{foo.src}"></if></for>')
  assert.deepEqual(template({
    foos: [
      { title: 'foo', src: 'foo.jpg' },
      { title: 'bar', src: null }
    ]
  }, escape), '<img src="foo.jpg">')

  var { template } = await compile('<for foo in foos><if foo.src><img src="{foo.src}"></if><elseif foo.href><a href="{foo.href}"></a></elseif></for>')
  assert.deepEqual(template({
    foos: [
      { title: 'foo', src: 'foo.jpg', href: null },
      { title: 'bar', src: null, href: null },
      { title: 'baz', src: null, href: 'https://buxlabs.pl' }
    ]
  }, escape), '<img src="foo.jpg"><a href="https://buxlabs.pl"></a>')

  var { template } = await compile('{foo}<for foo in bar><div>{foo.baz}</div></for>')
  assert.deepEqual(template({
    foo: 'bar',
    bar: [
      { baz: 'qux' },
      { baz: 'quux' },
      { baz: 'quuux' }
    ]
  }, escape), 'bar<div>qux</div><div>quux</div><div>quuux</div>')

  var { template } = await compile('<div>{foo}<for foo in bar><div>{foo.baz}</div></for></div>')
  assert.deepEqual(template({
    foo: 'bar',
    bar: [
      { baz: 'qux' },
      { baz: 'quux' },
      { baz: 'quuux' }
    ]
  }, escape), '<div>bar<div>qux</div><div>quux</div><div>quuux</div></div>')

  var { template } = await compile('<div>{foo}</div><for foo in bar><div>{foo.baz}</div></for>')
  assert.deepEqual(template({
    foo: 'bar',
    bar: [
      { baz: 'qux' },
      { baz: 'quux' },
      { baz: 'quuux' }
    ]
  }, escape), '<div>bar</div><div>qux</div><div>quux</div><div>quuux</div>')

  var { template } = await compile('<for foo in bar><div>{foo.baz}</div></for><div>{foo}</div>')
  assert.deepEqual(template({
    foo: 'bar',
    bar: [
      { baz: 'qux' },
      { baz: 'quux' },
      { baz: 'quuux' }
    ]
  }, escape), '<div>qux</div><div>quux</div><div>quuux</div><div>bar</div>')

  var { template } = await compile('<ul><for todo in="{todos}"><li>{todo.description}</li></for></ul>')
  assert.deepEqual(template({
    todos: [
      { description: 'foo' },
      { description: 'bar' },
      { description: 'baz' },
      { description: 'qux' }
    ]
  }, escape), '<ul><li>foo</li><li>bar</li><li>baz</li><li>qux</li></ul>')

  var { template } = await compile('<ul><for foo in="{bar}"><for baz in="{foo.qux}"><li>{baz}</li></for></for></ul>')
  assert.deepEqual(template({
    bar: [
      { qux: [1, 2] },
      { qux: [3, 4] },
      { qux: [5, 6] }
    ]
  }, escape), '<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li></ul>')

  var { template } = await compile('<for baz in qux>{foo({ bar: baz })}</for>')
  assert.deepEqual(template({
    foo: object => object.bar, qux: ['qux', 'quux']
  }, escape), 'quxquux')

  var { template } = await compile('<for doc in docs><for foo in doc.items>{foo.bar.baz.qux.quux}</for></for>')
  assert.deepEqual(template({
    docs: [
      { items: [{ bar: { baz: { qux: { quux: '1' } } } }] },
      { items: [{ bar: { baz: { qux: { quux: '2' } } } }] },
      { items: [{ bar: { baz: { qux: { quux: '3' } } } }] }
    ]
  }, escape), '123')

  var { template } = await compile('<for doc in docs>{doc.name}<for key and value in doc.items>{key}{value}</for></for>')
  assert.deepEqual(template({
    docs: [
      { name: 'foo', items: { bar: 'baz', qux: 'quux' } }
    ]
  }, escape), 'foobarbazquxquux')

  var { template } = await compile('<for number in range="0...10">{number}</for>')
  assert.deepEqual(template({}, escape), '0123456789')

  var { template } = await compile('<for number in range="0..10">{number}</for>')
  assert.deepEqual(template({}, escape), '012345678910')

  var { template } = await compile('<for number in range="10">{number}</for>')
  assert.deepEqual(template({}, escape), '012345678910')

  var { template } = await compile('<for month in="{["Styczeń", "Luty", "Marzec"]}">{month}</for>')
  assert.deepEqual(template({}, escape), 'StyczeńLutyMarzec')

  var { template } = await compile('<for foo in="{[bar, baz]}">{foo}</for>')
  assert.deepEqual(template({ bar: 'bar', baz: 'baz' }, escape), 'barbaz')

  var { template } = await compile(`<for foo in='{[{ key: 'bar' }, { key: 'baz' }]}'>{foo.key}</for>`)
  assert.deepEqual(template({ bar: 'bar', baz: 'baz' }, escape), 'barbaz')

  var { template } = await compile(`{baz}<for foo in bar><for baz in foo>{baz.quz}</for></for>{baz}`)
  assert.deepEqual(template({
    bar: [ [{ quz: 1 }], [{ quz: 2 }] ],
    baz: 'qux'
  }, escape), 'qux12qux')

  var { template } = await compile(`{baz}<for foo in bar><for baz in foo.quz>{baz}</for></for>{baz}`)
  assert.deepEqual(template({
    bar: [ { quz: [1, 2, 3] }, { quz: [4, 5, 6] } ],
    baz: 'qux'
  }, escape), 'qux123456qux')

  var { template } = await compile(`<for key and value in foo>{key}{value}</for>`)
  assert.deepEqual(template({ foo: { bar: 'baz', ban: 'qux' } }, escape), 'barbazbanqux')

  var { template } = await compile(`<for key and value in="{foo}">{key}{value}</for>`)
  assert.deepEqual(template({ foo: { bar: 'baz', ban: 'qux' } }, escape), 'barbazbanqux')

  var { template } = await compile(`<for key and value in foo>{key}</for>`)
  assert.deepEqual(template({ foo: { a: 1, b: 2, c: 3 } }, escape), 'abc')

  var { template } = await compile(`<for key and value in foo>{foo[key]}</for>`)
  assert.deepEqual(template({ foo: { a: 1, b: 2, c: 3 } }, escape), '123')

  var { template } = await compile(`
    <for key and value in objects>
      <for key and value in value>
        {value}
      </for>
    </for>
  `)
  assert.deepEqual(template({
    objects: {
      a: { foo: 'foo' },
      b: { bar: 'bar' },
      c: { baz: 'baz' }
    }
  }, escape), 'foobarbaz')
})

test('for: dynamic range', async assert => {
  var { template } = await compile(`<for number in range="[start, end]">{number}</for>`)
  assert.deepEqual(template({ start: 0, end: 3 }, escape), '012')

  var { template } = await compile(`<for number in range="[0, end]">{number}</for>`)
  assert.deepEqual(template({ end: 3 }, escape), '012')

  var { template } = await compile(`<for number in range="[start, 3]">{number}</for>`)
  assert.deepEqual(template({ start: 0 }, escape), '012')

  var { template } = await compile(`<for number in range="[0, 3]">{number}</for>`)
  assert.deepEqual(template({}, escape), '012')

  var { template } = await compile(`<for number in range="[start, start + 3]">{number}</for>`)
  assert.deepEqual(template({ start: 0 }, escape), '012')

  var { template } = await compile(`<for number in range="[start + 1, start + 3]">{number}</for>`)
  assert.deepEqual(template({ start: 0 }, escape), '12')

  var { template } = await compile(`<for number in range="[foo.bar, foo.baz]">{number}</for>`)
  assert.deepEqual(template({ foo: { bar: 0, baz: 3 } }, escape), '012')

  var { template } = await compile(`<for number in range="[foo[0], foo[1]]">{number}</for>`)
  assert.deepEqual(template({ foo: [0, 3]}, escape), '012')

  var { template } = await compile(`<for number in range="[foo[bar], foo[baz]]">{number}</for>`)
  assert.deepEqual(template({ foo: { bar: 5, baz: 8 }, bar: 'bar', baz: 'baz' }, escape), '567')

  var { template } = await compile(`<for number in range="[foo['bar'], foo['baz']]">{number}</for>`)
  assert.deepEqual(template({ foo: { bar: 5, baz: 8 } }, escape), '567')

  var { template } = await compile(`<for number in range="[foo[bar.baz], foo[bar.ban]]">{number}</for>`)
  assert.deepEqual(template({
    foo: {
      baz: 5,
      ban: 8
    },
    bar: {
      baz: 'baz',
      ban: 'ban',
    }
  }, escape), '567')

  var { template } = await compile(`<for number in range="[foo.bar[bar.baz.ban], foo.bar[bar.baz.qux]]">{number}</for>`)
  assert.deepEqual(template({
    foo: {
      bar: {
        ban: 1,
        qux: 5
      }
    },
    bar: {
      baz: {
        ban: 'ban',
        qux: 'qux'
      }
    }
  }, escape), '1234')
})

test('for: computed member expressions', async assert => {
  const { template } = await compile(`
    <for section of pages[name].sections>
      {section}
    </for>
  `)
  assert.deepEqual(template({ name: 'foo', pages: { foo: { sections: ['bar', 'baz'] } } }, escape), 'barbaz')
})

test('for: components in a loop', async assert => {
  const { template } = await compile(`
    <import price from="components/price.html" />

    <for product in products>
      <price {product}/>
    </for>
  `, {
    paths: [join(__dirname, '../../fixtures')],
    languages: ['pl', 'en', 'de']
  })
  const products = [
    {
      prices: {
        PLN: 0.99,
        GBP: 0.99,
        EUR: 0.99
      }
    }
  ]
  assert.deepEqual(template({ language: 'pl', products }, escape), '0,99 zł')
})

