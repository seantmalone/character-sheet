import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import PrintView from '../../pages/Print/PrintView'

const CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 300, inspiration: false, playerName: 'Sean', subrace: 'high-elf', background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores:{str:8,dex:16,con:12,int:17,wis:13,cha:10},
  proficiencies:{savingThrows:['int','wis'],skills:['arcana','history'],expertise:[],tools:[],languages:['common','elvish'],armor:[],weapons:[]},
  hp:{max:16,current:16,temp:0,hitDiceTotal:3,hitDiceRemaining:3},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:10,pp:0},equipment:[],
  attacks:[{id:'a1',name:'Dagger',equipmentId:null,attackAbility:'dex',attackBonusOverride:null,damage:'1d4',damageType:'piercing',damageAbility:'dex',notes:''}],
  spells:{ability:'int',slots:{1:{max:4,used:1},2:{max:2,used:0},3:{max:2,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:['magic-missile'],known:['magic-missile'],arcaneRecoveryUsed:false},
  features:[{id:'f1',name:'Arcane Recovery',source:'class',description:'Once per day when you finish a short rest, you can recover expended spell slots.',uses:1,maxUses:1,recharge:'day'}],
  conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'I use polysyllabic words.',ideals:'Knowledge',bonds:'My spellbook',flaws:'Distracted by information',appearance:'Pale, slender',backstory:'Former apprentice',age:'120',height:"5'4\"",weight:'108 lb',eyes:'Blue',skin:'Fair',hair:'Silver',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

function renderPrint() {
  return render(
    <MemoryRouter initialEntries={['/character/c1/print']}>
      <Routes><Route path="/character/:id/print" element={<PrintView />} /></Routes>
    </MemoryRouter>
  )
}

describe('PrintView', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR] }) })

  it('shows character name and class', () => {
    renderPrint()
    expect(screen.getByText('Aria')).toBeInTheDocument()
    expect(screen.getByText(/wizard/i)).toBeInTheDocument()
  })

  it('shows all 6 ability scores', () => {
    renderPrint()
    expect(screen.getByText('STR')).toBeInTheDocument()
    expect(screen.getByText('INT')).toBeInTheDocument()
  })

  it('shows weapon attacks table', () => {
    renderPrint()
    expect(screen.getByText('Dagger')).toBeInTheDocument()
  })

  it('shows spells section for casters', () => {
    renderPrint()
    expect(screen.getByText(/spell slots/i)).toBeInTheDocument()
  })
})
