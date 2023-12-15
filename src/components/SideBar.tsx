import { Button, HStack } from "@chakra-ui/react";
interface Props {
  eftaState: boolean;
  onSelectEfta: () => void;
}
const SideBar = ({ eftaState, onSelectEfta }: Props) => {
  return (
    <>
      <HStack justifyContent="center" marginY={5}>
        <Button colorScheme={eftaState ? "red" : "blue"} onClick={onSelectEfta}>
          Efita
        </Button>
      </HStack>
      {/* <HStack justifyContent="center">
        <Button colorScheme="blue" onClick={() => {}}>
          Finish moving
        </Button>
      </HStack> */}
    </>
  );
};

export default SideBar;
