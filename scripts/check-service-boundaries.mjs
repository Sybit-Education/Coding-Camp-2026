import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import process from 'node:process'

const sourceRoot = join(process.cwd(), 'src')
const registryPath = join(sourceRoot, 'bootstrap', 'service-registry.ts')
const serviceInstantiationPattern = /\bnew\s+([A-Z]\w*Service)\s*\(/g

async function getSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await getSourceFiles(entryPath)))
    } else if (/\.(?:[cm]?[jt]s|vue)$/.test(entry.name)) {
      files.push(entryPath)
    }
  }

  return files
}

const violations = []

for (const filePath of await getSourceFiles(sourceRoot)) {
  if (filePath === registryPath) {
    continue
  }

  const source = await readFile(filePath, 'utf8')

  for (const match of source.matchAll(serviceInstantiationPattern)) {
    const line = source.slice(0, match.index).split(/\r?\n/).length
    violations.push(
      `${relative(process.cwd(), filePath)}:${line}: ${match[1]} must only be instantiated in src/bootstrap/service-registry.ts`,
    )
  }
}

if (violations.length > 0) {
  console.error('Service boundary violations found:')
  for (const violation of violations) {
    console.error(`- ${violation}`)
  }
  process.exitCode = 1
} else {
  console.log('Service boundary check passed.')
}
