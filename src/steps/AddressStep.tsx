import {
  AddressSummary,
  Button,
  Cell,
  NewAddressModal,
  Spacer,
  Step,
  StepNav,
} from "../components/index.ts";
import { useAppDispatch, useAppSelector, useStepNav } from "../hooks.ts";
import {
  addAddress,
  deleteAddress,
  setSelectedAddress,
  setShowAddressModal,
} from "../store/postcard-slice.ts";
import type { Address, AddressTarget } from "../types.ts";

interface AddressStepProps {
  target: AddressTarget;
  title: string;
  /** Only the sender step offers deletion, as it did before. */
  canDelete?: boolean;
}

/**
 * Shared body of the "from address" and "to address" steps, which differed
 * only in which selection they wrote and whether they offered a delete button.
 */
export default function AddressStep({ target, title, canDelete = false }: AddressStepProps) {
  const dispatch = useAppDispatch();
  const nav = useStepNav();
  const { addresses, showModal, selectedFromIndex, selectedToIndex } = useAppSelector(
    (state) => state.postcard.address,
  );

  const selectedIndex = target === "from" ? selectedFromIndex : selectedToIndex;
  const select = (index: number) => dispatch(setSelectedAddress({ target, index }));

  function handleSave(address: Address) {
    // addAddress appends, so the new entry lands at the current length.
    const newIndex = addresses.length;
    dispatch(addAddress(address));
    select(newIndex);
    dispatch(setShowAddressModal(false));
  }

  return (
    <Step title={title}>
      {addresses.map((address, index) => {
        const selected = index === selectedIndex;

        return (
          <Cell
            key={index}
            onClick={() => select(index)}
            selected={selected}
            action={
              canDelete && selected ? (
                <>
                  <Spacer height="10px" />
                  <Button onClick={() => dispatch(deleteAddress(index))}>delete</Button>
                </>
              ) : null
            }
          >
            <AddressSummary address={address} />
          </Cell>
        );
      })}

      <Cell
        onClick={() => {
          select(-1);
          dispatch(setShowAddressModal(true));
        }}
        last
      >
        new address
      </Cell>

      <NewAddressModal
        open={showModal}
        onCancel={() => dispatch(setShowAddressModal(false))}
        onSave={handleSave}
      />

      <StepNav onBack={nav.back} onNext={nav.next} nextDisabled={selectedIndex < 0} />
    </Step>
  );
}
