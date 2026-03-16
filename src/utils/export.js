export function exportCharacter(character) {
  const json = JSON.stringify(character, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${character.meta.characterName.replace(/\s+/g, '_')}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
