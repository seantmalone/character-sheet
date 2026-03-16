import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import Sheet from '../../pages/Sheet/Sheet'

const CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 300, inspiration: false, playerName: '', subrace: 'high-elf', background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores: { str:8, dex:16, con:12, int:17, wis:13, cha:10 },
  proficiencies: { savingThrows:['int','wis'], skills:['arcana','history'], expertise:[], tools:[], languages:['common','elvish'], armor:[], weapons:['daggers'] },
  hp: { max:16, current:16, temp:0, hitDiceTotal:3, hitDiceRemaining:3 },
  deathSaves: { successes:0, failures:0 },
  combat: { acFormula:'unarmored', acOverride:null, speed:30, initiative:null, equippedArmorId:null, equippedShield:false },
  currency:{cp:0,sp:0,ep:0,gp:10,pp:0}, equipment:[], attacks:[],
  spells:{ability:'int',slots:{1:{max:4,used:0},2:{max:2,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:['magic-missile'],arcaneRecoveryUsed:false},
  features:[], conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[], settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

function renderSheet() {
  return render(
    <MemoryRouter initialEntries={['/character/c1']}>
      <Routes><Route path="/character/:id" element={<Sheet />} /></Routes>
    </MemoryRouter>
  )
}

describe('Sheet', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR] }) })

  it('shows character name and class in summary bar', () => {
    renderSheet()
    expect(screen.getByText('Aria')).toBeInTheDocument()
    expect(screen.getByText(/wizard/i)).toBeInTheDocument()
  })

  it('updates current HP in store when edited', async () => {
    renderSheet()
    const hpInput = screen.getByRole('spinbutton', { name: /current hp/i })
    await userEvent.clear(hpInput)
    await userEvent.type(hpInput, '10')
    hpInput.blur()
    expect(useCharacterStore.getState().characters[0].hp.current).toBe(10)
  })

  it('shows death saves only when current HP is 0', async () => {
    useCharacterStore.setState({ characters: [{ ...CHAR, hp: { ...CHAR.hp, current: 0 } }] })
    renderSheet()
    expect(screen.getByText(/death saves/i)).toBeInTheDocument()
  })

  it('death saves not shown when HP > 0', () => {
    renderSheet()
    expect(screen.queryByText(/death saves/i)).not.toBeInTheDocument()
  })

  it('shows all 6 tabs', () => {
    renderSheet()
    for (const tab of ['Abilities', 'Combat', 'Spells', 'Equipment', 'Features', 'Biography']) {
      expect(screen.getByRole('tab', { name: tab })).toBeInTheDocument()
    }
  })
})
