import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import BiographyTab from '../../pages/Sheet/tabs/BiographyTab'

const CHAR_BIO = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 1, xp: 0, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores:{str:8,dex:16,con:12,int:17,wis:13,cha:10},
  proficiencies:{savingThrows:[],skills:[],expertise:[],tools:[],languages:['common'],armor:[],weapons:[]},
  hp:{max:7,current:7,temp:0,hitDiceTotal:1,hitDiceRemaining:1},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},equipment:[],attacks:[],
  spells:{ability:'int',slots:{1:{max:2,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false},
  features:[],
  conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'Curious',ideals:'Knowledge',bonds:'',flaws:'',appearance:'',backstory:'',age:'120',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('BiographyTab', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR_BIO] }) })

  it('renders pre-filled biography traits', () => {
    render(<BiographyTab character={CHAR_BIO} />)
    expect(screen.getByDisplayValue('Curious')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Knowledge')).toBeInTheDocument()
  })

  it('renders physical characteristics fields', () => {
    render(<BiographyTab character={CHAR_BIO} />)
    expect(screen.getByDisplayValue('120')).toBeInTheDocument() // age
  })

  it('editing a field updates the store', async () => {
    render(<BiographyTab character={CHAR_BIO} />)
    const backstoryArea = screen.getByLabelText(/backstory/i)
    await userEvent.type(backstoryArea, ' An orphan.')
    expect(useCharacterStore.getState().characters[0].biography.backstory).toContain('orphan')
  })
})
