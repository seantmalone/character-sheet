import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import ShortRestModal from '../../pages/Sheet/modals/ShortRestModal'
import LongRestModal from '../../pages/Sheet/modals/LongRestModal'

const CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 300, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores:{str:8,dex:16,con:12,int:17,wis:13,cha:10},
  proficiencies:{savingThrows:[],skills:[],expertise:[],tools:[],languages:['common'],armor:[],weapons:[]},
  hp:{max:16,current:10,temp:0,hitDiceTotal:3,hitDiceRemaining:3},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},equipment:[],attacks:[],
  spells:{ability:'int',slots:{1:{max:4,used:2},2:{max:2,used:1},3:{max:2,used:2},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:['magic-missile'],known:['magic-missile'],arcaneRecoveryUsed:true},
  features:[{id:'f1',name:'Channel Divinity',source:'class',description:'Use channel divinity.',uses:0,maxUses:1,recharge:'short-rest'}],
  conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('ShortRestModal', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR] }) })

  it('shows remaining hit dice count', () => {
    render(<ShortRestModal character={CHAR} onClose={() => {}} />)
    expect(screen.getByText(/hit dice remaining.*3/i)).toBeInTheDocument()
  })

  it('spending a hit die via Roll button increases HP and decreases remaining', async () => {
    render(<ShortRestModal character={CHAR} onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /roll d6/i }))
    const char = useCharacterStore.getState().characters[0]
    expect(char.hp.hitDiceRemaining).toBe(2)
    expect(char.hp.current).toBeGreaterThan(10)
  })

  it('closes on Finish', async () => {
    const onClose = vi.fn()
    render(<ShortRestModal character={CHAR} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /finish rest/i }))
    expect(onClose).toHaveBeenCalled()
  })
})

describe('LongRestModal', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR] }) })

  it('after confirming, restores HP to max', async () => {
    render(<LongRestModal character={CHAR} onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /take long rest/i }))
    expect(useCharacterStore.getState().characters[0].hp.current).toBe(16)
  })

  it('after confirming, restores all spell slots', async () => {
    render(<LongRestModal character={CHAR} onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /take long rest/i }))
    const slots = useCharacterStore.getState().characters[0].spells.slots
    expect(slots[1].used).toBe(0)
    expect(slots[2].used).toBe(0)
  })

  it('after confirming, resets arcane recovery', async () => {
    render(<LongRestModal character={CHAR} onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /take long rest/i }))
    expect(useCharacterStore.getState().characters[0].spells.arcaneRecoveryUsed).toBe(false)
  })
})
