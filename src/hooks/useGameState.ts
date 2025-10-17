import { Korki } from "../types/korki";
import { Efta } from "../types/efta";
// import { socket } from "../services/socket-client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export interface GameState {
  korkiState: Korki[];
  firstSelected: Korki | null;
  eftaState: Efta;
  currentPlayer: number;
}

const useGameState = (): GameState => {
  const korkiState = useSelector((state: RootState) => state.korki);
  const eftaState = useSelector((state: RootState) => state.efta);
  const { firstSelected, currentPlayer } = useSelector(
    (state: RootState) => state.var
  );

  return {
    korkiState,
    firstSelected,
    eftaState,
    currentPlayer,
  };
};

export default useGameState;
