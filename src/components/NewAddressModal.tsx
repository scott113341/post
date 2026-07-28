import type { FormEvent } from "react";

import type { Address } from "../types.ts";
import Button from "./Button.tsx";
import Modal from "./Modal.tsx";
import styles from "./NewAddressModal.module.css";

interface NewAddressModalProps {
  open: boolean;
  onCancel: () => void;
  onSave: (address: Address) => void;
}

const FIELDS = [
  {
    name: "addressName",
    placeholder: "name",
    autoComplete: "shipping name",
    required: true,
  },
  {
    name: "addressLine1",
    placeholder: "address line 1",
    autoComplete: "shipping address-line1",
    required: true,
  },
  {
    name: "addressLine2",
    placeholder: "address line 2",
    autoComplete: "shipping address-line2",
  },
  {
    name: "addressCity",
    placeholder: "city",
    autoComplete: "shipping address-level2",
    required: true,
  },
  {
    name: "addressState",
    placeholder: "state abbreviation",
    autoComplete: "shipping address-level1",
    autoCapitalize: "characters",
    required: true,
  },
  {
    name: "addressZip",
    placeholder: "zip",
    autoComplete: "shipping postal-code",
    inputMode: "numeric" as const,
    required: true,
  },
] as const;

export default function NewAddressModal({ open, onCancel, onSave }: NewAddressModalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const read = (name: string) => String(data.get(name) ?? "").trim();

    onSave({
      addressName: read("addressName"),
      addressLine1: read("addressLine1"),
      addressLine2: read("addressLine2"),
      addressCountry: "US",
      addressCity: read("addressCity"),
      addressState: read("addressState"),
      addressZip: read("addressZip"),
    });
    event.currentTarget.reset();
  }

  return (
    <Modal open={open} title="new address" onClose={onCancel}>
      {/* Replaces six string refs, which React 19 removed. Submitting also
          now works from the keyboard. */}
      <form onSubmit={handleSubmit}>
        {FIELDS.map((field) => (
          <input key={field.name} className={styles.input} {...field} />
        ))}

        <div className={styles.actions}>
          <Button onClick={onCancel}>cancel</Button>
          <Button type="submit">save</Button>
        </div>
      </form>
    </Modal>
  );
}
