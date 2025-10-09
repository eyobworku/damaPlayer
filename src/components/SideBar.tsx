import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import useGameState from "../hooks/useGameState";
import { useDispatch } from "react-redux";
import { setCheckEfta } from "../store/efta/eftaSlice";

const SideBar = () => {
  const dispatch = useDispatch();
  const { eftaState, currentPlayer } = useGameState();
  const [message, setMessage] = useState("");
  const { prevKorkiState, doesEat, hasTaken, checkEfta } = eftaState;
  const handleEftaClick = () => {
    if (prevKorkiState.length !== 32) {
      setMessage("This is the first move, cannot take efta");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    if (doesEat) {
      setMessage("You have already eaten");
      setTimeout(() => setMessage(""), 2000);
    } else if (hasTaken) {
      setMessage("You have already taken efta");
      setTimeout(() => setMessage(""), 2000);
    }
    if (!checkEfta && !doesEat && !hasTaken) {
      dispatch(setCheckEfta(true));
    } else if (checkEfta) {
      dispatch(setCheckEfta(false));
    }
  };

  return (
    <>
      <VStack justifyContent="center" marginY={5}>
        <Button
          colorScheme={checkEfta ? "red" : "blue"}
          onClick={handleEftaClick}
        >
          Efita
        </Button>
        {message && <Text>{message}</Text>}
      </VStack>
      <HStack justifyContent="center">
        <Text>Current playing: {currentPlayer === 1 ? "fanta" : "cocka"}</Text>
      </HStack>
    </>
  );
};

export default SideBar;
