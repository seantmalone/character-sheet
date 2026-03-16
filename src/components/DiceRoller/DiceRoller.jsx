import { useState } from 'react'
import { rollDice } from '../../utils/diceRoller'
import styles from './DiceRoller.module.css'

export default function DiceRoller({ expression, label, onRoll }) {
  const [lastResult, setLastResult] = useState(null)

  function handleRoll() {
    const outcome = rollDice(expression)
    setLastResult(outcome)
    onRoll?.(outcome)
  }

  return (
    <div className={styles.roller}>
      <button className={styles.btn} onClick={handleRoll} type="button">
        {label ?? `Roll ${expression}`}
      </button>
      {lastResult && (
        <span className={styles.result}>
          {lastResult.error
            ? <span className={styles.error}>{lastResult.error}</span>
            : <span>{lastResult.result}</span>
          }
        </span>
      )}
    </div>
  )
}
