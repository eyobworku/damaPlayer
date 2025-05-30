// useGameState.ts
import { useState, useEffect, useReducer } from "react";
import useKorki, { Korki } from "../hooks/useKorki";
import gameReducer, { Action } from "../components/gameReducer";
import { Efta } from "../components/Board";
import { socket } from "../services/socket-client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export interface GameState {
  korkiState: Korki[];
  // dispatch: React.Dispatch<Action>;
  firstSelected: Korki | null;
  setFirstSelected: React.Dispatch<React.SetStateAction<Korki | null>>;
  eftaState: Efta;
  // setEftaState: React.Dispatch<React.SetStateAction<Efta>>;
  currentPlayer: number;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
}

const useGameState = (gameId: number): GameState => {
  const korkiState = useSelector((state: RootState) => state.korki);
  const eftaState = useSelector((state: RootState) => state.efta);
  // const initialKorki: Korki[] = useKorki();
  const [firstSelected, setFirstSelected] = useState<Korki | null>(null);
  // const [korkiState, dispatch] = useReducer(gameReducer, initialKorki);
  // const [eftaState, setEftaState] = useState<Efta>({
  //   prevKorkiState: korkiState,
  //   doesEat: false,
  // });
  const [currentPlayer, setCurrentPlayer] = useState<number>(2);
  // useEffect(() => {
  //   setEftaState({ ...eftaState, prevKorkiState: korkiState });
  //   socket.emit("update korki", { korkiState, gameId });
  //   socket.on("update korki", (updatedKorkiState): any => {
  //     if (JSON.stringify(updatedKorkiState) !== JSON.stringify(korkiState)) {
  //       dispatch({ type: "UPDATE_KORKI", newKorkiState: updatedKorkiState });
  //       console.log("Update ks ", updatedKorkiState);
  //     }
  //   });
  //   return () => {
  //     socket.off("update korki");
  //   };
  // }, [korkiState]);

  return {
    korkiState,
    firstSelected,
    setFirstSelected,
    eftaState,
    currentPlayer,
    setCurrentPlayer,
  };
};

export default useGameState;
