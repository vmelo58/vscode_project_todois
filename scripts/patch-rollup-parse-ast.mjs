import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rollupParseAstPath = resolve(__dirname, '../node_modules/rollup/dist/es/parseAst.js')

const fileContents = `export { parseAst, parseAstAsync } from './shared/parseAst.js'\n`

async function ensureFile() {
  try {
    await mkdir(dirname(rollupParseAstPath), { recursive: true })
    await writeFile(rollupParseAstPath, fileContents, { encoding: 'utf8' })
    console.log('[patch-rollup] Ensured rollup/dist/es/parseAst.js patch is applied.')
  } catch (error) {
    console.warn('[patch-rollup] Failed to apply patch:', error)
  }
}

ensureFile()
