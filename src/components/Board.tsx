import { Box, Center, Flex } from "@chakra-ui/react";
import SquareBox from "./SquareBox";
import useBoard, { SquareBoard } from "../hooks/useBoard";
import { useEffect, useState } from "react";
import { Korki } from "../hooks/useKorki";
import { Action } from "./gameReducer";
import { useDispatch } from "react-redux";
import {
  updateKorkiState,
  setTypeAndSelected,
  eatEftaById,
  updateKorki,
} from "../store/korki/korkiSlice";
import { setEftaLatest } from "../store/efta/eftaSlice";

export interface GameBoard {
  winner: string;
  squares: SquareBoard[][];
}
interface ExtendedKorki extends Korki {
  x: number;
  y: number;
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
  useEffect(() => {
    console.log(eftaState);
  }, [eftaState]);
  const updateSquare = (korki: Korki) => {
    if (firstSelected === null && korki.type === 3) {
      if (checkEftaVar) {
        // console.log(eftaState.prevKorkiState[korki.id]);
      }
      return;
    }

    if (firstSelected === null) {
      //check current player order
      if (!checkEftaVar && korki.type !== currentPlayer) {
        return;
      }
      if (checkEftaVar && korki.type === currentPlayer) {
        return;
      }
      dispatch(setTypeAndSelected({ selectID: korki.id, setSelected: 1 }));
      setFirstSelected(korki);
    } else if (firstSelected.id === korki.id) {
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
      let eatEfta = false;
      let varEat = -1;
      let varNigus = false;
      let secondMove = false;

      //check ongoing movement / second move
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

      //efta eating check
      if (!eftaState.doesEat && checkEftaVar) {
        const { movable, eat, nigus } = checkEatable(
          firstType,
          newType,
          eftaState.prevKorkiState
        );
        if (eat !== -1) {
          eatEfta = true;
          varMovable = movable;
          varNigus = nigus;
        } else {
          varMovable = false;
        }

        offSelectEfta();
      } else if (!checkEftaVar && !secondMove) {
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
        if (!eatEfta) {
          // dispatch(
          //   setTypeAndSelected({
          //     selectID: firstSelected.id,
          //     selectType: 3,
          //     setSelected: 0,
          //   })
          // );
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
        } else if (eatEfta) {
          dispatch(eatEftaById(firstSelected.id));
          setFirstSelected(null);
        }
        dispatch(
          setEftaLatest({
            newEfta: {
              doesEat: varEat !== -1,
              prevKorkiState: korkiState,
            },
            firstId: firstSelected.id,
          })
        ); //update previous estate for efta
      } else {
        //off the selected
        dispatch(
          setTypeAndSelected({ selectID: firstSelected.id, setSelected: 0 })
        );
        setFirstSelected(null);
      }
    }
  };

  const getDisDir = (firstType: ExtendedKorki, newType: ExtendedKorki) => {
    let dis = 0;
    let dir = "none";
    if (newType.x + newType.y === firstType.x + firstType.y) {
      dir = firstType.x > newType.x ? "upRight" : "downLeft";
      dis = Math.abs(firstType.x - newType.x);
    } else if (firstType.x - newType.x === firstType.y - newType.y) {
      dir = firstType.x > newType.x ? "upLeft" : "downRight";
      dis = Math.abs(firstType.x - newType.x);
    }
    return { dir, dis };
  };

  const checkEatable = (
    firstType: ExtendedKorki,
    newType: ExtendedKorki,
    korkiState: Korki[]
  ) => {
    let movable = false;
    let backWard = false;
    let nigus = false;
    let eat = -1;

    const { dir, dis } = getDisDir(firstType, newType);
    if (dir === "none" || newType.type !== 3) {
      return { movable, eat, nigus };
    }

    const diagId = moveableDirection(firstType.x, firstType.y, dir).splice(
      0,
      dis
    );

    // nigus moves
    if (firstType.nigus) {
      return findOtherTypeKorkiId(diagId, firstType.type, korkiState);
    }

    const { varBackWard, varMovable, varEat } = checkBackMove(
      firstType,
      diagId,
      korkiState,
      dir
    );
    backWard = varBackWard;
    movable = varMovable;
    eat = varEat;

    //forward movement and check nigus
    if (!backWard && diagId.length < 3) {
      if (diagId.length === 2) {
        if (
          korkiState[diagId[0]].type !== firstType.type &&
          korkiState[diagId[0]].type !== 3
        ) {
          eat = korkiState[diagId[1]].type === 3 ? diagId[0] : -1;
          movable = eat === -1 ? false : true;
        } else {
          movable = false;
        }
      } else if (diagId.length === 1) {
        movable = korkiState[diagId[0]].type === 3 && firstType.selected !== 2;
      }
      nigus =
        (firstType.type === 1 && newType.x === 7) ||
        (firstType.type === 2 && newType.x === 0)
          ? true
          : false; // firstType.nigus === true ? true :
    }

    return { movable, eat, nigus };
  };
  const checkBackMove = (
    firstType: ExtendedKorki,
    diagId: number[],
    korkiState: Korki[],
    dir: string
  ) => {
    let varBackWard = true;
    let varMovable = false;
    let varEat = -1;
    const direction = firstType.type === 1 ? "up" : "down";
    const opostion = firstType.type === 1 ? 2 : 1;

    if (dir.startsWith(direction)) {
      if (diagId.length === 2) {
        varEat =
          korkiState[diagId[0]].type === opostion &&
          korkiState[diagId[1]].type === 3
            ? diagId[0]
            : -1;
        varMovable = varEat === -1 ? false : true;
      }
    } else {
      varBackWard = false;
    }
    return { varBackWard, varMovable, varEat };
  };
  //nigus move check
  const findOtherTypeKorkiId = (
    diagId: number[],
    myType: number,
    korkiState: Korki[]
  ) => {
    let eat = -1;
    let typeTwoCount = 0;
    let movable = true;

    diagId.forEach((id) => {
      const korki = korkiState[id];
      if (korki.type !== myType || korki.type === 3) {
        if (korki.type !== 3) {
          if (typeTwoCount === 0) {
            eat = id;
            typeTwoCount++;
          } else {
            movable = false;
          }
        }
      } else {
        movable = false;
      }
    });

    return { movable, eat, nigus: true };
  };

  function moveableDirection(x: number, y: number, dir: string) {
    let newX = x;
    let newY = y;
    const diagId = [];
    while (
      (dir === "downLeft" && newX !== 7 && newY !== 0) ||
      (dir === "downRight" && newX !== 7 && newY !== 7) ||
      (dir === "upRight" && newX !== 0 && newY !== 7) ||
      (dir === "upLeft" && newX !== 0 && newY !== 0)
    ) {
      if (dir === "downLeft") {
        newX++;
        newY--;
      } else if (dir === "downRight") {
        newX++;
        newY++;
      } else if (dir === "upRight") {
        newX--;
        newY++;
      } else if (dir === "upLeft") {
        newX--;
        newY--;
      }

      diagId.push(getIdFromRowColumn(`${newX}${newY}`));
    }
    return diagId;
  }

  const getIdFromRowColumn = (customKey: string): number => {
    const row = Number(customKey[0]);
    const col = Number(customKey[1]);
    if (row >= 0 && row < 8 && col >= 0 && col < 8 && (row + col) % 2 === 0) {
      const id = Math.floor((row * 8 + col) / 2);
      return id;
    }
    return -1; // Return undefined for invalid row or column or if the condition doesn't match
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
