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
import {
  setEftaLatest,
  setHasTaken,
  setCheckEfta,
} from "../store/efta/eftaSlice";
import { checkEatable } from "../utils/board_functions";
import useGameState from "../hooks/useGameState";

export interface GameBoard {
  winner: string;
  squares: SquareBoard[][];
}
//type 1 fanta down / 2 coka up
// for(let i=0;i<8;i++){ let row = []
//   for(let j=0;j<8;j++){ row.push(`${i}${j}`)}console.log(row)}

const initialSquares: SquareBoard[][] = useBoard();

const Board = () => {
  const {
    korkiState,
    firstSelected,
    setFirstSelected,
    eftaState,
    currentPlayer,
    setCurrentPlayer,
  } = useGameState();
  const dispatch = useDispatch();
  const { prevKorkiState, checkEfta, hasTaken } = eftaState;
  const [latestKorki, setLatestKorki] = useState<Korki[]>([]);
  useEffect(() => {
    setCurrentPlayer(currentPlayer);
  }, [currentPlayer]);
  useEffect(() => {
    if (checkEfta && prevKorkiState.length === 32) {
      setLatestKorki(korkiState);
      dispatch(updateKorki(prevKorkiState));
    } else if (!checkEfta && latestKorki.length !== 0 && !hasTaken) {
      dispatch(updateKorki(latestKorki));
      setLatestKorki([]);
    }
  }, [checkEfta]);
  useEffect(() => {
    console.log(hasTaken);
  }, [hasTaken]);
  const checkEftaFun = (korki: Korki) => {
    if (korki.type === currentPlayer) {
      return;
    }
    //select the first korki to move
    if (firstSelected === null) {
      //check current player order
      if (korki.type === currentPlayer) {
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
      let varEat = -1;
      const { eat } = checkEatable(firstType, newType, korkiState);
      varEat = eat;
      if (varEat !== -1) {
        dispatch(eatEftaById({ latestKorki, eatKorkId: firstSelected.id }));
        setFirstSelected(null);
        dispatch(setHasTaken(true));
        dispatch(setCheckEfta(false));
      }
    }
  };
  const updateSquare = (korki: Korki) => {
    //empty square
    if (firstSelected === null && korki.type === 3) {
      return;
    }
    if (checkEfta) {
      checkEftaFun(korki);
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
              hasTaken: false,
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
