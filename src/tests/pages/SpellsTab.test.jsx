import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import SpellsTab from '../../pages/Sheet/tabs/SpellsTab'

const WIZARD_CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 300, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores: { str:8, dex:16, con:12, int:17, wis:13, cha:10 },
  proficiencies: { savingThrows:['int','wis'], skills:[], expertise:[], tools:[], languages:['common'], armor:[], weapons:[] },
  hp:{max:16,current:16,temp:0,hitDiceTotal:3,hitDiceRemaining:3},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},equipment:[],attacks:[],
  spells:{ability:'int',slots:{1:{max:4,used:0},2:{max:2,used:0},3:{max:2,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:['magic-missile'],known:['magic-missile','shield','fire-bolt'],arcaneRecoveryUsed:false},
  features:[],conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('SpellsTab', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [WIZARD_CHAR] }) })

  it('shows spell slots for levels with max > 0', () => {
    render(<SpellsTab character={WIZARD_CHAR} />)
    expect(screen.getByText(/level 1.*4/i)).toBeInTheDocument()
  })

  it('using a slot increments used count in store', async () => {
    render(<SpellsTab character={WIZARD_CHAR} />)
    // Click the first pip in level-1 slot tracker (marks one slot used)
    const slotPips = screen.getAllByRole('button', { name: /slot 1 pip/i })
    await userEvent.click(slotPips[0])
    expect(useCharacterStore.getState().characters[0].spells.slots[1].used).toBe(1)
  })

  it('shows spells from known list for wizard', () => {
    render(<SpellsTab character={WIZARD_CHAR} />)
    expect(screen.getByText('Magic Missile')).toBeInTheDocument()
    expect(screen.getByText('Shield')).toBeInTheDocument()
  })

  it('toggling prepare marks spell as prepared in store', async () => {
    render(<SpellsTab character={WIZARD_CHAR} />)
    // Shield is not prepared; click its prepare toggle
    const prepBtn = screen.getByRole('button', { name: /prepare shield/i })
    await userEvent.click(prepBtn)
    expect(useCharacterStore.getState().characters[0].spells.prepared).toContain('shield')
  })

  it('shows Arcane Recovery button only for wizards', () => {
    render(<SpellsTab character={WIZARD_CHAR} />)
    expect(screen.getByRole('button', { name: /arcane recovery/i })).toBeInTheDocument()
  })
})
