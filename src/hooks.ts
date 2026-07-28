import { useDispatch, useSelector } from "react-redux";

import { POSTCARD_SIZES } from "./constants.ts";
import { goToStep, nextStep, previousStep } from "./store/postcard-slice.ts";
import type { AppDispatch, RootState } from "./store/index.ts";
import type { PostcardSize } from "./types.ts";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

/** Step navigation, bound to dispatch. */
export function useStepNav() {
  const dispatch = useAppDispatch();
  return {
    next: () => dispatch(nextStep()),
    back: () => dispatch(previousStep()),
    goTo: (index: number) => dispatch(goToStep(index)),
  };
}

/** The whole postcard slice, for steps that read several fields at once. */
export function usePostcard() {
  return useAppSelector((state) => state.postcard);
}

/** The currently selected size, falling back to the first if none is valid. */
export function useSelectedSize(): PostcardSize {
  const selectedIndex = useAppSelector((state) => state.postcard.size.selectedIndex);
  return POSTCARD_SIZES[selectedIndex] ?? POSTCARD_SIZES[0]!;
}
