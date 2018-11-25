import test from '../../../helpers/test'
import compile from '../../../helpers/compile'
import path from 'path'

test('script: inline strings', async assert => {
  const template = await compile(`<script inline>const foo = "bar"</script>{foo}`)
  assert.deepEqual(template({}, html => html), 'bar')
})

test('script: inline arrays', async assert => {
  const template = await compile(`<script inline>const foo = ['bar', 'baz']</script><for qux in foo>{qux}</for>`)
  assert.deepEqual(template({}, html => html), 'barbaz')
})

test('script: inline functions', async assert => {
  const template = await compile(`<script inline>const year = () => 2018</script>{year()}`)
  assert.deepEqual(template({}, html => html), '2018')
})

test('script: inline for a js file', async assert => {
  const template = await compile(`<script src="./foo.js" inline></script>`, { paths: [path.join(__dirname, '../../../fixtures/scripts')] })
  assert.deepEqual(template({}, html => html), `<script>console.log('foo')\n</script>`)
})

test('script: global inline for a js file', async assert => {
  const template = await compile(`<script src="./foo.js"></script>`, { paths: [path.join(__dirname, '../../../fixtures/scripts')], inline: ['scripts'] })
  assert.deepEqual(template({}, html => html), `<script>console.log('foo')\n</script>`)
})

test('script: inline throws if the file does not exist', async assert => {
  await assert.throws(
    compile(`<script src='./foo.js' inline></script>`, { paths: [] }),
    /Asset not found: \.\/foo\.js/
  )
})
