import type { ReactNode } from "react";

import styles from "./Cell.module.css";

interface CellProps {
  onClick: () => void;
  selected?: boolean;
  /** Draws the bottom edge; set on the final cell of a stack. */
  last?: boolean;
  children: ReactNode;
  /** Extra controls shown inside the cell, outside the select button. */
  action?: ReactNode;
}

/**
 * A selectable row. The body is a real button so it is reachable by keyboard —
 * the original was a plain div with an onClick handler, which also meant the
 * delete action had to stop event propagation to avoid re-selecting the row.
 */
export default function Cell({
  onClick,
  selected = false,
  last = false,
  children,
  action,
}: CellProps) {
  const className = [styles.cell, last && styles.last, selected && styles.selected]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <button type="button" className={styles.select} onClick={onClick} aria-pressed={selected}>
        {children}
      </button>
      {action}
    </div>
  );
}
