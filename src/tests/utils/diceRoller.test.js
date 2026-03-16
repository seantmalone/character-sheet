import { describe, it, expect } from 'vitest'
import { rollDice, parseDiceExpression } from '../../utils/diceRoller'

describe('parseDiceExpression', () => {
  it('parses "1d6" correctly', () => {
    expect(parseDiceExpression('1d6')).toEqual({ count: 1, sides: 6, modifier: 0 })
  })
  it('parses "2d8+3" correctly', () => {
    expect(parseDiceExpression('2d8+3')).toEqual({ count: 2, sides: 8, modifier: 3 })
  })
  it('parses "1d20-2" correctly', () => {
    expect(parseDiceExpression('1d20-2')).toEqual({ count: 1, sides: 20, modifier: -2 })
  })
  it('returns error for invalid expression', () => {
    expect(parseDiceExpression('banana')).toEqual({ count: 0, sides: 0, modifier: 0, error: 'Invalid dice expression' })
  })
})

describe('rollDice', () => {
  it('returns result, rolls array, and no error for valid expression', () => {
    const out = rollDice('2d6')
    expect(out.error).toBeUndefined()
    expect(out.rolls).toHaveLength(2)
    expect(out.result).toBeGreaterThanOrEqual(2)
    expect(out.result).toBeLessThanOrEqual(12)
  })
  it('applies modifier to result', () => {
    const out = rollDice('1d1+5')
    expect(out.result).toBe(6)
  })
  it('returns error for invalid expression', () => {
    const out = rollDice('banana')
    expect(out.error).toBe('Invalid dice expression')
    expect(out.result).toBeNull()
  })
})
