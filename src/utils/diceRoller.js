export function parseDiceExpression(expr) {
  const match = String(expr).trim().match(/^(\d+)d(\d+)([+-]\d+)?$/i)
  if (!match) return { count: 0, sides: 0, modifier: 0, error: 'Invalid dice expression' }
  return {
    count: parseInt(match[1], 10),
    sides: parseInt(match[2], 10),
    modifier: match[3] ? parseInt(match[3], 10) : 0,
  }
}

export function rollDice(expr) {
  const parsed = parseDiceExpression(expr)
  if (parsed.error) return { result: null, rolls: [], error: parsed.error }
  const rolls = Array.from({ length: parsed.count }, () =>
    Math.floor(Math.random() * parsed.sides) + 1
  )
  const result = rolls.reduce((a, b) => a + b, 0) + parsed.modifier
  return { result, rolls, modifier: parsed.modifier }
}
