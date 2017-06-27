// @flow
import { dirname, join, relative } from 'path'
import { camelCase, upperFirst } from 'lodash'
import { gray } from 'chalk'
import glob from 'glob'
import listReactFiles from 'list-react-files'
import type { InquirerFile } from './types'

const removeExt = path => path.replace(/\.[^.]+$/, '')

export const getComponentName = (path: string): string => (
  path.split('/').reduce((name, part) => {
    if (/^[A-Z]/.test(part)) {
      return removeExt(part)
    } else if (/^((?!index).+)\.[^.]+$/.test(part)) {
      return upperFirst(camelCase(removeExt(part)))
    }
    return name
  }, '')
)

export const getComponentFolder = (path: string): string => {
  const name = getComponentName(path)
  return dirname(path).split('/').reduce((folder, part) => {
    if (removeExt(part) === name) {
      return folder
    }
    return join(folder, part)
  }, './')
}

export const isSingleFile = (path: string): boolean => {
  const name = getComponentName(path)
  const [dir] = dirname(path).split('/').reverse()

  return dir !== name
}

export const getFiles = (cwd: string, componentName?: string): string[] => {
  const extensions = '{js,ts,jsx,tsx,css,less,scss,sss,json}'
  const pattern = componentName ? `**/${componentName}{.,.*.}${extensions}` : `**/*.${extensions}`
  return glob.sync(pattern, { cwd, absolute: true, nodir: true })
}

export const getComponentFiles = (root: string): Promise<InquirerFile[]> => (
  listReactFiles(root).then((files: string[]) =>
    files.map((path: string): InquirerFile => {
      const name = getComponentName(path)
      const absolutePath = join(root, path)
      const relativePath = relative(process.cwd(), absolutePath)
      return {
        name: `${name} ${gray(relativePath)}`,
        short: name,
        value: absolutePath,
      }
    })
  )
)

export const replaceContents = (
  contents: string,
  oldName: string,
  newName: string
): string => contents.replace(
  new RegExp(`([^a-zA-Z0-9_$])${oldName}([^a-zA-Z0-9_$]|Container)`, 'g'),
  `$1${newName}$2`
)
