import Button from "./Button.tsx";
import styles from "./StepNav.module.css";

interface StepNavProps {
  /** Omitted on the first step, which has nothing to go back to. */
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}

/** The back/next pair repeated at the foot of every step. */
export default function StepNav({
  onBack,
  onNext,
  nextLabel = "next",
  nextDisabled = false,
}: StepNavProps) {
  return (
    <div className={styles.nav}>
      {onBack && <Button onClick={onBack}>back</Button>}
      {onNext && (
        <Button onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
}
