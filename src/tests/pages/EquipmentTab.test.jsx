import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import EquipmentTab from '../../pages/Sheet/tabs/EquipmentTab'

const CHAR_WITH_GEAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 1, xp: 0, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores:{str:8,dex:16,con:12,int:17,wis:13,cha:10},
  proficiencies:{savingThrows:[],skills:[],expertise:[],tools:[],languages:['common'],armor:[],weapons:[]},
  hp:{max:7,current:7,temp:0,hitDiceTotal:1,hitDiceRemaining:1},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:5,sp:3,ep:0,gp:10,pp:0},
  equipment:[
    {id:'e1',name:'Dagger',quantity:2,weight:1,equipped:true,notes:'',damage:'1d4',damageType:'piercing',weaponProperties:['finesse','light','thrown'],weaponCategory:'simple',range:'20/60',armorClass:null,armorType:null},
    {id:'e2',name:'Spellbook',quantity:1,weight:3,equipped:false,notes:'50 spells',damage:null,damageType:null,weaponProperties:[],weaponCategory:null,range:null,armorClass:null,armorType:null},
  ],
  attacks:[],
  spells:{ability:'int',slots:{1:{max:2,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false},
  features:[],conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('EquipmentTab', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR_WITH_GEAR] }) })

  it('renders equipment items', () => {
    render(<EquipmentTab character={CHAR_WITH_GEAR} />)
    expect(screen.getByText('Dagger')).toBeInTheDocument()
    expect(screen.getByText('Spellbook')).toBeInTheDocument()
  })

  it('deletes an item on confirmation', async () => {
    render(<EquipmentTab character={CHAR_WITH_GEAR} />)
    await userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0])
    expect(useCharacterStore.getState().characters[0].equipment).toHaveLength(1)
  })

  it('shows currency values', () => {
    render(<EquipmentTab character={CHAR_WITH_GEAR} />)
    expect(screen.getByDisplayValue('10')).toBeInTheDocument() // gp
  })

  it('adding a custom item appends to equipment', async () => {
    render(<EquipmentTab character={CHAR_WITH_GEAR} />)
    await userEvent.click(screen.getByRole('button', { name: /add custom item/i }))
    const nameInput = screen.getByPlaceholderText(/item name/i)
    await userEvent.type(nameInput, 'Rope')
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }))
    expect(useCharacterStore.getState().characters[0].equipment).toHaveLength(3)
  })
})
