import { join } from 'path'
import { tmpdir } from 'os'
import { remove, pathExistsSync, readFileSync } from 'fs-extra'
import suppose from 'suppose'

const moveDown = (times = 1) => {
  const downChars = '\x1B\x5B\x42'
  let chars = ''
  for (let i = 0; i < times; i += 1) chars += downChars
  return chars
}

const tmp = (path = '') => join(tmpdir(), 'generact', path)

const root = name => ['--root', join(__dirname, 'fixtures', name)]

const exec = (args, { component, name }) => new Promise((resolve, reject) => {
  suppose(join(__dirname, '../dist/cli.js'), args)
    .when(/Which component/, `${component}\n`)
    .when(/How do you want to name/, `${name}\n`)
    .when(/In which folder/, tmp())
    .on('error', reject)
    .end(resolve)
})

beforeAll(() => remove(tmp()))
afterAll(() => remove(tmp()))

describe('create-react-app', () => {
  describe('src/App.js', () => {
    beforeAll(() => exec(root('create-react-app'), { component: '', name: 'MyComponent' }))

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

  describe('src/components/Button', () => {
    beforeAll(() => exec(root('create-react-app'), { component: moveDown(), name: 'AnotherButton' }))

    it('created component files properly', () => {
      expect(pathExistsSync(tmp('AnotherButton/AnotherButton.js'))).toBe(true)
      expect(pathExistsSync(tmp('AnotherButton/AnotherButton.test.js'))).toBe(true)
      expect(pathExistsSync(tmp('AnotherButton/AnotherButton.css'))).toBe(true)
    })
  })
})

describe('react-static-boilerplate', () => {
  describe('components/Button', () => {
    beforeAll(() => exec(root('react-static-boilerplate'), { component: '', name: 'MyComponent' }))

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
