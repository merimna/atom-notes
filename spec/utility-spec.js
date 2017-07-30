/** @babel */

import fs from 'fs-plus'
import path from 'path'
import temp from 'temp'

import * as Utility from '../lib/utility'

temp.track()

describe('Utility', () => {
  let defaultDirectory = atom.config.get(`${Utility.packageName}.directory`)
  let defaultNoteExtensions = atom.config.get(`${Utility.packageName}.extensions`)

  afterEach(() => {
    atom.config.set(`${Utility.packageName}.directory`, defaultDirectory)
    atom.config.set(`${Utility.packageName}.extensions`, defaultNoteExtensions)
  })

  describe('getPrimaryNoteExtension', () => {
    it('test suite', () => {
      atom.config.set(`${Utility.packageName}.extensions`, ['.md', '.markdown'])
      expect(Utility.getPrimaryNoteExtension()).toBe('.md')
      atom.config.set(`${Utility.packageName}.extensions`, ['.markdown'])
      expect(Utility.getPrimaryNoteExtension()).toBe('.markdown')
      atom.config.set(`${Utility.packageName}.extensions`, [])
      expect(Utility.getPrimaryNoteExtension()).toBe('.md')
    })
  })

  describe('isNote', () => {
    it('handles symlinks correctly', () => {
      atom.config.set(`${Utility.packageName}.extensions`, ['.md', '.markdown'])

      let tempDirectoryPath = path.join(temp.mkdirSync())
      let notesDirectoryPath = path.join(temp.mkdirSync())
      let notesDirectoryPathSymlink = path.join(tempDirectoryPath, 'note book')
      let notePath = path.join(notesDirectoryPath, 'note.md')
      let notePathSymlink = path.join(notesDirectoryPathSymlink, 'note symlink.md')

      fs.writeFileSync(notePath, 'dummy')
      fs.symlinkSync(notesDirectoryPath, notesDirectoryPathSymlink)
      fs.symlinkSync(notePath, notePathSymlink)

      expect(fs.existsSync(notePath)).toBe(true)
      expect(fs.existsSync(fs.normalize(notePath))).toBe(true)

      atom.config.set(`${Utility.packageName}.directory`, notesDirectoryPath)
      expect(Utility.isNote(notePath)).toBe(true)
      expect(Utility.isNote(notePathSymlink)).toBe(true)

      atom.config.set(`${Utility.packageName}.directory`, notesDirectoryPathSymlink)
      expect(Utility.isNote(notePath)).toBe(true)
      expect(Utility.isNote(notePathSymlink)).toBe(true)
    })
  })
})