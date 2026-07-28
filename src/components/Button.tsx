import type { ComponentPropsWithoutRef } from "react";

import styles from "./Button.module.css";

/**
 * Replaces the old Button/Link pair. Link rendered an anchor with no href,
 * which kept it out of the tab order and made `disabled` a pointer-events
 * trick rather than a real disabled control.
 */
export default function Button({
  className,
  type = "button",
  ...rest
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type={type}
      className={className ? `${styles.button} ${className}` : styles.button}
      {...rest}
    />
  );
}
