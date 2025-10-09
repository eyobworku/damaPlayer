import { useState } from "react";
import { Korki } from "../types/korki";
import { Efta } from "../types/efta";
// import { socket } from "../services/socket-client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export interface GameState {
  korkiState: Korki[];
  firstSelected: Korki | null;
  setFirstSelected: React.Dispatch<React.SetStateAction<Korki | null>>;
  eftaState: Efta;
  currentPlayer: number;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
}

const useGameState = (): GameState => {
  const korkiState = useSelector((state: RootState) => state.korki);
  const eftaState = useSelector((state: RootState) => state.efta);
  const [firstSelected, setFirstSelected] = useState<Korki | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);

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
