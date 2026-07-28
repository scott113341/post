import FromAddressStep from "./FromAddressStep.tsx";
import ImageStep from "./ImageStep.tsx";
import LobStep from "./LobStep.tsx";
import MessageStep from "./MessageStep.tsx";
import PreviewStep from "./PreviewStep.tsx";
import SendStep from "./SendStep.tsx";
import SizeStep from "./SizeStep.tsx";
import ToAddressStep from "./ToAddressStep.tsx";
import WelcomeStep from "./WelcomeStep.tsx";

/** The wizard, in order. `stepIndex` in the store is an index into this. */
const STEPS = [
  WelcomeStep,
  LobStep,
  SizeStep,
  ImageStep,
  MessageStep,
  FromAddressStep,
  ToAddressStep,
  PreviewStep,
  SendStep,
] as const;

export default STEPS;
