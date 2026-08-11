const GERMAN_SUFFIXES = [
  'erinnen',
  'innen',
  'ungen',
  'keiten',
  'heiten',
  'chen',
  'lein',
  'ern',
  'ers',
  'en',
  'er',
  'es',
  'e',
  'n',
  's',
]

export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/ae/g, 'a')
    .replace(/oe/g, 'o')
    .replace(/ue/g, 'u')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getSearchTerms(value: string): string[] {
  const seenTerms = new Set<string>()

  return normalizeSearchText(value)
    .split(' ')
    .filter(Boolean)
    .filter((term) => {
      if (seenTerms.has(term)) return false

      seenTerms.add(term)
      return true
    })
}

export function processGermanSearchTerm(term: string): string | string[] | null {
  const normalizedTerm = normalizeSearchText(term)
  if (!normalizedTerm) return null

  const stemmedTerm = stemGermanTerm(normalizedTerm)
  if (stemmedTerm === normalizedTerm) return [normalizedTerm]

  return [normalizedTerm, stemmedTerm]
}

function stemGermanTerm(term: string): string {
  if (term.length < 5) return term

  const suffix = GERMAN_SUFFIXES.find(
    (candidate) => term.endsWith(candidate) && term.length - candidate.length >= 4,
  )

  if (!suffix) return term

  const stem = term.slice(0, -suffix.length)

  if (suffix === 'ungen') return `${stem}ung`
  if (suffix === 'keiten') return `${stem}keit`
  if (suffix === 'heiten') return `${stem}heit`

  return stem
}
