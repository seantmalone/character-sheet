import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { useCharacterStore } from '../../store/characters'
import Roster from '../../pages/Roster/Roster'

function renderRoster() {
  return render(<MemoryRouter><Roster /></MemoryRouter>)
}

describe('Roster', () => {
  beforeEach(() => {
    useCharacterStore.setState({ characters: [] })
  })

  it('shows empty state when no characters', () => {
    renderRoster()
    expect(screen.getByText(/no characters yet/i)).toBeInTheDocument()
  })

  it('shows character cards when characters exist', () => {
    useCharacterStore.setState({
      characters: [{
        id: '1', schemaVersion: 1,
        meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 3, xp: 900, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null },
        abilityScores: { str:8,dex:14,con:12,int:16,wis:13,cha:10 },
        proficiencies: { savingThrows:[],skills:[],expertise:[],tools:[],languages:[],armor:[],weapons:[] },
        hp: { max:16,current:16,temp:0,hitDiceTotal:3,hitDiceRemaining:3 },
        deathSaves: { successes:0,failures:0 },
        combat: { acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false },
        currency:{cp:0,sp:0,ep:0,gp:10,pp:0}, equipment:[], attacks:[],
        spells:{ability:'int',slots:{1:{max:4,used:0},2:{max:2,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false},
        features:[], conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false},
        biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''},
        customSpells:[], settings:{advancedMode:false,abilityScoreMethod:'standard-array'},
      }],
    })
    renderRoster()
    expect(screen.getByText('Aria')).toBeInTheDocument()
    expect(screen.getByText(/level 3/i)).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: /xp progress/i })).toBeInTheDocument()
  })

  it('deletes a character after confirmation', async () => {
    useCharacterStore.setState({
      characters: [{ id: '1', schemaVersion: 1, meta: { characterName: 'Aria', race: 'elf', class: 'wizard', level: 1, xp: 0, inspiration: false, playerName: '', subrace: null, background: 'sage', alignment: 'CG', secondaryClass: null }, abilityScores:{str:8,dex:14,con:12,int:16,wis:13,cha:10}, proficiencies:{savingThrows:[],skills:[],expertise:[],tools:[],languages:[],armor:[],weapons:[]}, hp:{max:8,current:8,temp:0,hitDiceTotal:1,hitDiceRemaining:1}, deathSaves:{successes:0,failures:0}, combat:{acFormula:'unarmored',acOverride:null,speed:30,initiative:null,equippedArmorId:null,equippedShield:false}, currency:{cp:0,sp:0,ep:0,gp:0,pp:0}, equipment:[], attacks:[], spells:{ability:null,slots:{1:{max:0,used:0},2:{max:0,used:0},3:{max:0,used:0},4:{max:0,used:0},5:{max:0,used:0},6:{max:0,used:0},7:{max:0,used:0},8:{max:0,used:0},9:{max:0,used:0}},prepared:[],known:[],arcaneRecoveryUsed:false}, features:[], conditions:{blinded:false,charmed:false,deafened:false,exhaustion:0,frightened:false,grappled:false,incapacitated:false,invisible:false,paralyzed:false,petrified:false,poisoned:false,prone:false,restrained:false,stunned:false,unconscious:false}, biography:{personalityTraits:'',ideals:'',bonds:'',flaws:'',appearance:'',backstory:'',age:'',height:'',weight:'',eyes:'',skin:'',hair:'',notes:''}, customSpells:[], settings:{advancedMode:false,abilityScoreMethod:'standard-array'} }],
    })
    renderRoster()
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(useCharacterStore.getState().characters).toHaveLength(0)
  })
})
