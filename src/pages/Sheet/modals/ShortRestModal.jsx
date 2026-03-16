import { useCharacterStore } from '../../../store/characters'
import { rollDice } from '../../../utils/diceRoller'
import { useDerivedStats } from '../../../hooks/useDerivedStats'
import Modal from '../../../components/Modal/Modal'
import classes from '../../../data/classes.json'

export default function ShortRestModal({ character, onClose }) {
  const { updateCharacter } = useCharacterStore()
  const derived = useDerivedStats(character)
  const liveChar = useCharacterStore(s => s.characters.find(c => c.id === character.id)) || character

  const classData = classes.find(c => c.id === character.meta.class)
  const hitDie = classData?.hitDie || 6
  const conMod = derived.abilityModifiers.con ?? 0
  const remaining = liveChar.hp.hitDiceRemaining
  const current = liveChar.hp.current

  function rollHitDie() {
    if (remaining <= 0) return
    const { result: roll } = rollDice(`1d${hitDie}`)
    const heal = Math.max(1, roll + conMod)
    const newCurrent = Math.min(liveChar.hp.max, current + heal)
    updateCharacter(character.id, {
      hp: { ...liveChar.hp, current: newCurrent, hitDiceRemaining: remaining - 1 },
    })
  }

  function finish() {
    updateCharacter(character.id, {
      features: liveChar.features.map(f =>
        f.recharge === 'short-rest' ? { ...f, uses: f.maxUses } : f
      ),
    })
    onClose()
  }

  return (
    <Modal open={true} title="Short Rest" onClose={onClose} size="md">
      <p>Hit Dice Remaining: {remaining} / {liveChar.hp.hitDiceTotal} (d{hitDie})</p>
      <p>Current HP: {current} / {liveChar.hp.max}</p>
      <button onClick={rollHitDie} disabled={remaining <= 0} aria-label={`Roll d${hitDie}`}>
        Roll d{hitDie} {conMod !== 0 ? `(${conMod >= 0 ? '+' : ''}${conMod})` : ''}
      </button>
      <button onClick={finish} aria-label="Finish rest">Finish Rest</button>
    </Modal>
  )
}
