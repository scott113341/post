import { useRef, useState, type ChangeEvent } from "react";

import { Button, Spacer, Step, StepNav } from "../components/index.ts";
import { useAppDispatch, useAppSelector, useStepNav } from "../hooks.ts";
import { setImage } from "../store/postcard-slice.ts";
import { loadFileAsDataUrl, loadImageFromData } from "../util.ts";
import styles from "./ImageStep.module.css";

export default function ImageStep() {
  const dispatch = useAppDispatch();
  const nav = useStepNav();
  const image = useAppSelector((state) => state.postcard.image);
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    dispatch(setImage(null));
    setError("");

    try {
      const data = await loadFileAsDataUrl(file);
      const loaded = await loadImageFromData(data);
      dispatch(setImage({ data, width: loaded.width, height: loaded.height }));
    } catch (cause) {
      // Previously an unreadable file left the step silently stuck.
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  return (
    <Step title="choose a photo">
      <Button onClick={() => fileInput.current?.click()}>browse</Button>
      <input
        ref={fileInput}
        className={styles.input}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        tabIndex={-1}
        aria-hidden="true"
      />

      {error && <p className={styles.error}>{error}</p>}

      {image && (
        <>
          <Spacer height="20px" />
          <img className={styles.image} src={image.data} alt="chosen postcard" />
        </>
      )}

      <StepNav onBack={nav.back} onNext={nav.next} nextDisabled={!image} />
    </Step>
  );
}
