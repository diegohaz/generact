import { join, relative } from 'path'
import { tmpdir } from 'os'
import { remove, pathExistsSync, readFileSync } from 'fs-extra'
import {
  getComponentName,
  getComponentFolder,
  isSingleFile,
  getFiles,
  getComponentFiles,
  replaceContents,
  replicate,
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
    import ButtonComponent from '../ButtonComponent'
    import NodeButtonComponent from 'node-button-component'
    import NodeYellowButtonComponent from 'node-component/YellowButton'
    import SimpleButton from './SimpleButton'
    import { someButtonUtil } from './SimpleButtonUtils'
    import { someButtonUtil } from "./SimpleButtonUtils";
    const Button = () => <button />
    export const someButtonUtil = () => {}
    export default Button
  `

  expect(replaceContents(contents, 'Button', 'AnotherButton')).toBe(`
    import './AnotherButton.css'
    import ButtonComponent from '../ButtonComponent'
    import NodeButtonComponent from 'node-button-component'
    import NodeYellowButtonComponent from 'node-component/YellowButton'
    import SimpleButton from './SimpleAnotherButton'
    import { someButtonUtil } from './SimpleAnotherButtonUtils'
    import { someButtonUtil } from "./SimpleAnotherButtonUtils";
    const AnotherButton = () => <button />
    export const someButtonUtil = () => {}
    export default AnotherButton
  `)
})

describe('replicate', () => {
  const tmp = (path = '') => join(tmpdir(), 'generact', path)

  const root = name => join(__dirname, 'fixtures', name)

  const exec = (originalPath, newName) =>
    replicate(originalPath, { name: newName, folder: relative(process.cwd(), tmp()) })

  beforeAll(() => remove(tmp()))
  afterAll(() => remove(tmp()))

  describe('create-react-app', () => {
    describe('src/App.js', () => {
      beforeAll(done => exec(root('create-react-app/src/App.js'), 'MyComponent').then(done))

      it('created component file properly', () => {
        expect(pathExistsSync(tmp('MyComponent.js'))).toBe(true)
        expect(pathExistsSync(tmp('MyComponent.css'))).toBe(true)
        expect(pathExistsSync(tmp('MyComponent.test.js'))).toBe(true)
      })

      it('modified component contents properly', () => {
        const contents = readFileSync(tmp('MyComponent.js')).toString()

        expect(contents).toMatch(/import '.\/MyComponent.css'/)
        expect(contents).toMatch(/class MyComponent extends Component/)
        expect(contents).toMatch(/className="MyComponent"/)
        expect(contents).toMatch(/className="MyComponent-header"/)
        expect(contents).toMatch(/className="MyComponent-logo"/)
        expect(contents).toMatch(/className="MyComponent-intro"/)
        expect(contents).toMatch(/<code>src\/MyComponent.js<\/code>/)
        expect(contents).toMatch(/export default MyComponent/)
      })
    })
  })

  describe('react-static-boilerplate', () => {
    describe('components/Button', () => {
      beforeAll(done => exec(root('react-static-boilerplate/components/Button/Button.js'), 'MyComponent').then(done))

      it('created component file properly', () => {
        expect(pathExistsSync(tmp('MyComponent/MyComponent.js'))).toBe(true)
        expect(pathExistsSync(tmp('MyComponent/package.json'))).toBe(true)
      })

      it('modified package contents properly', () => {
        const contents = readFileSync(tmp('MyComponent/package.json')).toString()
        const json = JSON.parse(contents)
        expect(json.name).toBe('MyComponent')
        expect(json.main).toBe('./MyComponent.js')
      })
    })
  })
})
