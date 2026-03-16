import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCharacterStore } from '../../store/characters'
import AbilitiesTab from '../../pages/Sheet/tabs/AbilitiesTab'

const CHAR = {
  id: 'c1', schemaVersion: 1,
  meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 300, inspiration: false, playerName: '', subrace: 'high-elf', background: 'sage', alignment: 'CG', secondaryClass: null },
  abilityScores: { str:8, dex:16, con:12, int:17, wis:13, cha:10 },
  proficiencies: { savingThrows:['int','wis'], skills:['arcana','history'], expertise:[], tools:[], languages:['common','elvish'], armor:[], weapons:[] },
  hp:{max:16,current:16,temp:0,hitDiceTotal:3,hitDiceRemaining:3},
  deathSaves:{successes:0,failures:0},
  combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false},
  currency:{cp:0,sp:0,ep:0,gp:0,pp:0},equipment:[],attacks:[],
  spells:{ability:'int',slots:{1:{max:4,used:0},2:{max:2,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false},
  features:[],conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
  biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
  customSpells:[],settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
}

describe('AbilitiesTab', () => {
  beforeEach(() => { useCharacterStore.setState({ characters: [CHAR] }) })

  it('shows modifier for each ability score', () => {
    render(<AbilitiesTab character={CHAR} />)
    // STR 8 → -1
    expect(screen.getByTestId('modifier-str')).toHaveTextContent('-1')
    // INT 17 → +3
    expect(screen.getByTestId('modifier-int')).toHaveTextContent('+3')
  })

  it('shows proficiency bonus', () => {
    render(<AbilitiesTab character={CHAR} />)
    expect(screen.getByText(/\+2/)).toBeInTheDocument() // level 3 prof bonus
  })

  it('toggling skill proficiency updates store', async () => {
    render(<AbilitiesTab character={CHAR} />)
    // Acrobatics is not proficient; click its prof button
    const profBtn = screen.getByRole('button', { name: /add proficiency in acrobatics/i })
    await userEvent.click(profBtn)
    const char = useCharacterStore.getState().characters.find(c => c.id === 'c1')
    expect(char.proficiencies.skills).toContain('acrobatics')
  })

  it('expertise toggle auto-adds skill proficiency if missing', async () => {
    render(<AbilitiesTab character={CHAR} />)
    // Athletics is not proficient — try to grant expertise to athletics
    const expBtn = screen.getByRole('button', { name: /add expertise in athletics/i })
    await userEvent.click(expBtn)
    const char = useCharacterStore.getState().characters.find(c => c.id === 'c1')
    // Both expertise AND proficiency granted
    expect(char.proficiencies.expertise).toContain('athletics')
    expect(char.proficiencies.skills).toContain('athletics')
  })

  it('shows passive perception derived from WIS modifier + perception bonus', () => {
    render(<AbilitiesTab character={CHAR} />)
    // WIS 13 → mod +1; perception not proficient → passive = 10 + 1 = 11
    expect(screen.getByText(/passive perception/i).closest('div')).toHaveTextContent('11')
  })

  it('shows ability score method as informational label', () => {
    render(<AbilitiesTab character={CHAR} />)
    // settings.abilityScoreMethod is 'standard-array' → displayed as text
    expect(screen.getByText(/score method/i)).toHaveTextContent(/standard array/i)
  })
})
