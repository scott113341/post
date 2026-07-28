import { Header } from "./components/index.ts";
import styles from "./App.module.css";
import { useAppSelector } from "./hooks.ts";
import STEPS from "./steps/index.ts";

export default function App() {
  const stepIndex = useAppSelector((state) => state.postcard.stepIndex);
  const CurrentStep = STEPS[stepIndex] ?? STEPS[0]!;

  return (
    <>
      <Header />
      <main className={styles.container}>
        <CurrentStep />
      </main>
    </>
  );
}
