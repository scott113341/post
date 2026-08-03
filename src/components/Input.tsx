import type { ComponentPropsWithoutRef } from "react";

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

/** A controlled text input that reports its value rather than the event. */
export default function Input({ onChange, ...rest }: InputProps) {
  return <input {...rest} onChange={(event) => onChange(event.target.value)} />;
}
