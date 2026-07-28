import styles from "./Spinner.module.css";

export default function Spinner() {
  return (
    <output className={styles.spinner} aria-label="sending">
      <div className={styles.bar} />
      <div className={styles.bar} />
      <div className={styles.bar} />
      <div className={styles.bar} />
    </output>
  );
}
