import type { Address } from "../types.ts";
import styles from "./AddressSummary.module.css";

/**
 * The address lines shown inside a Cell. Uses spans rather than paragraphs,
 * because a Cell is a button and cannot legally contain block content.
 */
export default function AddressSummary({ address }: { address: Address }) {
  const lines = [
    address.addressName,
    address.addressLine1,
    address.addressLine2,
    `${address.addressCity}, ${address.addressState} ${address.addressZip}`,
  ].filter((line) => line.trim().length > 0);

  return (
    <>
      {lines.map((line) => (
        <span key={line} className={styles.line}>
          {line}
        </span>
      ))}
    </>
  );
}
