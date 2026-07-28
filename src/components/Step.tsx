import type { ReactNode } from "react";

import styles from "./Step.module.css";

interface StepProps {
  title: string;
  children: ReactNode;
}

export default function Step({ title, children }: StepProps) {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </section>
  );
}
