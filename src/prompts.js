// @flow
import { isAbsolute, relative } from 'path'
import type { InquirerFile } from './types'

export const component = (files: InquirerFile[]): {} => ({
  type: 'autocomplete',
  name: 'component',
  message: 'Which component do you want to replicate?',
  source: (_, input) =>
    Promise.resolve(
      files.filter(file => !input || file.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    ),
})

export const name = (originalName: string): {} => ({
  type: 'input',
  name: 'name',
  message: `How do you want to name ${originalName} component?`,
  default: originalName,
})

export const folder = (originalFolder: string): {} => ({
  type: 'input',
  name: 'folder',
  message: answers => `In which folder do you want to put ${answers.name} component?`,
  default: originalFolder,
  filter: input => (isAbsolute(input) ? relative(process.cwd(), input) : input),
})
