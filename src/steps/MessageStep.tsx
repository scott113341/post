import { Step, StepNav } from "../components/index.ts";
import { useAppDispatch, useAppSelector, useStepNav } from "../hooks.ts";
import { setMessage } from "../store/postcard-slice.ts";
import styles from "./MessageStep.module.css";

export default function MessageStep() {
  const dispatch = useAppDispatch();
  const nav = useStepNav();
  const content = useAppSelector((state) => state.postcard.message.content);

  return (
    <Step title="write message">
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(event) => dispatch(setMessage(event.target.value))}
        aria-label="postcard message"
      />
      <StepNav onBack={nav.back} onNext={nav.next} />
    </Step>
  );
}
