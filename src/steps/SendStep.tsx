import { useEffect, useRef } from "react";

import { Spacer, Spinner, Step, StepNav } from "../components/index.ts";
import { useAppDispatch, useAppSelector, useSelectedSize, useStepNav } from "../hooks.ts";
import renderBack from "../lib/render-back.tsx";
import renderFront from "../lib/render-front.tsx";
import { sendFinished, sendStarted } from "../store/postcard-slice.ts";
import { orderPostcard } from "../util.ts";
import styles from "./SendStep.module.css";

export default function SendStep() {
  const dispatch = useAppDispatch();
  const nav = useStepNav();
  const size = useSelectedSize();
  const { image, message, address, lob, send } = useAppSelector((state) => state.postcard);

  // Sending costs real money and mails a physical card, so this must happen
  // exactly once. React 19 StrictMode invokes effects twice in development.
  const hasSent = useRef(false);

  useEffect(() => {
    if (hasSent.current) return;
    hasSent.current = true;

    const fromAddress = address.addresses[address.selectedFromIndex];
    const toAddress = address.addresses[address.selectedToIndex];

    if (!image || !fromAddress || !toAddress) {
      dispatch(sendFinished({ error: "The postcard is missing details." }));
      return;
    }

    void (async () => {
      dispatch(sendStarted());

      try {
        const [front, back] = await Promise.all([
          renderFront({ image, size }),
          renderBack({
            size,
            message,
            fromAddress,
            toAddress,
            isPreview: false,
          }),
        ]);

        const result = await orderPostcard({
          apiKey: lob.apiKey,
          to: toAddress,
          from: fromAddress,
          size: size.name,
          uspsClass: size.uspsClass,
          front,
          back,
        });

        dispatch(sendFinished({ error: result.error }));
      } catch (cause) {
        dispatch(
          sendFinished({
            error: cause instanceof Error ? cause.message : String(cause),
          }),
        );
      }
    })();
  }, [address, dispatch, image, lob.apiKey, message, size]);

  const didSucceed = !send.isSending && send.didSend && !send.error;
  const didFail = !send.isSending && send.didSend && Boolean(send.error);

  return (
    <Step title="sending postcard">
      <Spacer height="15px" />
      {send.isSending && <Spinner />}
      {didSucceed && <p className={styles.success}>success</p>}
      {didFail && <pre className={styles.error}>{send.error}</pre>}
      <StepNav
        onBack={nav.back}
        onNext={() => nav.goTo(0)}
        nextLabel="start over"
        nextDisabled={!didSucceed}
      />
    </Step>
  );
}
