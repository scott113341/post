import { Input, Spacer, Step, StepNav } from "../components/index.ts";
import { LOB_API_KEY_LENGTH } from "../constants.ts";
import { useAppDispatch, useAppSelector, useStepNav } from "../hooks.ts";
import { setLobApiKey } from "../store/postcard-slice.ts";

export default function LobStep() {
  const dispatch = useAppDispatch();
  const nav = useStepNav();
  const apiKey = useAppSelector((state) => state.postcard.lob.apiKey);

  return (
    <Step title="lob account">
      <p>enter your lob api key</p>
      <Spacer height="10px" />
      <Input
        value={apiKey}
        onChange={(value) => dispatch(setLobApiKey(value))}
        autoCapitalize="none"
        autoComplete="off"
        spellCheck={false}
        aria-label="lob api key"
      />
      <StepNav
        onBack={nav.back}
        onNext={nav.next}
        nextDisabled={apiKey.length !== LOB_API_KEY_LENGTH}
      />
    </Step>
  );
}
