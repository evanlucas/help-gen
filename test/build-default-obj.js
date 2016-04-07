'use strict'

const test = require('tap').test
const generate = require('escodegen').generate
const ast = require('../lib/ast')
const build = require('../lib/build-default-obj')
const vm = require('vm')

function gen(a) {
  const code = generate(ast.objectExpression(a), ast.genOpts)
  const sandbox = {}
  vm.runInNewContext(`this.out = ${code}`, sandbox)
  return sandbox.out
}

test('works with array of strings', (t) => {
  const input = [
    'id'
  , 'name'
  , 'age'
  , 'user.email'
  , 'user.name'
  ]
  const out = build(input)
  const code = gen(out)
  t.deepEqual(code, {
    id: undefined
  , name: undefined
  , age: undefined
  , user: { email: undefined, name: undefined }
  })

  t.end()
})

test('works with array of objects', (t) => {
  const id = '73545F53-5A99-4279-92C5-40424B48A242'
  const input = [
    { path: 'id', example: id }
  , { path: 'test' }
  , { path: 'age', example: 24 }
  , { path: 'archived', example: false }
  ]

  const out = build(input)
  const code = gen(out)
  t.deepEqual(code, {
    id: id
  , test: undefined
  , age: 24
  , archived: false
  })

  t.end()
})