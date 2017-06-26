import { join } from 'path'
import {
  getComponentName,
  getComponentFolder,
  isSingleFile,
  getFiles,
  getComponentFiles,
  replaceContents,
} from '../src/utils'

test('getComponentName', () => {
  expect(getComponentName('src/components/Foo/index.js')).toBe('Foo')
  expect(getComponentName('src/components/Foo/index.jsx')).toBe('Foo')
  expect(getComponentName('src/components/Foo/index.ts')).toBe('Foo')
  expect(getComponentName('src/components/Foo/index.tsx')).toBe('Foo')
  expect(getComponentName('src/components/Foo.js')).toBe('Foo')
  expect(getComponentName('src/components/Foo/Foo.js')).toBe('Foo')
  expect(getComponentName('src/components/Foo/Bar.js')).toBe('Bar')
  expect(getComponentName('src/components/FooBar.js')).toBe('FooBar')
  expect(getComponentName('src/components/Foo/index.jsx')).toBe('Foo')
  expect(getComponentName('src/components/foo-bar.jsx')).toBe('FooBar')
  expect(getComponentName('src/components/foo-bar.tsx')).toBe('FooBar')
})

test('getComponentFolder', () => {
  expect(getComponentFolder('src/components/Foo/index.js')).toBe('src/components')
  expect(getComponentFolder('src/components/Foo/Foo.js')).toBe('src/components')
  expect(getComponentFolder('src/Bar/Foo/Foo.js')).toBe('src/Bar')
  expect(getComponentFolder('src/components/foo-bar.jsx')).toBe('src/components')
})

test('isSingleFile', () => {
  expect(isSingleFile('src/components/Foo/index.js')).toBe(false)
  expect(isSingleFile('src/components/Foo/index.jsx')).toBe(false)
  expect(isSingleFile('src/components/Foo/Foo.js')).toBe(false)
  expect(isSingleFile('src/components/Foo.js')).toBe(true)
  expect(isSingleFile('src/components/Foo/Bar.js')).toBe(true)
  expect(isSingleFile('src/components/foo-bar.jsx')).toBe(true)
  expect(isSingleFile('src/components/FooBar/foo-bar.jsx')).toBe(false)
})

describe('getFiles', () => {
  test('Button', () => {
    const cwd = join(__dirname, 'fixtures/create-react-app/src/components/Button')
    expect(getFiles(cwd)).toEqual([
      join(cwd, 'Button.css'),
      join(cwd, 'Button.js'),
      join(cwd, 'Button.test.js'),
    ])
  })

  test('App', async () => {
    const cwd = join(__dirname, 'fixtures/create-react-app/src')
    expect(getFiles(cwd, 'App')).toEqual([
      join(cwd, 'App.css'),
      join(cwd, 'App.js'),
      join(cwd, 'App.test.js'),
    ])
  })

  test('Link', async () => {
    const cwd = join(__dirname, 'fixtures/react-static-boilerplate/components/Link')
    expect(getFiles(cwd)).toEqual([
      join(cwd, 'Link.js'),
      join(cwd, 'package.json'),
    ])
  })
})

test('getComponentFiles', async () => {
  expect(await getComponentFiles(join(__dirname, 'fixtures/create-react-app'))).toEqual([{
    name: expect.stringMatching(/App/),
    short: 'App',
    value: join(__dirname, 'fixtures/create-react-app/src/App.js'),
  }, {
    name: expect.stringMatching(/Button/),
    short: 'Button',
    value: join(__dirname, 'fixtures/create-react-app/src/components/Button/Button.js'),
  }])
})

test('replaceContents', () => {
  const contents = `
    import './Button.css'
    import SimpleButton from './SimpleButton'
    const Button = () => <button />
    export default Button
  `

  expect(replaceContents(contents, 'Button', 'AnotherButton')).toBe(`
    import './AnotherButton.css'
    import SimpleButton from './SimpleButton'
    const AnotherButton = () => <button />
    export default AnotherButton
  `)
})
