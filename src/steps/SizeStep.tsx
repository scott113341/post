import { Step, StepNav } from "../components/index.ts";
import { POSTCARD_SIZES } from "../constants.ts";
import { useAppDispatch, useAppSelector, useStepNav } from "../hooks.ts";
import { setSelectedSize } from "../store/postcard-slice.ts";
import { formatPrice } from "../util.ts";

export default function SizeStep() {
  const dispatch = useAppDispatch();
  const nav = useStepNav();
  const selectedIndex = useAppSelector((state) => state.postcard.size.selectedIndex);

  return (
    <Step title="postcard size">
      <select
        value={selectedIndex}
        onChange={(event) => dispatch(setSelectedSize(Number(event.target.value)))}
        aria-label="postcard size"
      >
        {POSTCARD_SIZES.map((size, index) => (
          <option key={size.name} value={index}>
            {`${size.display} - ${formatPrice(size.price)}`}
          </option>
        ))}
      </select>
      <StepNav onBack={nav.back} onNext={nav.next} nextDisabled={!POSTCARD_SIZES[selectedIndex]} />
    </Step>
  );
}
