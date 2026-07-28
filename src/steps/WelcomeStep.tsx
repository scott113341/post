import { Spacer, Step, StepNav } from "../components/index.ts";
import { useStepNav } from "../hooks.ts";

export default function WelcomeStep() {
  const nav = useStepNav();

  return (
    <Step title="welcome to post">
      <Spacer height="10px" />
      <p>the easiest way to send postcards to people</p>
      <Spacer height="10px" />
      <p>
        requires a{" "}
        <a href="https://dashboard.lob.com/#/register" target="_blank" rel="noreferrer nofollow">
          lob account
        </a>
      </p>
      <StepNav onNext={nav.next} />
    </Step>
  );
}
