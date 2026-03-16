import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import FeaturesTab from '../../pages/Sheet/tabs/FeaturesTab'

const CHAR_WITH_FEATURES = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 1, xp: 0, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores:{str:8,dex:16,con:12,int:17,wis:13,cha:10},
  proficiencies:{savingThrows:[],skills:[],expertise:[],tools:[],languages:['common'],armor:[],weapons:[]},
  hp:{max:7,current:7,temp:0,hitDiceTotal:1,hitDiceRemaining:1},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},equipment:[],attacks:[],
  spells:{ability:'int',slots:{1:{max:2,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false},
  features:[
    { id:'f1', name:'Arcane Recovery', source:'class', description:'Recover spell slots.', uses:1, maxUses:1, recharge:'long-rest' },
    { id:'f2', name:'Sage Researcher', source:'background', description:'Background research ability.', uses:null, maxUses:null, recharge:null },
  ],
  conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('FeaturesTab', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR_WITH_FEATURES] }) })

  it('renders features grouped by source', () => {
    render(<FeaturesTab character={CHAR_WITH_FEATURES} />)
    expect(screen.getByText(/class/i)).toBeInTheDocument()
    expect(screen.getByText(/background/i)).toBeInTheDocument()
    expect(screen.getByText('Arcane Recovery')).toBeInTheDocument()
    expect(screen.getByText('Sage Researcher')).toBeInTheDocument()
  })

  it('deletes a feature', async () => {
    render(<FeaturesTab character={CHAR_WITH_FEATURES} />)
    await userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0])
    expect(useCharacterStore.getState().characters[0].features).toHaveLength(1)
  })

  it('adds a custom feature', async () => {
    render(<FeaturesTab character={CHAR_WITH_FEATURES} />)
    await userEvent.click(screen.getByRole('button', { name: /add feature/i }))
    await userEvent.type(screen.getByLabelText(/name/i), 'Lucky')
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }))
    expect(useCharacterStore.getState().characters[0].features).toHaveLength(3)
  })
})
