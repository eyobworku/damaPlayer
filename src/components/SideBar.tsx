import { Button, HStack } from "@chakra-ui/react";
interface Props {
  eftaState: boolean;
  onSelectEfta: () => void;
}
const SideBar = ({ eftaState, onSelectEfta }: Props) => {
  return (
    <HStack justifyContent="center" marginY={5}>
      <Button
        colorScheme="blue"
        onClick={() => {
          onSelectEfta();
        }}
      >
        Efita {eftaState ? "true" : "false"}
      </Button>
    </HStack>
  );
};

export default SideBar;
