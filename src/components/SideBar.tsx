import { Button, HStack, Text } from "@chakra-ui/react";
interface Props {
  eftaState: boolean;
  currentPlayer: number;
  onSelectEfta: () => void;
}
const SideBar = ({ eftaState, currentPlayer, onSelectEfta }: Props) => {
  return (
    <>
      <HStack justifyContent="center" marginY={5}>
        <Button colorScheme={eftaState ? "red" : "blue"} onClick={onSelectEfta}>
          Efita
        </Button>
      </HStack>
      <HStack justifyContent="center">
        <Text>Current playing: {currentPlayer === 1 ? "fanta" : "cocka"}</Text>
      </HStack>
    </>
  );
};

export default SideBar;
