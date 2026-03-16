import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import CombatTab from '../../pages/Sheet/tabs/CombatTab'

const BASE_CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 300, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores: { str:8, dex:16, con:12, int:17, wis:13, cha:10 },
  proficiencies: { savingThrows:['int','wis'], skills:['arcana'], expertise:[], tools:[], languages:['common'], armor:[], weapons:['dagger'] },
  hp:{max:16,current:16,temp:0,hitDiceTotal:3,hitDiceRemaining:3},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},
  equipment:[{ id:'e1',name:'Dagger',quantity:1,weight:1,equipped:true,notes:'',damage:'1d4',damageType:'piercing',weaponProperties:['finesse','light','thrown'],weaponCategory:'simple',range:'20/60',armorClass:null,armorType:null }],
  attacks:[],
  spells:{ability:'int',slots:{1:{max:2,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false},
  features:[],conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('CombatTab', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [BASE_CHAR] }) })

  it('shows derived AC', () => {
    render(<CombatTab character={BASE_CHAR} />)
    // unarmored: 10 + DEX 16 mod (+3) = 13
    expect(screen.getByTestId('ac-value')).toHaveTextContent('13')
  })

  it('adding a custom attack row stores entry', async () => {
    render(<CombatTab character={BASE_CHAR} />)
    await userEvent.click(screen.getByRole('button', { name: /add custom attack/i }))
    expect(useCharacterStore.getState().characters.find(c => c.id === 'c1').attacks).toHaveLength(1)
  })

  it('shows Sneak Attack row only for rogues', () => {
    render(<CombatTab character={BASE_CHAR} />)
    expect(screen.queryByText(/sneak attack/i)).not.toBeInTheDocument()

    const rogue = { ...BASE_CHAR, meta: { ...BASE_CHAR.meta, class: 'rogue' } }
    useCharacterStore.setState({ characters: [rogue] })
    render(<CombatTab character={rogue} />)
    expect(screen.getAllByText(/sneak attack/i).length).toBeGreaterThan(0)
  })

  it('spending a hit die reduces hitDiceRemaining', async () => {
    render(<CombatTab character={BASE_CHAR} />)
    await userEvent.click(screen.getByRole('button', { name: /spend hit die/i }))
    const char = useCharacterStore.getState().characters.find(c => c.id === 'c1')
    expect(char.hp.hitDiceRemaining).toBe(2)
  })

  it('shows initiative bonus derived from DEX modifier', () => {
    render(<CombatTab character={BASE_CHAR} />)
    // DEX 16 → mod +3
    expect(screen.getByTestId('initiative-value')).toHaveTextContent('+3')
  })

  it('initiative override input sets combat.initiative', async () => {
    render(<CombatTab character={BASE_CHAR} />)
    const input = screen.getByLabelText(/initiative override/i)
    await userEvent.clear(input)
    await userEvent.type(input, '5')
    const char = useCharacterStore.getState().characters.find(c => c.id === 'c1')
    expect(char.combat.initiative).toBe(5)
  })

  it('shows and edits speed', async () => {
    render(<CombatTab character={BASE_CHAR} />)
    const input = screen.getByLabelText(/speed/i)
    expect(input).toHaveValue(30)
    await userEvent.clear(input)
    await userEvent.type(input, '35')
    const char = useCharacterStore.getState().characters.find(c => c.id === 'c1')
    expect(char.combat.speed).toBe(35)
  })
})
