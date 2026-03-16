import { useCharacterStore } from '../../../store/characters'
import Modal from '../../../components/Modal/Modal'

export default function LongRestModal({ character, onClose }) {
  const { updateCharacter } = useCharacterStore()

  function doLongRest() {
    const { hp, spells, features } = character
    const newSlots = {}
    for (const [lvl, slot] of Object.entries(spells.slots)) {
      newSlots[lvl] = { ...slot, used: 0 }
    }
    const toRecover = Math.max(1, Math.floor(hp.hitDiceTotal / 2))
    const newRemaining = Math.min(hp.hitDiceTotal, hp.hitDiceRemaining + toRecover)
    const newFeatures = features.map(f =>
      f.maxUses !== null ? { ...f, uses: f.maxUses } : f
    )
    updateCharacter(character.id, {
      hp: { ...hp, current: hp.max, temp: 0, hitDiceRemaining: newRemaining },
      spells: { ...spells, slots: newSlots, arcaneRecoveryUsed: false },
      deathSaves: { successes: 0, failures: 0 },
      features: newFeatures,
    })
    onClose()
  }

  return (
    <Modal open={true} title="Long Rest" onClose={onClose} size="sm">
      <p>Taking a long rest will:</p>
      <ul>
        <li>Restore HP to maximum ({character.hp.max})</li>
        <li>Restore all spell slots</li>
        <li>Reset all feature uses</li>
        <li>Recover hit dice (up to half total)</li>
        <li>Clear death saves</li>
        {character.meta.class === 'wizard' && <li>Reset Arcane Recovery</li>}
      </ul>
      <button onClick={doLongRest} aria-label="Take long rest">Take Long Rest</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  )
}
