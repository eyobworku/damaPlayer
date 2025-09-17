import { Box, Center, Flex } from "@chakra-ui/react";
import SquareBox from "./Board/SquareBox";
import useBoard, { SquareBoard } from "../hooks/useBoard";
import { useEffect, useState } from "react";
import { Korki } from "../types/korki";
import { useDispatch } from "react-redux";
import {
  updateKorkiState,
  setTypeAndSelected,
  eatEftaById,
  updateKorki,
} from "../store/korki/korkiSlice";
import { setEftaLatest } from "../store/efta/eftaSlice";
import { checkEatable } from "../utils/board_functions";

export interface GameBoard {
  winner: string;
  squares: SquareBoard[][];
}

export interface Efta {
  prevKorkiState: Korki[];
  doesEat: boolean;
}
//type 1 fanta down / 2 coka up
// for(let i=0;i<8;i++){ let row = []
//   for(let j=0;j<8;j++){ row.push(`${i}${j}`)}console.log(row)}

const initialSquares: SquareBoard[][] = useBoard();
interface Props {
  checkEftaVar: boolean;
  offSelectEfta: () => void;
  updateCurentPlaying: (curPl: number) => void;
  currentPlayer: number; // Add currentPlayer prop
  setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
  korkiState: Korki[]; // State for korkis
  // dispatch: React.Dispatch<Action>; // Dispatch function for updating korkiState
  firstSelected: Korki | null; // State for storing the first selected korki
  setFirstSelected: React.Dispatch<React.SetStateAction<Korki | null>>; // Function for updating firstSelected state
  eftaState: Efta; // State for efta
  // setEftaState: React.Dispatch<
  //   React.SetStateAction<{ prevKorkiState: Korki[]; doesEat: boolean }>
  // >;
}

const Board = ({
  checkEftaVar,
  offSelectEfta,
  updateCurentPlaying,
  currentPlayer,
  setCurrentPlayer,
  korkiState,
  firstSelected,
  setFirstSelected,
  eftaState,
}: Props) => {
  const dispatch = useDispatch();
  const [latestKorki, setLatestKorki] = useState<Korki[]>([]);
  useEffect(() => {
    updateCurentPlaying(currentPlayer);
  }, [currentPlayer]);
  useEffect(() => {
    if (checkEftaVar) {
      setLatestKorki(korkiState);
      dispatch(updateKorki(eftaState.prevKorkiState));
    } else if (!checkEftaVar && latestKorki.length !== 0) {
      dispatch(updateKorki(latestKorki));
      setLatestKorki([]);
    }
  }, [checkEftaVar]);
  // useEffect(() => {
  //   console.log(korkiState);
  // }, [korkiState]);
  useEffect(() => {
    console.log(initialSquares);
  }, [initialSquares]);
  const checkEfta = (korki: Korki) => {
    if (korki.type === currentPlayer) {
      return;
    }
    //select the first korki to move
    if (firstSelected === null) {
      //check current player order
      if (korki.type === currentPlayer) {
        return;
      }
      console.log("here");

      dispatch(setTypeAndSelected({ selectID: korki.id, setSelected: 1 }));
      setFirstSelected(korki);
    } else if (firstSelected.id === korki.id) {
      //deselect the selected or unselect
      dispatch(
        setTypeAndSelected({ selectID: firstSelected.id, setSelected: 0 })
      );
      setFirstSelected(null);
    }
    let eatEfta = false;

    //efta eating check
    // if (!eftaState.doesEat) {
    //   const { movable, eat, nigus } = checkEatable(
    //     firstType,
    //     newType,
    //     eftaState.prevKorkiState
    //   );
    //   if (eat !== -1) {
    //     eatEfta = true;
    //     varMovable = movable;
    //     varNigus = nigus;
    //   } else {
    //     varMovable = false;
    //   }

    //   offSelectEfta();
    // }

    //remove the eaten efta
    // if (eatEfta) {
    //   dispatch(eatEftaById(firstSelected.id));
    //   setFirstSelected(null);
    // }
  };
  const updateSquare = (korki: Korki) => {
    //empty square
    if (firstSelected === null && korki.type === 3) {
      return;
    }
    if (checkEftaVar) {
      checkEfta(korki);
      return;
    }
    //select the first korki to move
    if (firstSelected === null) {
      //check current player order
      if (korki.type !== currentPlayer) {
        return;
      }

      dispatch(setTypeAndSelected({ selectID: korki.id, setSelected: 1 }));
      setFirstSelected(korki);
    } else if (firstSelected.id === korki.id) {
      //deselect the selected or unselect
      dispatch(
        setTypeAndSelected({ selectID: firstSelected.id, setSelected: 0 })
      );
      setFirstSelected(null);
    } else {
      //main logic
      const firstType = {
        ...firstSelected,
        x: parseInt(firstSelected.customKey.charAt(0)),
        y: parseInt(firstSelected.customKey.charAt(1)),
      };
      const newType = {
        ...korki,
        x: parseInt(korki.customKey.charAt(0)),
        y: parseInt(korki.customKey.charAt(1)),
      };
      let varMovable = false;
      let varEat = -1;
      let varNigus = false;
      let secondMove = false;

      //check ongoing movement / second move after eating
      if (firstType.selected === 2) {
        const { movable, eat, nigus } = checkEatable(
          firstType,
          newType,
          korkiState
        );
        if (eat !== -1) {
          varMovable = movable;
          varEat = eat;
          varNigus = nigus;
        } else {
          dispatch(
            setTypeAndSelected({ selectID: firstType.id, setSelected: 0 })
          );
          setFirstSelected(null);
        }
        secondMove = true;
      }

      if (!secondMove) {
        //normal move checkpoint
        const { movable, eat, nigus } = checkEatable(
          firstType,
          newType,
          korkiState
        );
        varMovable = movable;
        varEat = eat;
        varNigus = nigus;
      }

      if (varMovable) {
        dispatch(
          updateKorkiState({
            korki: korki,
            first: firstSelected,
            varEat: varEat,
            varNigus: varNigus,
          })
        );
        setCurrentPlayer(firstType.type === 1 ? 2 : 1);
        setFirstSelected(
          varEat === -1
            ? null
            : {
                ...korkiState[korki.id],
                type: firstType.type,
                nigus: varNigus,
                selected: 2,
              }
        );
        //update previous estate for efta
        dispatch(
          setEftaLatest({
            newEfta: {
              doesEat: varEat !== -1,
              prevKorkiState: korkiState,
            },
            firstId: firstSelected.id,
          })
        );
      } else {
        //off the selected
        dispatch(
          setTypeAndSelected({ selectID: firstSelected.id, setSelected: 0 })
        );
        setFirstSelected(null);
      }
    }
  };

  const renderBoard = () => {
    const rows: JSX.Element[] = [];
    let id = 0;
    for (let i = 0; i < 8; i++) {
      const rowElements: JSX.Element[] = [];
      for (let j = 0; j < 8; j++) {
        const key = `${i}${j}`;
        rowElements.push(
          <SquareBox
            key={key}
            korki={initialSquares[i][j].typeOfBoard ? korkiState[id++] : null}
            onSelectSquare={(korki) => {
              updateSquare(korki);
            }}
          />
        );
      }
      rows.push(<Flex key={i}>{rowElements}</Flex>);
    }

    return rows;
  };

  return (
    <Box p={5}>
      <Center>
        <Box>{renderBoard()}</Box>
      </Center>
    </Box>
  );
};

export default Board;
