import { useEffect, useState } from "react";

import { Button, Spacer, Step, StepNav } from "../components/index.ts";
import { useAppDispatch, useAppSelector, useSelectedSize, useStepNav } from "../hooks.ts";
import renderBack from "../lib/render-back.tsx";
import renderFront from "../lib/render-front.tsx";
import { setPreviewSide } from "../store/postcard-slice.ts";
import styles from "./PreviewStep.module.css";

interface Renders {
  front: Blob;
  back: Blob;
}

export default function PreviewStep() {
  const dispatch = useAppDispatch();
  const nav = useStepNav();
  const size = useSelectedSize();
  const { image, message, address, preview } = useAppSelector((state) => state.postcard);

  const fromAddress = address.addresses[address.selectedFromIndex] ?? null;
  const toAddress = address.addresses[address.selectedToIndex] ?? null;

  const [renders, setRenders] = useState<Renders | null>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  // Rasterising both sides. This used to run in the constructor, which fired
  // before mount and could not be cancelled.
  useEffect(() => {
    if (!image) return;

    let cancelled = false;

    void (async () => {
      try {
        const [front, back] = await Promise.all([
          renderFront({ image, size }),
          renderBack({
            size,
            message,
            fromAddress,
            toAddress,
            isPreview: true,
          }),
        ]);
        if (!cancelled) setRenders({ front, back });
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : String(cause));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [image, size, message, fromAddress, toAddress]);

  // Object URLs are minted per displayed side so the cleanup can revoke
  // exactly what it created. The old version never revoked them at all.
  useEffect(() => {
    if (!renders) return;

    const objectUrl = URL.createObjectURL(preview.side === "front" ? renders.front : renders.back);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [renders, preview.side]);

  if (error) {
    return (
      <Step title="preview postcard">
        <p className={styles.error}>could not render preview: {error}</p>
        <StepNav onBack={nav.back} />
      </Step>
    );
  }

  if (!renders || !url) {
    return (
      <Step title="preview postcard">
        <Spacer height="5px" />
        <p className={styles.sideLabel}>rendering...</p>
      </Step>
    );
  }

  return (
    <Step title="preview postcard">
      <Spacer height="5px" />
      <img src={url} className={styles.render} alt={`${preview.side} of the postcard`} />
      <Spacer height="5px" />
      <p className={styles.sideLabel}>{preview.side}</p>
      <Spacer height="5px" />
      <Button onClick={() => dispatch(setPreviewSide(preview.side === "front" ? "back" : "front"))}>
        flip
      </Button>
      <StepNav onBack={nav.back} onNext={nav.next} nextLabel="send" />
    </Step>
  );
}
