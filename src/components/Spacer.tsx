interface SpacerProps {
  /** Any CSS length. Defaults to the standard gap between page sections. */
  height?: string;
}

export default function Spacer({ height = "30px" }: SpacerProps) {
  return <div style={{ height }} aria-hidden="true" />;
}
