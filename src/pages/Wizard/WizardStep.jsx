import { useWizard } from './WizardContext'
import styles from './WizardStep.module.css'

export default function WizardStep({ title, nextDisabled = false, onNext, children }) {
  const { step, setStep } = useWizard()

  function handleNext() {
    if (onNext) onNext()
    else setStep(s => s + 1)
  }

  return (
    <section className={styles.step}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.body}>{children}</div>
      <footer className={styles.nav}>
        {step > 1 && (
          <button type="button" className={styles.back} onClick={() => setStep(s => s - 1)}>
            Back
          </button>
        )}
        <button type="button" className={styles.next} disabled={nextDisabled} onClick={handleNext}>
          {step === 6 ? 'Create Character' : 'Next →'}
        </button>
      </footer>
    </section>
  )
}
