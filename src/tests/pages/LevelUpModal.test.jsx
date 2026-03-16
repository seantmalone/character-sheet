import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import LevelUpModal from '../../pages/Sheet/modals/LevelUpModal'

const WIZARD_L3 = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 2700, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores:{str:8,dex:16,con:12,int:17,wis:13,cha:10},
  proficiencies:{savingThrows:['int','wis'],skills:[],expertise:[],tools:[],languages:['common'],armor:[],weapons:[]},
  hp:{max:16,current:16,temp:0,hitDiceTotal:3,hitDiceRemaining:3},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},equipment:[],attacks:[],
  spells:{ability:'int',slots:{1:{max:4,used:0},2:{max:2,used:0},3:{max:2,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:['magic-missile'],known:['magic-missile','shield'],arcaneRecoveryUsed:false},
  features:[],conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('LevelUpModal', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [WIZARD_L3] }) })

  it('shows level up heading', () => {
    render(<LevelUpModal character={WIZARD_L3} onClose={() => {}} />)
    expect(screen.getByText(/level up.*4/i)).toBeInTheDocument()
  })

  it('step 1: Take Average button sets HP increase preview', async () => {
    render(<LevelUpModal character={WIZARD_L3} onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /take average/i }))
    // Average for d6 = 4 (floor(6/2) + 1 = 4), CON 12 = +1, total = 5
    expect(screen.getByText(/\+5 hp/i)).toBeInTheDocument()
  })

  it('confirms level up increments level in store', async () => {
    render(<LevelUpModal character={WIZARD_L3} onClose={() => {}} />)
    // Step 1: Take average HP
    await userEvent.click(screen.getByRole('button', { name: /take average/i }))
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // Step 2: new features (Next)
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // Step 3: spell slots (Next)
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // Step 4: spells — pick 2 spells
    const checkboxes = screen.getAllByRole('checkbox')
    if (checkboxes.length >= 2) {
      await userEvent.click(checkboxes[0])
      await userEvent.click(checkboxes[1])
    }
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // Step 5: ASI (available at level 4 for wizard)
    const asiSelect = screen.getByRole('combobox', { name: /\+2 ability/i })
    await userEvent.selectOptions(asiSelect, 'str')
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    // Step 6: Confirm
    await userEvent.click(screen.getByRole('button', { name: /confirm level up/i }))
    expect(useCharacterStore.getState().characters[0].meta.level).toBe(4)
  })
})
