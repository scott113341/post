import { useEffect, useRef, type ReactNode } from "react";

import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  title: string;
  /** Fired by the close button, the backdrop, or the Escape key. */
  onClose: () => void;
  children: ReactNode;
}

/**
 * Wraps the native <dialog>, which supplies the backdrop, focus trapping and
 * Escape-to-close that the previous hand-rolled overlay lacked.
 */
export default function Modal({ open, title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.modal}
      onCancel={(event) => {
        // Let Redux own the open/closed state rather than the DOM.
        event.preventDefault();
        onClose();
      }}
    >
      <h1 className={styles.title}>{title}</h1>
      {children}
    </dialog>
  );
}
