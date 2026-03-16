import { useSettingsStore } from '../../store/settings'
import { WizardProvider, useWizard } from './WizardContext'
import Step1Name from './Step1Name'
import Step2Race from './Step2Race'
import Step3Class from './Step3Class'
import Step4Background from './Step4Background'
import Step5Abilities from './Step5Abilities'
import Step6Review from './Step6Review'
import styles from './Wizard.module.css'

const STEPS = [Step1Name, Step2Race, Step3Class, Step4Background, Step5Abilities, Step6Review]
const STEP_LABELS = ['Name', 'Race', 'Class', 'Background', 'Abilities', 'Review']

function WizardInner() {
  const { step } = useWizard()
  const StepComponent = STEPS[step - 1]
  return (
    <div className={styles.wizard}>
      <nav className={styles.progress} aria-label="Creation steps">
        {STEP_LABELS.map((label, i) => (
          <span key={label}
            className={[styles.dot, i + 1 === step ? styles.active : '', i + 1 < step ? styles.done : ''].filter(Boolean).join(' ')}>
            {label}
          </span>
        ))}
      </nav>
      <StepComponent />
    </div>
  )
}

export default function Wizard() {
  const { globalAdvancedMode } = useSettingsStore()
  return (
    <WizardProvider globalAdvancedMode={globalAdvancedMode}>
      <WizardInner />
    </WizardProvider>
  )
}
